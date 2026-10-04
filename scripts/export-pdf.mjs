import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const handout = process.argv.includes('--handout');
const isProject = process.argv.includes('--project');
const root = isProject ? process.cwd() : resolve(import.meta.dirname, '..');
const outputDir = resolve(root, 'dist');
const exportName = isProject ? basename(root) : 'kubernetes-concepts';
const htmlPath = resolve(outputDir, 'index.html');
const outputPath = resolve(outputDir, `${exportName}${handout ? '-handout' : ''}.pdf`);
const otherExportName = `${exportName}${handout ? '' : '-handout'}.pdf`;
const otherExportPath = resolve(outputDir, otherExportName);
const previousOtherExport = existsSync(otherExportPath) ? await readFile(otherExportPath) : null;

execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });
await mkdir(outputDir, { recursive: true });
if (previousOtherExport) await writeFile(otherExportPath, previousOtherExport);

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const url = new URL(pathToFileURL(htmlPath));
  if (handout) url.searchParams.set('handout', '1');
  await page.goto(url.href, { waitUntil: 'load' });
  await page.locator('.slide').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  const slideCount = await page.locator('#deck > .slide').count();
  await page.emulateMedia({ media: 'print' });
  const pdf = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  const pageCount = [...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length;
  const expectedPages = handout ? Math.ceil(slideCount / 4) : slideCount;
  if (pageCount !== expectedPages) {
    throw new Error(`PDF page count mismatch: expected ${expectedPages}, got ${pageCount}.`);
  }
  await writeFile(outputPath, pdf);
  console.log(`Wrote ${outputPath}`);
} finally {
  await browser.close();
}
