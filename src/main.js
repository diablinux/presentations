import { startDeck } from './deck-runtime.js';
import talkConfig from './talk.config.js';

const sources = import.meta.glob('../content/slides/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

await startDeck(sources, talkConfig);
