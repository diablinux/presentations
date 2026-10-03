# Slide deck agent guide

Instructions for an AI assistant (or a human) creating a new talk in this repository. Follow them in order.

## 1. Gather the request

Collect or infer: topic, audience, **shape**, theme, presenter name and email, and the talk name (kebab-case). If something is missing, choose a reasonable default and report it as an assumption.

| Shape | Slides | Typical flow |
| --- | --- | --- |
| `standard` | 10–12 | why, pillars, mechanics, impact, steps, takeaways |
| `deep-dive` | 12–14 | adds an anatomy grid (cards), a two-frame comparison, gotchas |
| `comparison` | 8–10 | "A vs B" split, similarities, differences, criteria cards, how to choose |
| `workshop` | 10–12 | prerequisites, three hands-on code blocks, gotchas |
| `lightning` | 5–6 | what/why/how grid, one code slide, takeaways |

Themes: `kubernetes`, `docker`, `terraform`, `aws`, `monochrome`.

## 2. Workflow

1. `npm ci` (once) and `npx playwright install chromium` (once, for PDFs/tests).
2. `npm run new-talk -- --name <talk-name>` creates `talks/<talk-name>/`.
3. Edit `talks/<talk-name>/talk.config.js`: `title`, `theme`, and `brand` (`name`, `email`, optional `company`, `logo`, `conference`, `questionUrl`).
4. Replace the scaffold slides in `content/slides/` with the real deck. Files are two-digit prefixed (`01-welcome.md`); keep the closing slide last.
5. From the talk folder run `npm run build` (outputs `dist/index.html`) and `npm run pdf` (outputs `dist/<talk-name>.pdf`). `npm run handout` produces a 4-up PDF.
6. Preview with `npm run dev` (http://127.0.0.1:5173/) and check the cover and several content slides visually.
7. Report the preview, build and PDF locations plus any assumptions.

## 3. Slide format

Each slide is a Markdown file with YAML frontmatter:

```markdown
---
title: "Slide title"
slug: unique-slug
layout: bullets
eyebrow: "Section label"
subtitle: "Optional one-line summary."
notes: "Speaker notes - required on every slide."
section: true     # optional: marks a progress-strip section
reveal: true      # optional: ordered lists appear step by step
---
Body in Markdown.
```

Layouts: `title`, `divider`, `bullets`, `two-column`, `cards`, `comparison`, `quote`, `image`, `code`, `diagram`, `qa`, `closing`, `content`.

- `two-column` and `comparison` split the body at a standalone `---` line outside code fences.
- `cards` turns `##`/`###` headings into cards; use 3–4.
- `diagram` renders an animated flow from a frontmatter list: `flow: [Client, App, Database]`.
- `title` accepts `heading` (short cover text) in addition to `title`; long titles clip at cover size, so shorten `heading` and put detail in `subtitle`.
- Components go in frontmatter `components`: `terminal` (`command`, `output`) and `code-diff` (`before`, `after`).
- Presenter name and email appear on title/closing slides automatically from the config.
- The Kubernetes cover mark is opt-in (`coverMark: 'kubernetes'` in the config); do not enable it for other topics.

## 4. Authoring rules

- Do not use raw HTML in slide Markdown; tests forbid it in generated talks.
- One idea per slide, short bullets, no walls of text. Avoid more than about 6 bullets per slide.
- Keep claims accurate and vendor-neutral unless the topic is product-specific; avoid invented benchmarks, statistics, or version-specific claims. Note variability in speaker notes.
- Never put secrets, tokens, or real personal data in slides or examples.
- Code and config examples must be short and correct.
- Slide counts must match the chosen shape.

## 5. Completion checklist

- [ ] Slide count matches the shape; `slug`s are unique; closing slide is last
- [ ] Every slide has `notes`
- [ ] `talk.config.js` has the right title, theme, presenter name and email
- [ ] The talk README title is correct
- [ ] `npm run build` and `npm run pdf` succeed; page count equals slide count
- [ ] Cover title is not clipped and no unintended logo appears
- [ ] Assumptions reported

## 6. Example request

> Create a `standard` 10–12 slide technical talk called "AI Observability Fundamentals" for a general audience new to production observability. Explain logs, metrics and traces, include one concise OpenTelemetry configuration example and a troubleshooting workflow. Keep claims vendor-neutral, add speaker notes, use the Docker theme, presenter "Angel Cabrera", email `diablinux@gmail.com`. Name the talk `ai-observability-fundamentals`, build it, and report the preview/build/PDF locations and assumptions.

The result is in [`talks/ai-observability-fundamentals/`](./talks/ai-observability-fundamentals).
