import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');

test('new-talk generates a Markdown deck using shared runtime and PDF tooling', async ({ page }) => {
  const slug = `test-generated-talk-${process.pid}`;
  const project = resolve(root, 'talks', slug);
  let server;
  try {
    execFileSync(process.execPath, [resolve(root, 'scripts/new-talk.mjs'), '--name', slug], {
      cwd: root,
      stdio: 'inherit'
    });
    for (const slideName of ['01-welcome.md', '99-thank-you.md']) {
      const source = await readFile(resolve(project, 'content/slides', slideName), 'utf8');
      expect(source).not.toMatch(/<\/?[a-z][^>]*>/i);
    }
    execFileSync('npm', ['run', 'pdf'], { cwd: project, stdio: 'inherit' });
    expect(existsSync(resolve(project, 'dist', `${slug}.pdf`))).toBe(true);

    await page.goto(pathToFileURL(resolve(project, 'dist/index.html')).href);
    await expect(page.locator('#deck > .slide')).toHaveCount(2);
    await expect(page.locator('#deck > .slide.active h1')).toHaveText(`Test Generated Talk ${process.pid}`);
    await expect(page.locator('#deck > .slide.active .slide-hero-mark')).toHaveCount(0);
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#counter')).toHaveText('02 / 02');
    await expect(page.locator('#deck > .slide.active h1')).toHaveText('Thank You');
    await expect(page.locator('#deck > .slide.active .slide-subtitle')).toHaveText('Questions?');

    server = createServer((request, response) => {
      const fileName = request.url === '/sw.js' ? 'sw.js' : request.url === '/index.html' ? 'index.html' : null;
      if (!fileName) {
        response.writeHead(404).end();
        return;
      }
      response.setHeader('Content-Type', fileName.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/javascript; charset=utf-8');
      response.end(readFileSync(resolve(project, 'dist', fileName)));
    });
    await new Promise((resolveListen, rejectListen) => {
      server.once('error', rejectListen);
      server.listen(0, '127.0.0.1', resolveListen);
    });
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Unable to start the generated-talk test server.');
    await page.goto(`http://127.0.0.1:${address.port}/index.html`);
    await page.evaluate(() => navigator.serviceWorker.register('./sw.js'));
    await page.waitForFunction(async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      return registrations.some((registration) => registration.active?.state === 'activated');
    });
    await page.reload();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await page.context().setOffline(true);
    await page.reload();
    await expect(page.locator('#deck > .slide')).toHaveCount(2);
    await page.context().setOffline(false);
  } finally {
    if (server?.listening) {
      await new Promise((resolveClose, rejectClose) => {
        server.close((error) => error ? rejectClose(error) : resolveClose());
      });
    }
    rmSync(project, { recursive: true, force: true });
  }
});
