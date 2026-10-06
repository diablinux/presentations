import { execFileSync } from 'node:child_process';
import { cp, mkdir, readdir, readFile, rm, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const site = resolve(root, 'site');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (cwd, ...args) => execFileSync(npm, args, { cwd, stdio: 'inherit' });
const escapeHtml = (value) => value.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const exists = (path) => access(path).then(() => true, () => false);

await rm(site, { recursive: true, force: true });
await mkdir(resolve(site, 'talks'), { recursive: true });

run(root, 'run', 'build');
await cp(resolve(root, 'dist'), resolve(site, 'kubernetes'), { recursive: true });

const entries = [{ title: 'Kubernetes Concepts', href: 'kubernetes/' }];
const talkDirs = (await readdir(resolve(root, 'talks'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const name of talkDirs) {
  const dir = resolve(root, 'talks', name);
  if (!(await exists(resolve(dir, 'package.json')))) continue;
  run(dir, 'run', 'build');
  await cp(resolve(dir, 'dist'), resolve(site, 'talks', name), { recursive: true });
  const config = await readFile(resolve(dir, 'talk.config.js'), 'utf8');
  const title = config.match(/title:\s*["']([^"']+)["']/)?.[1] ?? name;
  entries.push({ title, href: `talks/${name}/` });
}

const items = entries
  .map((entry) => `<li><a href="${entry.href}">${escapeHtml(entry.title)}</a></li>`)
  .join('\n      ');
await writeFile(resolve(site, 'index.html'), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Slide decks</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #070b14; color: #e2e8f0; font: 1.1rem/1.6 system-ui, sans-serif; }
    main { width: min(36rem, 90vw); }
    ul { padding: 0; list-style: none; display: grid; gap: .75rem; }
    a { display: block; padding: 1rem 1.25rem; border: 1px solid #334155; border-radius: .75rem; color: inherit; text-decoration: none; }
    a:hover, a:focus-visible { border-color: #94a3b8; background: #0f172a; }
  </style>
</head>
<body>
  <main>
    <h1>Slide decks</h1>
    <ul>
      ${items}
    </ul>
  </main>
</body>
</html>
`);
console.log(`Site assembled in ${site} with ${entries.length} decks.`);
