import { expect, test } from '@playwright/test';

test('loads every slide and navigates with numeric and named deep links', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#1');
  await expect(page.locator('#deck > .slide')).toHaveCount(17);
  await expect(page.locator('#deck > .slide.active')).toHaveAttribute('data-title', 'Title');
  await expect(page.locator('#deck > .slide.active .slide-hero-mark')).toHaveCount(1);

  for (let index = 1; index < 16; index += 1) {
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#deck > .slide.active')).toHaveCount(1);
    await expect(page.locator('#counter')).toHaveText(new RegExp(`^\\d{2} / 17$`));
  }
  while (await page.locator('#deck > .slide.active').getAttribute('data-title') !== 'Thank You') {
    await page.keyboard.press('ArrowRight');
  }
  await expect(page.locator('#deck > .slide.active')).toHaveAttribute('data-title', 'Thank You');
  await page.goto('/#services');
  await expect(page.locator('#deck > .slide.active')).toHaveAttribute('data-title', 'Services');
  expect(errors).toEqual([]);
});

test('opens the slide overview and navigates from a thumbnail', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('o');
  await expect(page.getByRole('dialog', { name: 'Slide overview' })).toBeVisible();
  await page.locator('#overviewDialog .overview-grid > button').nth(7).click();
  await expect(page.locator('#deck > .slide.active')).toHaveAttribute('data-title', 'Services');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('overview arrow keys move thumbnail focus without changing the slide', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('o');
  const first = page.locator('#overviewDialog .overview-grid > button').first();
  await expect(first).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#overviewDialog .overview-grid > button').nth(1)).toBeFocused();
  await expect(page.locator('#deck > .slide.active')).toHaveAttribute('data-title', 'Title');
});

test('provides semantic slide focus, speaker notes and theme query support', async ({ page }) => {
  await page.goto('/?theme=terraform#pods');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'terraform');
  await expect(page.locator('#deck > .slide.active')).toHaveAttribute('role', 'group');
  await expect(page.locator('#deck > .slide.active')).toHaveAttribute('aria-roledescription', 'slide');
  await expect(page.locator('#deck > .slide.active .speaker-notes')).toBeAttached();
  await expect(page.locator('#deck > .slide.active h2')).toBeFocused();
});

test('linear reading mode exposes the complete deck without fixed controls', async ({ page }) => {
  await page.goto('/?view=linear');
  await expect(page.locator('body')).toHaveClass(/linear-mode/);
  await expect(page.locator('#deck > .slide')).toHaveCount(17);
  await expect(page.locator('body > footer')).toBeHidden();
  await expect(page.locator('#deck > .slide').nth(15)).toBeVisible();
});

test('shortcut help lists presentation controls', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('?');
  await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeVisible();
  await expect(page.getByText('Open presenter view')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('staged reveals advance before the next slide and laser marks clear with Escape', async ({ page }) => {
  await page.goto('/#key-takeaways');
  const steps = page.locator('#deck > .slide.active [data-reveal-step]');
  await expect(steps.nth(0)).toHaveAttribute('data-revealed', 'true');
  await expect(steps.nth(1)).toHaveAttribute('data-revealed', 'false');
  await page.keyboard.press('ArrowRight');
  await expect(steps.nth(1)).toHaveAttribute('data-revealed', 'true');
  await expect(page.locator('#deck > .slide.active')).toHaveAttribute('data-title', 'Key Takeaways');

  await page.keyboard.press('l');
  await page.mouse.click(1200, 500);
  await expect(page.locator('.laser-mark')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('.laser-mark')).toHaveCount(0);
});

test('configures section markers, architecture flow, and Q&A QR from talk config', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#progressMarkers span')).toHaveCount(17);
  await expect(page.locator('#progressMarkers .is-section').count()).resolves.toBeGreaterThan(1);
  await expect(page.locator('#deck [data-title="Cluster Architecture"] .diagram-flow')).toHaveCount(1);
  const qa = page.locator('#deck [data-title="Questions & Answers"]');
  await expect(qa.locator('canvas[aria-label]')).toHaveCount(1);
  await expect(qa.locator('[data-qr-url]')).toHaveAttribute('data-qr-url', 'https://example.com/questions');
});

test('opens a synchronized presenter window and supports presenter-side navigation', async ({ page }) => {
  await page.goto('/#services');
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Open presenter view' }).click();
  const presenter = await popupPromise;
  await expect(presenter.locator('.presenter-shell')).toBeVisible();
  await expect(presenter.locator('.presenter-preview').first().locator('.slide')).toHaveAttribute('data-title', 'Services');
  await presenter.keyboard.press('ArrowRight');
  await expect(page.locator('#deck > .slide.active')).toHaveAttribute('data-title', 'ConfigMaps & Secrets');
  await presenter.close();

  const keyboardPopupPromise = page.waitForEvent('popup');
  await page.keyboard.press('p');
  const keyboardPopup = await keyboardPopupPromise;
  await expect(keyboardPopup.locator('.presenter-shell')).toBeVisible();
  await keyboardPopup.close();
});

test('renders terminal and code-diff components with text-only content', async ({ page }) => {
  await page.goto('/#kubectl-essentials');
  const authoredTerminal = page.locator('#deck [data-title="kubectl Essentials"] [data-terminal]');
  await expect(authoredTerminal).toHaveCount(1);
  await authoredTerminal.getByRole('button', { name: 'Run command' }).click();
  await expect(authoredTerminal.locator('.terminal-output')).toContainText('NAME       READY   STATUS');
  const authoredDiff = page.locator('#deck [data-title="Deployments & ReplicaSets"] [data-code-diff]');
  await expect(authoredDiff.locator('.diff-removed')).toHaveText('replicas: 1');
  await expect(authoredDiff.locator('.diff-added')).toHaveText('replicas: 3');
  const components = await page.evaluate(async () => {
    const { initializeMediaComponents } = await import('/src/features.js');
    const slide = document.querySelector('#deck > .slide.active');
    const terminal = document.createElement('div');
    terminal.dataset.terminal = '';
    terminal.dataset.command = 'kubectl get pods';
    terminal.dataset.output = 'NAME READY STATUS';
    const diff = document.createElement('div');
    diff.dataset.codeDiff = '';
    diff.dataset.before = 'replicas: 1';
    diff.dataset.after = 'replicas: 3';
    slide.append(terminal, diff);
    initializeMediaComponents([slide]);
    return { terminalButton: terminal.querySelector('button').textContent, diffLines: [...diff.querySelectorAll('code')].map(code => code.textContent) };
  });
  expect(components.terminalButton).toBe('Run command');
  expect(components.diffLines).toEqual(['replicas: 1', 'replicas: 3']);
});

test('uses the service worker cache when the network goes offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.register('./sw.js'));
  await page.waitForFunction(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.some((registration) => registration.active?.state === 'activated');
  });
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#deck > .slide')).toHaveCount(17);
  await context.setOffline(false);
});

test('sets four-up slide dimensions for handout printing', async ({ page }) => {
  await page.goto('/?handout=1');
  await page.emulateMedia({ media: 'print' });
  const layout = await page.locator('#deck').evaluate((deck) => {
    const style = getComputedStyle(deck);
    const slide = getComputedStyle(deck.querySelector('.slide'));
    return { columns: style.gridTemplateColumns.split(' ').length, height: slide.height, footer: getComputedStyle(document.querySelector('body > footer')).display };
  });
  expect(layout.columns).toBe(2);
  expect(Number.parseFloat(layout.height)).toBeCloseTo(396.85, 1);
  expect(layout.footer).toBe('none');
});
