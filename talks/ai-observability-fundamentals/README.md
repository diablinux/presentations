# AI Observability Fundamentals

This talk uses the shared Markdown, layout, theme, accessibility, and presentation runtime.

## Run and build

From this directory:

```sh
npm run dev
npm run build
npm run pdf
npm run handout
```

The commands use the parent template project's installed dependencies and shared Vite configuration. The standalone deck and generated PDFs are written to `dist/`.

## Author slides

Add numbered Markdown files to `content/slides/`. Each file starts with YAML frontmatter; see the generated opening and closing slides for examples. Configure the title, theme, and speaker branding in `talk.config.js`. For supported layouts, components, keyboard controls, and themes, see the template [README](../../README.md).

## Updating slides contents

Edit the Markdown files in `content/slides/`. Run `npm run dev` from this project directory to preview edits as you work. To regenerate the standalone `dist/index.html` after making changes, run:

```sh
npm run build
```

Run `npm run pdf` if you also want to regenerate the PDF export.
