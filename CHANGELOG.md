# Changelog

## Unreleased

- Add README badges and an MIT `LICENSE`.
- Publish the Kubernetes example and every talk to GitHub Pages via `npm run build:site`.
- Add `AGENT.md` authoring guide and OpenShift vs Kubernetes and AI Observability example talks.

- Extract the presentation shell into shared CSS and runtime modules for generated talks.
- Make new-talk projects use the same Markdown, theme, offline, build, and PDF workflows as the example.
- Add WCAG AA contrast checks across every theme, including CSS gradient text color stops.
- Fix generated-project PDF export and support project-local Vite entry points.

## 1.0.0 - 2026-10-03

- Introduce a Markdown-authored Kubernetes example deck and reusable slide layouts.
- Add local themes, branding, presenter tools, accessibility modes, and interactive slide components.
- Bundle styles and fonts into a single offline-capable HTML artifact.
- Add automated PDF and handout export, browser smoke tests, and GitHub Pages deployment.
