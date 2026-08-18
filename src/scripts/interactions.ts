export function initAxiomInteractions() {
  // 1. Cinematic Reveal Observer
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );
  reveals.forEach((reveal) => revealObserver.observe(reveal));

  // 2. Active Section Highlighting (Navbar Title Updater)
  const navTitle = document.getElementById("navTitle");
  const sections = document.querySelectorAll("section, footer");
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const newTitle = entry.target.getAttribute("data-nav-title");
          if (newTitle && navTitle && navTitle.textContent !== newTitle) {
            navTitle.style.opacity = "0";
            setTimeout(() => {
              if (navTitle) {
                navTitle.textContent = newTitle;
                navTitle.style.opacity = "1";
              }
            }, 200);
          }
        }
      });
    },
    { threshold: [0.5, 0.6] },
  );
  sections.forEach((sec) => navObserver.observe(sec));

  // 3. Scroll Progress Bar
  const progressBar = document.getElementById("scrollProgress");
  const updateProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    progressBar.style.width = scrollPercent + "%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });

  // 4. Overlay Menu Logic
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const overlayMenu = document.getElementById("overlayMenu");
  const overlayLinks = document.querySelectorAll(".overlay-nav a");

  const openMenu = () => {
    overlayMenu?.classList.add("active");
    document.body.style.overflow = "hidden";
  };
  const closeMenu = () => {
    overlayMenu?.classList.remove("active");
    document.body.style.overflow = "";
  };

  menuToggle?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  overlayLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlayMenu?.classList.contains("active")) {
      closeMenu();
    }
  });
}
