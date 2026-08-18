.PHONY: dev build preview lint format types clean help

dev:
	bun run dev

build:
	bun run build

preview:
	bun run preview

lint:
	bun run lint

format:
	bun run format

types:
	bun run generate-types

clean:
	rm -rf dist/
	rm -rf .astro/

help:
	@echo "Available commands:"
	@echo "  make dev      - Start development server"
	@echo "  make build    - Build for production"
	@echo "  make preview  - Preview production build"
	@echo "  make lint     - Run linting"
	@echo "  make format   - Format code with prettier"
	@echo "  make types    - Generate Cloudflare types"
	@echo "  make clean    - Clean build artifacts"
	@echo "  make help     - Show this help"