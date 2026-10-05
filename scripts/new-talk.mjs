import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const requestedName = args.includes('--name') ? args[args.indexOf('--name') + 1] : args[0];
if (!requestedName) throw new Error('Usage: npm run new-talk -- --name my-talk');
const slug = requestedName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
if (!slug) throw new Error('Talk name must contain at least one letter or number.');

const title = requestedName.trim().replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const root = resolve(import.meta.dirname, '..');
const destination = resolve(root, 'talks', slug);
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
  writeFile(resolve(slides, '99-thank-you.md'), closing, { flag: 'wx' }),
  writeFile(resolve(destination, 'package.json'), `${JSON.stringify(packageManifest, null, 2)}\n`, { flag: 'wx' }),
];
await Promise.all(templateFiles);
console.log(`Created a Markdown talk project at ${destination}

Next steps:
  1. Edit talks/${slug}/talk.config.js (title, theme, brand).
  2. Replace talks/${slug}/content/slides/01-welcome.md and 99-thank-you.md (placeholders) and add the other slides in the same folder. Do not create any other slides folder.
  3. Validate and export: npm run talk -- ${slug} all   (output goes to talks/${slug}/dist/, never the root dist/)`);
