import './shell.css';
import './styles.css';
import { initializePresentation } from './presentation.js';
import { renderSlides } from './layouts.js';
import { applyTheme, themes } from './theme.js';
import { initializeFeatures } from './features.js';

export async function startDeck(slideSources, talkConfig) {
  const deck = document.getElementById('deck');
  if (!deck) throw new Error('The presentation shell must include a #deck element.');

  const params = new URLSearchParams(location.search);
  const activeTheme = applyTheme(params.get('theme') ?? talkConfig.theme ?? 'kubernetes');
  const brand = talkConfig.brand ?? {};
  document.body.dataset.theme = activeTheme;
  document.title = `${talkConfig.title} — Slides`;
  document.querySelectorAll('[data-deck-title]').forEach((element) => {
    element.textContent = talkConfig.title;
  });
  window.deckBrand = brand;

  try {
    await renderSlides(deck, slideSources, {
      ...brand,
      theme: themes[activeTheme],
      coverMark: talkConfig.coverMark
    });
    if (params.get('view') === 'linear') document.body.classList.add('linear-mode');
    if (params.get('handout') === '1') document.body.classList.add('handout-mode');
    if (params.get('presenter') === '1') document.body.classList.add('presenter-mode');
    initializePresentation();
    initializeFeatures();
  } catch (error) {
    console.error('Unable to initialize the slide deck.', error);
    deck.innerHTML = '<p role="alert">The slides could not be loaded. Check the Markdown sources and rebuild.</p>';
  }
}
