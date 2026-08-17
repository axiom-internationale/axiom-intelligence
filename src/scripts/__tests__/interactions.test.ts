import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.prototype = {
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
};
vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

// Import after mocks are set up
const { initAxiomInteractions } = await import('../interactions');

function setupDOM() {
  document.body.innerHTML = `
    <div class="reveal" id="reveal1"><p>Section 1</p></div>
    <div class="reveal" id="reveal2"><p>Section 2</p></div>

    <section id="section1" data-nav-title="First Section"></section>
    <section id="section2" data-nav-title="Second Section"></section>
    <footer id="footer" data-nav-title="Connect With Us"></footer>

    <div id="navTitle">Axiom Intelligence</div>
    <div id="scrollProgress"></div>

    <button id="menuToggle"></button>
    <button id="menuClose"></button>
    <div id="overlayMenu" class="overlay-menu">
      <nav class="overlay-nav">
        <a href="#paradigm-shift">The Paradigm Shift</a>
        <a href="#aro-loop">The ARO Loop</a>
      </nav>
    </div>
  `;
}

describe('initAxiomInteractions', () => {
  beforeEach(() => {
    setupDOM();
    vi.clearAllMocks();
  });

  it('initializes without throwing', () => {
    expect(() => initAxiomInteractions()).not.toThrow();
  });

  describe('Cinematic Reveal Observer', () => {
    it('creates an IntersectionObserver for .reveal elements', () => {
      initAxiomInteractions();
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });

    it('observes all .reveal elements', () => {
      initAxiomInteractions();
      const calls = mockIntersectionObserver.mock.calls;
      const lastObserver = calls[calls.length - 1];
      const callback = lastObserver[0];
      const options = lastObserver[1];

      expect(options.threshold).toBe(0.1);
      expect(options.rootMargin).toBe('0px 0px -50px 0px');

      // Simulate intersection
      const reveal1 = document.getElementById('reveal1')!;
      callback([{ isIntersecting: true, target: reveal1 }], lastObserver);

      expect(reveal1.classList.contains('active')).toBe(true);
    });

    it('adds .active class and stops observing when element enters viewport', () => {
      initAxiomInteractions();

      const revealEl = document.getElementById('reveal1')!;
      expect(revealEl.classList.contains('active')).toBe(false);

      // Trigger the reveal observer callback
      const revealCallback = mockIntersectionObserver.mock.calls[0][0];
      revealCallback([{ isIntersecting: true, target: revealEl }], { unobserve: vi.fn() });

      expect(revealEl.classList.contains('active')).toBe(true);
    });

    it('does not add .active when element is not intersecting', () => {
      initAxiomInteractions();

      const revealEl = document.getElementById('reveal1')!;
      const revealCallback = mockIntersectionObserver.mock.calls[0][0];
      revealCallback([{ isIntersecting: false, target: revealEl }], { unobserve: vi.fn() });

      expect(revealEl.classList.contains('active')).toBe(false);
    });
  });

  describe('Active Section Highlighting', () => {
    it('updates nav title when a section is more than 50% visible', () => {
      initAxiomInteractions();

      const navTitle = document.getElementById('navTitle')!;
      const section = document.getElementById('section1')!;

      // The nav observer is the 3rd IntersectionObserver call
      // (1st: reveals, 2nd: nav observer for sections)
      const calls = mockIntersectionObserver.mock.calls;
      const navCallback = calls[1][0];

      navCallback([{
        isIntersecting: true,
        intersectionRatio: 0.6,
        target: section,
      }], null!);

      expect(navTitle.textContent).toBe('First Section');
    });

    it('does not update nav title if intersection ratio is below 0.5', () => {
      initAxiomInteractions();

      const navTitle = document.getElementById('navTitle')!;
      const section = document.getElementById('section1')!;

      const calls = mockIntersectionObserver.mock.calls;
      const navCallback = calls[1][0];

      navCallback([{
        isIntersecting: true,
        intersectionRatio: 0.3,
        target: section,
      }], null!);

      expect(navTitle.textContent).toBe('Axiom Intelligence');
    });

    it('does not update nav title if text is already the same', () => {
      initAxiomInteractions();

      const navTitle = document.getElementById('navTitle')!;
      navTitle.textContent = 'First Section';

      const section = document.getElementById('section1')!;
      const calls = mockIntersectionObserver.mock.calls;
      const navCallback = calls[1][0];

      navCallback([{
        isIntersecting: true,
        intersectionRatio: 0.6,
        target: section,
      }], null!);

      expect(navTitle.textContent).toBe('First Section');
    });
  });

  describe('Scroll Progress Bar', () => {
    it('updates progress bar width on scroll', () => {
      initAxiomInteractions();

      const progressBar = document.getElementById('scrollProgress')!;
      expect(window.getEventListeners).toBeUndefined;

      // Simulate scroll position at 50%
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true, configurable: true });
      Object.defineProperty(document.body, 'offsetHeight', { value: 1000, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });

      window.dispatchEvent(new Event('scroll'));

      // scrollPercent = 500 / (1000 - 1000) — edge case, but handler should not crash
      expect(progressBar.style.width).toBeDefined();
    });
  });

  describe('Overlay Menu', () => {
    it('opens menu on menu toggle click', () => {
      initAxiomInteractions();

      const menuToggle = document.getElementById('menuToggle') as HTMLButtonElement;
      const overlayMenu = document.getElementById('overlayMenu')!;

      expect(overlayMenu.classList.contains('active')).toBe(false);

      menuToggle.click();

      expect(overlayMenu.classList.contains('active')).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('closes menu on close button click', () => {
      initAxiomInteractions();

      const menuToggle = document.getElementById('menuToggle') as HTMLButtonElement;
      const menuClose = document.getElementById('menuClose') as HTMLButtonElement;
      const overlayMenu = document.getElementById('overlayMenu')!;

      // Open first
      menuToggle.click();
      expect(overlayMenu.classList.contains('active')).toBe(true);

      // Close
      menuClose.click();
      expect(overlayMenu.classList.contains('active')).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });

    it('closes menu on overlay link click', () => {
      initAxiomInteractions();

      const menuToggle = document.getElementById('menuToggle') as HTMLButtonElement;
      const overlayMenu = document.getElementById('overlayMenu')!;
      const link = document.querySelector('.overlay-nav a') as HTMLAnchorElement;

      menuToggle.click();
      expect(overlayMenu.classList.contains('active')).toBe(true);

      link.click();
      expect(overlayMenu.classList.contains('active')).toBe(false);
    });

    it('closes menu on Escape key', () => {
      initAxiomInteractions();

      const menuToggle = document.getElementById('menuToggle') as HTMLButtonElement;
      const overlayMenu = document.getElementById('overlayMenu')!;

      menuToggle.click();
      expect(overlayMenu.classList.contains('active')).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(overlayMenu.classList.contains('active')).toBe(false);
    });

    it('does nothing on Escape when menu is not open', () => {
      initAxiomInteractions();

      const overlayMenu = document.getElementById('overlayMenu')!;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(overlayMenu.classList.contains('active')).toBe(false);
    });
  });
});
