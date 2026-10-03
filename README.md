# Kubernetes slide deck template

A browser-based slide deck and a reusable template for technical talks. The example is authored in Markdown, styled with Tailwind CSS, and built into one self-contained HTML file with locally bundled fonts. The source code and current feature checklist are in the project; the Kubernetes presentation is the working example.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- Chromium (only for automated tests and PDF generation; install it once with `npx playwright install chromium`)

## Start the example

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Changes to Markdown, JavaScript, and CSS reload in the browser. To create the distributable, run:

```sh
npm run build
```

The output is `dist/kubernetes-concepts-deepseek.html`. It includes the scripts, styles, Tailwind utilities, and Inter / JetBrains Mono fonts, and can be opened directly in a browser without a build server or internet connection.

For offline cache support, serve the `dist/` folder over `http://localhost` or HTTPS, open the deck once, then reload after disconnecting from the network. Browsers do not allow service workers from `file://`; the self-contained HTML itself remains usable offline regardless.

## Navigate and present

| Key / control | Action |
| --- | --- |
| `→`, `Page Down`, `Space` | Next slide or reveal the next staged item |
| `←`, `Page Up`, `Shift` + `Space` | Previous slide |
| `Home` / `End` | First / last slide |
| `M` | Open or close the outline |
| `O` | Open the slide overview; use arrow keys to move between thumbnails and Enter to choose |
| `P` | Open the synchronized presenter window |
| `F` | Toggle fullscreen |
| `L` | Toggle the laser pointer; `Escape` clears its marks |
| `?` | Show the shortcut reference |
| `Escape` | Close an open dialog / outline |

Slides are deep-linkable by number or slug, for example `#8` or `#services`. The presenter window includes current and next slide previews, the current slide's notes, and an elapsed timer; navigation in either window stays synchronized. Browsers may block pop-ups, so allow them for the presentation page.

## Author slides in Markdown

Add a numbered file under `content/slides/`, for example `18-my-topic.md`:

```markdown
---
title: "My topic"
slug: "my-topic"
layout: bullets
eyebrow: "Section name"
subtitle: "A short introduction to this slide."
notes: "A short reminder for the presenter."
section: true
reveal: true
---

1. First idea, revealed on the next key press.
2. Second idea, revealed after the first.
```

The numeric filename prefix determines slide order. Frontmatter supports:

- `title` and `slug` for the accessible slide name and shareable fragment
- `heading`, `eyebrow`, `subtitle`, `tags` for the slide's shared header and cover content
- `layout` for one of `title`, `divider`, `bullets`, `two-column`, `cards`, `comparison`, `quote`, `image`, `code`, `diagram`, `qa`, `closing`, or `content`
- `notes` for presenter-only notes
- `section: true` for a larger tick in the progress strip
- `reveal: true` to stage items in an ordered list, advancing each item before navigation moves to the next slide
- `flow` for a reusable animated flow diagram, declared as a YAML list of labels

All 17 example slides use Markdown and YAML frontmatter; raw HTML is disabled in slide Markdown. `cards` turns each level-three heading and its following content into a reusable card. `two-column` and `comparison` split Markdown at a horizontal rule (`---`); fenced code blocks can contain YAML document separators without splitting the columns. Add fenced code blocks with language identifiers for readable, syntax-highlighted examples.

### Reusable slide components

- **Terminal:** add a typed component to frontmatter to render a replayable, reduced-motion-aware command:
  ```yaml
  components:
    - type: terminal
      command: kubectl get pods
      output: "web-0   1/1   Running"
  ```
- **Code diff:** use `type: code-diff` with `before` and `after` strings in a slide's `components` list. It renders side-by-side removed/added examples.
- **Q&A QR:** use `layout: qa`, then set `qr: questionUrl`. Configure the destination in the talk's brand configuration; only HTTP(S) URLs are accepted.
- **Diagram flow:** add `flow: [Client, Service, Pods]` to frontmatter. The shared layout creates the animated, accessible SVG.

