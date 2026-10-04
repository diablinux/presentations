import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const requestedName = args.includes('--name') ? args[args.indexOf('--name') + 1] : args[0];
if (!requestedName) throw new Error('Usage: npm run new-talk -- --name my-talk');
const slug = requestedName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
if (!slug) throw new Error('Talk name must contain at least one letter or number.');

const title = requestedName.trim().replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const destination = resolve('talks', slug);
const root = resolve(import.meta.dirname, '..');
const shell = await readFile(resolve(root, 'talks/template/index.html'), 'utf8');
await mkdir(destination, { recursive: false });
const slides = resolve(destination, 'content/slides');
await Promise.all([
  mkdir(slides, { recursive: true }),
  mkdir(resolve(destination, 'src'), { recursive: true }),
  mkdir(resolve(destination, 'public'), { recursive: true })
]);

const config = `export default {
  title: ${JSON.stringify(title)},
  theme: 'kubernetes',
  brand: {
    name: 'Your name',
    email: 'you@example.com',
    company: '',
    logo: '',
    conference: '',
    questionUrl: 'https://example.com/questions'
  }
};
`;
const entry = `import { startDeck } from '../../../src/deck-runtime.js';
import talkConfig from '../talk.config.js';

const sources = import.meta.glob('../content/slides/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

await startDeck(sources, talkConfig);
`;
const welcome = `---
title: ${JSON.stringify(title)}
slug: welcome
layout: title
subtitle: "Add a short subtitle describing this presentation."
notes: "Introduce the talk and its goals."
---
`;
const closing = `---
title: "Thank You"
slug: thank-you
layout: closing
subtitle: "Questions?"
notes: "Invite questions and share your contact details."
---
`;
const readme = `# ${title}

This talk uses the shared Markdown, layout, theme, accessibility, and presentation runtime.

## Run and build

From this directory:

\`\`\`sh
npm run dev
npm run build
npm run pdf
npm run handout
\`\`\`

The commands use the parent template project's installed dependencies and shared Vite configuration. The standalone deck and generated PDFs are written to \`dist/\`.

## Author slides

Add numbered Markdown files to \`content/slides/\`. Each file starts with YAML frontmatter; see the generated opening and closing slides for examples. Configure the title, theme, and speaker branding in \`talk.config.js\`. For supported layouts, components, keyboard controls, and themes, see the template [README](../../README.md).
`;
const packageManifest = {
  name: slug,
  private: true,
  type: 'module',
  scripts: {
    dev: 'vite --config ../../vite.config.js',
    build: 'vite build --config ../../vite.config.js',
    preview: 'vite preview --config ../../vite.config.js',
    pdf: 'node ../../scripts/export-pdf.mjs --project',
    handout: 'node ../../scripts/export-pdf.mjs --project --handout'
  }
};
const templateFiles = [
  writeFile(resolve(destination, 'index.html'), shell, { flag: 'wx' }),
  writeFile(resolve(destination, 'talk.config.js'), config, { flag: 'wx' }),
  writeFile(resolve(destination, 'src/main.js'), entry, { flag: 'wx' }),
  writeFile(resolve(slides, '01-welcome.md'), welcome, { flag: 'wx' }),
  writeFile(resolve(slides, '02-thank-you.md'), closing, { flag: 'wx' }),
  writeFile(resolve(destination, 'README.md'), readme, { flag: 'wx' }),
  writeFile(resolve(destination, 'package.json'), `${JSON.stringify(packageManifest, null, 2)}\n`, { flag: 'wx' }),
];
await Promise.all(templateFiles);
console.log(`Created a Markdown talk project at ${destination}`);
