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
3. Edit `talks/<talk-name>/talk.config.js` (see section 3). The scaffold derives a title-cased name such as "Openshift Vs Kubernetes"; set the correct title in the config, the talk `README.md` heading and the cover slide.
4. Replace the scaffold slides in `content/slides/` with the real deck. Files are two-digit prefixed (`01-welcome.md`); keep the closing slide last.
5. From the talk folder run `npm run build` (outputs `dist/index.html`) and `npm run pdf` (outputs `dist/<talk-name>.pdf`) and `npm run handout` (four slides per page, `dist/<talk-name>-handout.pdf`). Each export verifies its own page count.
6. Preview with `npm run dev` (http://127.0.0.1:5173/) and check the cover and several content slides visually.
7. Report the preview, build and PDF locations plus any assumptions.

## 3. Slide format

Each slide is a Markdown file `content/slides/NN-name.md` (the two-digit prefix sets the order) that starts with YAML frontmatter:

```markdown
---
title: "Slide title"        # required; used in the outline and as the heading
heading: "Shorter heading"  # optional; overrides title on the slide itself
slug: unique-slug           # unique per talk; used for deep links (#slug)
layout: bullets
eyebrow: "Section label"    # optional small label above the heading
subtitle: "One-line summary."  # optional
notes: "Speaker notes - required on every slide."
section: true               # optional: marks a section in the progress strip
reveal: true                # optional: ordered lists appear step by step
---
Body in Markdown.
```

Quote YAML values that contain `:`, `#` or quotes. The slide count includes the cover and the closing slide.

### Layouts

| Layout | Use it for | Body |
| --- | --- | --- |
| `title` | Cover (first slide) | No body. Optional `heading`, `subtitle`, `eyebrow`, `tags: [a, b]`. Presenter name and email are added from the config |
| `divider` | Section break | Short text |
| `bullets` | Lists | Markdown list; use `reveal: true` with an ordered list for step-by-step |
| `two-column` | Side-by-side content | Two blocks separated by one standalone `---` line |
| `comparison` | A vs B | Same split as `two-column`, one block per side, each starting with a heading |
| `cards` | Grids of 3–4 ideas | Each `##` or `###` heading starts a card |
| `quote` | A quote | Markdown blockquote plus attribution |
| `code` | Code or config | Fenced code block with a language, plus a short explanation |
| `diagram` | Flows | `flow: [Step 1, Step 2, Step 3]` in frontmatter (2–5 short labels), plus a short body |
| `image` | Figures | Markdown image with alt text; use an inline `data:` URI (for example SVG) so the build stays a single self-contained HTML file; files in `public/` are copied beside it, not inlined |
| `qa` | Questions with a QR code | `questionUrl` in `talk.config.js` must be a real URL; optional `caption` and `qr: <configKey>` |
| `closing` | Final slide | No body. Optional `subtitle`; contact details come from the config |
| `content` | Default free-form slide | Any Markdown |

`two-column` and `comparison` split only at the first standalone `---` outside code fences, so use exactly one separator.

### Components (frontmatter `components`, a list rendered after the body)

```yaml
components:
  - type: terminal
    command: kubectl get pods
    output: |-
      NAME   READY   STATUS
  - type: code-diff
    before: "replicas: 1"
    after: "replicas: 3"
```

`terminal` needs string `command` and `output`; `code-diff` needs string `before` and `after`. The build fails on unknown component types.

### Not supported

Video, charts, three-column layouts, warning/info panels and raw HTML. Use `cards`, `two-column`, a blockquote or a `diagram` flow instead, and mention the substitution in the report.

### Talk config (`talks/<talk-name>/talk.config.js`)

```js
export default {
  title: "Talk title",
  theme: 'docker',        // kubernetes | docker | terraform | aws | monochrome
  brand: {
    name: 'Presenter',
    email: 'me@example.com',
    company: '',
    logo: '',
    conference: '',
    questionUrl: 'https://example.com/questions'
  }
  // coverMark: 'kubernetes'  // opt-in Kubernetes cover logo; never use for other topics
};
```

Presenter name and email always go in `brand`, never hard-coded in slides.

## 4. Authoring rules

- Do not use raw HTML in slide Markdown; tests forbid it in generated talks.
- One idea per slide, short bullets, no walls of text. Avoid more than about 6 bullets per slide.
- Keep claims accurate and vendor-neutral unless the topic is product-specific; avoid invented benchmarks, statistics, or version-specific claims. Note variability in speaker notes.
- Edit only files inside `talks/<talk-name>/`; leave the root example, other talks, `src/` and `talks/template/` alone unless asked.
- Do not commit, push, or create GitHub issues or pull requests unless asked. Every talk under `talks/` is published automatically by the Pages workflow (`npm run build:site`).
- Never put secrets, tokens, or real personal data in slides or examples.
- Code and config examples must be short and correct.
- Slide counts must match the chosen shape.

## 5. Completion checklist

- [ ] Slide count matches the shape; `slug`s are unique; closing slide is last
- [ ] Every slide has `notes`
- [ ] `talk.config.js` has the right title, theme, presenter name and email
- [ ] The talk README title is correct
- [ ] `npm run build`, `npm run pdf` and `npm run handout` succeed; page counts match the slide count
- [ ] Cover title is not clipped and no unintended logo appears
- [ ] No placeholder text remains ("Your name", `you@example.com`, scaffold subtitles, the `example.com` question URL if a `qa` slide is used)
- [ ] Final report lists the preview command, build path, PDF paths and assumptions

## 6. Example request

> Create a `standard` 10–12 slide technical talk called "AI Observability Fundamentals" for a general audience new to production observability. Explain logs, metrics and traces, include one concise OpenTelemetry configuration example and a troubleshooting workflow. Keep claims vendor-neutral, add speaker notes, use the Docker theme, presenter "Angel Cabrera", email `diablinux@gmail.com`. Name the talk `ai-observability-fundamentals`, build it, and report the preview/build/PDF locations and assumptions.

The result is in [`talks/ai-observability-fundamentals/`](./talks/ai-observability-fundamentals).
