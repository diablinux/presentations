import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');
const usage = 'Usage: npm run talk -- <talk-name> <check|build|pdf|handout|all> [--shape standard|deep-dive|comparison|workshop|lightning]';
const [name, command = 'check', ...rest] = process.argv.slice(2);
if (!name || name.startsWith('-')) fail(usage);

const dir = resolve(root, 'talks', name);
if (name === 'template' || !existsSync(resolve(dir, 'package.json'))) {
  fail(`talks/${name}/ does not exist. Create it first: npm run new-talk -- --name ${name}`);
}

const shapeRanges = { standard: [10, 12], 'deep-dive': [12, 14], comparison: [8, 10], workshop: [10, 12], lightning: [5, 6] };
const layouts = ['title', 'divider', 'bullets', 'two-column', 'comparison', 'cards', 'quote', 'code', 'diagram', 'image', 'qa', 'closing', 'content'];
const allowedEntries = new Set(['content', 'src', 'public', 'dist', 'node_modules', 'index.html', 'talk.config.js', 'package.json', 'README.md']);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function check() {
  const errors = [];
  const shape = rest.includes('--shape') ? rest[rest.indexOf('--shape') + 1] : undefined;
  for (const entry of readdirSync(dir)) {
    if (entry !== '.DS_Store' && !allowedEntries.has(entry)) errors.push(`Unexpected "${entry}" in talks/${name}/. Slides belong only in content/slides/; delete stray folders such as slides/.`);
  }
  const slidesDir = resolve(dir, 'content/slides');
  const files = existsSync(slidesDir) ? readdirSync(slidesDir).sort() : [];
  if (!files.length) errors.push('content/slides/ has no slides.');
  const slugs = new Set();
  const slides = [];
  for (const file of files) {
    if (!/^\d{2}-[a-z0-9-]+\.md$/.test(file)) {
      errors.push(`content/slides/${file}: name must look like 01-welcome.md.`);
      continue;
    }
    const source = readFileSync(resolve(slidesDir, file), 'utf8');
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) { errors.push(`${file}: missing YAML frontmatter.`); continue; }
    let data;
    try { data = parse(match[1]) ?? {}; } catch (error) { errors.push(`${file}: invalid YAML (${error.message.split('\n')[0]}).`); continue; }
    const layout = data.layout ?? 'content';
    slides.push({ file, layout, data });
    if (!data.title) errors.push(`${file}: "title" is required.`);
    if (!data.slug) errors.push(`${file}: "slug" is required.`);
    else if (slugs.has(data.slug)) errors.push(`${file}: duplicate slug "${data.slug}".`);
    else slugs.add(data.slug);
    if (!layouts.includes(layout)) errors.push(`${file}: unknown layout "${layout}". Use one of: ${layouts.join(', ')}.`);
    if (!String(data.notes ?? '').trim()) errors.push(`${file}: speaker "notes" are required.`);
    const prose = match[2].replace(/```[\s\S]*?```/g, '');
    if (/<\/?[a-z][^>]*>/i.test(prose)) errors.push(`${file}: raw HTML is not allowed.`);
    if (/Your name|you@example\.com|Add a short subtitle|Introduce the talk and its goals|Invite questions and share/i.test(source)) errors.push(`${file}: scaffold placeholder text remains.`);
    if (layout === 'qa' && /example\.com/.test(readFileSync(resolve(dir, 'talk.config.js'), 'utf8'))) errors.push('talk.config.js: qa slide needs a real questionUrl.');
  }
  const prefixes = new Set();
  for (const { file } of slides) {
    const prefix = file.slice(0, 2);
    if (prefixes.has(prefix)) errors.push(`${file}: duplicate number prefix "${prefix}"; renumber so each slide has a unique prefix.`);
    prefixes.add(prefix);
  }
  for (const slide of slides.slice(1, -1)) {
    if (slide.layout === 'closing') errors.push(`${slide.file}: layout "closing" is only allowed on the last slide.`);
  }
  if (slides.length) {
    if (slides[0].layout !== 'title') errors.push(`${slides[0].file}: first slide must use layout "title".`);
    if (slides.at(-1).layout !== 'closing') errors.push(`${slides.at(-1).file}: last slide must use layout "closing".`);
  }
  if (shape) {
    const range = shapeRanges[shape];
    if (!range) errors.push(`Unknown shape "${shape}".`);
    else if (slides.length < range[0] || slides.length > range[1]) errors.push(`Shape "${shape}" needs ${range[0]}-${range[1]} slides; found ${slides.length}.`);
  }
  const config = readFileSync(resolve(dir, 'talk.config.js'), 'utf8');
  const title = config.match(/title:\s*["']([^"']+)["']/)?.[1];
  if (/Your name|you@example\.com/.test(config)) errors.push('talk.config.js: set brand.name and brand.email.');
  if (slides[0] && title && slides[0].data.title !== title && !slides[0].data.heading) errors.push(`Cover title "${slides[0].data.title}" should match config title "${title}".`);
  if (errors.length) {
    console.error(`talks/${name}: ${errors.length} problem(s)\n- ${errors.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`talks/${name}: structure OK (${slides.length} slides).`);
  return slides.length;
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (script) => execFileSync(npm, ['run', script], { cwd: dir, stdio: 'inherit' });
const commands = { check, build: () => { check(); run('build'); }, pdf: () => { check(); run('pdf'); }, handout: () => { check(); run('handout'); } };

if (command === 'all') {
  const count = check();
  for (const script of ['build', 'pdf', 'handout']) run(script);
  for (const file of ['index.html', `${name}.pdf`, `${name}-handout.pdf`]) {
    if (!existsSync(resolve(dir, 'dist', file))) fail(`Missing talks/${name}/dist/${file}`);
  }
  console.log(`\nDone (${count} slides). Outputs in talks/${name}/dist/: index.html, ${name}.pdf, ${name}-handout.pdf`);
} else if (commands[command]) {
  commands[command]();
} else fail(usage);
