import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';

const slidesDir = resolve(import.meta.dirname, '../content/slides');

test('example slides use Markdown and supported named layouts without authored HTML', () => {
  const files = readdirSync(slidesDir).filter((file) => file.endsWith('.md'));
  expect(files).toHaveLength(17);

  for (const file of files) {
    const source = readFileSync(resolve(slidesDir, file), 'utf8');
    expect(source, `${file} must have YAML frontmatter`).toMatch(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
    const layout = source.match(/^layout:\s*["']?([\w-]+)/m)?.[1];
    expect(
      ['title', 'divider', 'bullets', 'two-column', 'cards', 'comparison', 'quote', 'image', 'code', 'diagram', 'qa', 'closing', 'content'],
      `${file} must declare a named layout`
    ).toContain(layout);
    const markdown = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '');
    expect(markdown, `${file} must not contain authored HTML`).not.toMatch(/<\/?[a-z][\w-]*(?:\s[^>]*)?>/i);
  }
});