Components are declarative frontmatter objects rendered by the shared runtime; arbitrary slide HTML is not supported. Add a reusable renderer and its layout styles when a talk needs a new component.

## Updating slides contents

Edit the numbered Markdown files under `content/slides/` in your generated talk project. To preview edits as you work, run the development server from that project directory:

```sh
cd talks/my-new-talk
npm run dev
```

When you are ready to regenerate the standalone `dist/index.html`, run the build from the same directory:

```sh
npm run build
```

The generated HTML will include your latest Markdown content. Run `npm run pdf` afterward if you also want to regenerate the PDF.

## Themes and branding

Change `brand` in [`src/theme.js`](./src/theme.js) to set the presenter name, email, company, logo, conference, and Q&A form URL. The cover and closing slides use the shared author and email values; optional company, logo, and conference fields are added to both. The Kubernetes example opts into its animated helm cover mark with `coverMark: 'kubernetes'`; generated talks omit that Kubernetes-specific art by default. The same file defines the five color palettes and the semantic surface, syntax, font, and spacing tokens used by the shared shell.

Five themes are available through the URL:

```text
?theme=kubernetes
?theme=docker
?theme=terraform
?theme=aws
?theme=monochrome
```

Example: `kubernetes-concepts-deepseek.html?theme=terraform#pods`. The deck also responds to the operating system's reduced-motion and increased-contrast preferences. Automated browser tests composite translucent backgrounds and check more than 100 text combinations plus gradient text stops in every theme against WCAG AA contrast.

## Build, test, and export

```sh
npm run build                 # one offline-capable HTML file
npx playwright install chromium
npm test                      # headless navigation, accessibility, and feature checks
npm run pdf                    # one landscape slide per PDF page
npm run handout                # four slides per landscape PDF page
```

PDFs are written under `dist/`. The **PDF** control remains available as a browser print-dialog fallback. The scripted PDF export sets landscape A4, print backgrounds, and margins automatically. The handout command uses the `?handout=1` print layout.

## Start a new talk

```sh
npm run new-talk -- --name my-new-talk
```

This creates a complete `talks/my-new-talk/` project with opening and closing Markdown slides, an editable `talk.config.js`, and the same presentation runtime, layouts, themes, accessibility features, offline support, and build pipeline as the Kubernetes example. From the generated folder, run `npm run dev`, `npm run build`, `npm run pdf`, or `npm run handout`. The generated package uses the template project's installed dependencies and shared Vite/PDF tooling.

Add ordered Markdown files under `content/slides/` and edit `talk.config.js` to set the title, theme, and presenter branding. See the generated project's README for its quick start and this guide for the full authoring reference.

For AI-assisted deck creation, see [`AGENT.md`](./AGENT.md) for the project-specific authoring instructions, available slide shapes and components, a creation workflow, and an example request.

## Deployment and releases

The GitHub Actions workflow runs the tests, then `npm run build:site`, and publishes the result to GitHub Pages on pushes to `main` and on manual dispatch. The site has a landing page at the root, the Kubernetes example at `/kubernetes/`, and every talk under `talks/` at `/talks/<talk-name>/`. Enable **Settings → Pages → Build and deployment → Source: GitHub Actions** in the repository. To preview the combined site locally, run `npm run build:site` and serve the generated `site/` folder (for example `python3 -m http.server -d site`). Releases follow Semantic Versioning; see [`CHANGELOG.md`](./CHANGELOG.md).

## Current scope

The project supports Markdown-only slide sources, named reusable layouts, five themes, shared branding, notes, presenter view, overview and shortcut dialogs, deep links, accessibility modes, staged reveals, diagram/terminal/diff/QR components, PDF and handout exports, offline output, browser tests, and Pages deployment. The Kubernetes example and generated talks share the same Markdown authoring format and runtime.
