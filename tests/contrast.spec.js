import { expect, test } from '@playwright/test';

function luminance(color) {
  const channels = color.match(/\d+(?:\.\d+)?/g).slice(0, 3).map(Number).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('all visible slide text combinations meet WCAG AA contrast', async ({ page }) => {
  const themes = ['kubernetes', 'docker', 'terraform', 'aws', 'monochrome'];
  await page.goto('/kubernetes-concepts-deepseek.html');
  const audits = await page.evaluate(async (themesToAudit) => {
      const { applyTheme } = await import('/src/theme.js');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      function rgba(color) {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        const values = context.getImageData(0, 0, 1, 1).data;
        return [...values.slice(0, 3), values[3] / 255];
      }
      function over(foreground, background) {
        const alpha = foreground[3];
        return [
          foreground[0] * alpha + background[0] * (1 - alpha),
          foreground[1] * alpha + background[1] * (1 - alpha),
          foreground[2] * alpha + background[2] * (1 - alpha),
          1
        ];
      }
      function effectiveBackground(element) {
        let color = rgba(getComputedStyle(document.body).backgroundColor) ?? [7, 11, 20, 1];
        const ancestors = [];
        for (let node = element; node && node !== document.body; node = node.parentElement) ancestors.push(node);
        ancestors.reverse().forEach((node) => {
          const background = rgba(getComputedStyle(node).backgroundColor);
          if (background && background[3] > 0) color = over(background, color);
        });
        return `rgb(${color.slice(0, 3).map(Math.round).join(', ')})`;
      }
      document.querySelectorAll('#deck > .slide').forEach((slide) => slide.classList.add('active'));
      const textElements = [...document.querySelectorAll('#deck > .slide h1, #deck > .slide h2, #deck > .slide h3, #deck > .slide p, #deck > .slide li, #deck > .slide a, #deck > .slide code, #deck > .slide span')]
        .filter((element) => element.textContent.trim());
      return themesToAudit.map((theme) => {
        applyTheme(theme);
        const combinations = textElements.map((element) => {
            const foreground = rgba(getComputedStyle(element).color);
            const background = rgba(effectiveBackground(element));
            if (foreground[3] < 0.05) return null;
            const visibleForeground = over(foreground, background);
            const rgb = (color) => `rgb(${color.slice(0, 3).map(Math.round).join(', ')})`;
            return {
              selector: `${element.closest('.slide').dataset.title} ${element.tagName.toLowerCase()}.${element.className.baseVal ?? element.className}`,
              foreground: rgb(visibleForeground),
              background: rgb(background)
            };
          })
          .filter(Boolean);
        const gradients = textElements.flatMap((element) => {
          const style = getComputedStyle(element);
          if (rgba(style.webkitTextFillColor)[3] >= 0.05 || !style.backgroundImage.includes('gradient')) return [];
          const stops = style.backgroundImage.match(/(?:rgba?\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\)|#[\da-fA-F]{3,8})/g) ?? [];
          const background = rgba(effectiveBackground(element));
          return stops.map((stop) => ({
            text: element.textContent.trim(),
            foreground: `rgb(${rgba(stop).slice(0, 3).map(Math.round).join(', ')})`,
            background: `rgb(${background.slice(0, 3).map(Math.round).join(', ')})`
          }));
        });
        return { theme, combinations, gradients };
      });
    }, themes);
  for (const { theme, combinations, gradients } of audits) {
    expect(combinations.length, `${theme} theme did not expose enough text combinations`).toBeGreaterThan(100);
    combinations.forEach(({ selector, foreground, background }) => {
      expect(contrastRatio(foreground, background), `${theme}: ${selector}: ${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
    });
    expect(gradients.length, `${theme} gradient text stops were not audited`).toBeGreaterThan(0);
    gradients.forEach(({ text, foreground, background }) => {
      expect(contrastRatio(foreground, background), `${theme}: "${text}" gradient ${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
    });
  }
});

test('OS increased-contrast preference updates deck colors without reloading', async ({ page }) => {
  await page.goto('/kubernetes-concepts-deepseek.html');
  await page.emulateMedia({ contrast: 'more' });
  await expect(page.locator('.slide.active h1')).toHaveCSS('-webkit-text-fill-color', 'rgb(255, 255, 255)');
});
