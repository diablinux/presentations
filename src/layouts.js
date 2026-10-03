import MarkdownIt from 'markdown-it';
import QRCode from 'qrcode';
import { parse as parseYaml } from 'yaml';

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });

const layoutClasses = {
  title: 'slide-title',
  divider: 'slide-divider',
  bullets: 'slide-bullets',
  'two-column': 'slide-two-column',
  cards: 'slide-cards',
  comparison: 'slide-comparison',
  quote: 'slide-quote',
  image: 'slide-image',
  code: 'slide-code',
  diagram: 'slide-diagram',
  qa: 'slide-qa',
  closing: 'slide-closing',
  content: 'slide-content'
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

const slugify = (value) => value.toLowerCase().normalize('NFKD')
  .replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-');

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('Every slide Markdown file must start with YAML frontmatter.');
  return { data: parseYaml(match[1]) ?? {}, content: match[2] };
}

function renderTwoColumn(body, layout) {
  const columns = [];
  const current = [];
  let fenced = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (!fenced && /^\s*---\s*$/.test(line) && columns.length === 0) {
      columns.push(current.join('\n'));
      current.length = 0;
    } else {
      current.push(line);
    }
  }
  columns.push(current.join('\n'));
  const className = layoutClasses[layout];
  if (columns.length !== 2) {
    return `<div class="${className}">${markdown.render(body)}</div>`;
  }
  return `<div class="${className}">${columns.map((column) => `<section>${markdown.render(column)}</section>`).join('')}</div>`;
}

function renderCards(body, layout) {
  const content = markdown.render(body);
  const pieces = content.split(/(?=<h[23](?:\s|>))/);
  const cards = pieces.filter((piece) => piece.trim()).map((piece) => `<article class="slide-card">${piece}</article>`).join('');
  return `<div class="${layoutClasses[layout]}"><div class="slide-card-grid">${cards || content}</div></div>`;
}

function renderFlow(flow) {
  if (!flow?.length) return '';
  if (!Array.isArray(flow) || flow.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error('A slide flow must be a list of non-empty labels.');
  }
  const labels = flow.map((item) => item.trim());
  const width = 900;
  const height = 84;
  const nodeWidth = Math.min(230, Math.floor((width - (labels.length - 1) * 42) / labels.length));
  const gap = labels.length > 1 ? (width - labels.length * nodeWidth) / (labels.length - 1) : 0;
  const connectors = labels.slice(0, -1).map((_, index) => {
    const x = index * (nodeWidth + gap);
    return `M${x + nodeWidth} 42h${gap}`;
  }).join('');
  const nodes = labels.map((label, index) => {
    const x = index * (nodeWidth + gap);
    const hue = index === labels.length - 1 ? 'var(--theme-highlight)' : 'var(--theme-accent)';
    const text = escapeHtml(label);
    const center = x + nodeWidth / 2;
    return `<g><rect x="${x}" y="8" width="${nodeWidth}" height="68" rx="12" fill="color-mix(in srgb, ${hue} 12%, var(--theme-background))" stroke="color-mix(in srgb, ${hue} 46%, transparent)"/><text x="${center}" y="49" text-anchor="middle" fill="var(--theme-body-text)" font-size="16" font-family="var(--theme-font-sans)">${text}</text></g>`;
  }).join('');
  return `<svg class="slide-flow" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(labels.join(' flows to '))}" fill="none"><defs><marker id="flow-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="var(--theme-highlight)"/></marker></defs><path class="diagram-flow" d="${connectors}" stroke="var(--theme-highlight)" stroke-width="2" marker-end="url(#flow-arrow)"/>${nodes}</svg>`;
}

function renderComponents(components) {
  if (components === undefined) return '';
  if (!Array.isArray(components)) throw new Error('Slide components must be a list.');
  return components.map((component) => {
    if (!component || typeof component !== 'object' || Array.isArray(component)) {
      throw new Error('Each slide component must be a typed object.');
    }
    if (component.type === 'terminal') {
      if (typeof component.command !== 'string' || typeof component.output !== 'string') {
        throw new Error('Terminal components require string command and output values.');
      }
      return `<div class="slide-component" data-terminal data-command="${escapeHtml(component.command)}" data-output="${escapeHtml(component.output)}"></div>`;
    }
    if (component.type === 'code-diff') {
      if (typeof component.before !== 'string' || typeof component.after !== 'string') {
        throw new Error('Code-diff components require string before and after values.');
      }
      return `<div class="slide-component" data-code-diff data-before="${escapeHtml(component.before)}" data-after="${escapeHtml(component.after)}"></div>`;
    }
    throw new Error(`Unsupported slide component type "${String(component.type)}".`);
  }).join('');
}

function renderCover(slide, config, closing = false) {
  const tags = Array.isArray(slide.tags)
    ? `<ul class="slide-tags">${slide.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>`
    : '';
  const subtitle = slide.subtitle ? `<p class="slide-subtitle">${markdown.renderInline(String(slide.subtitle))}</p>` : '';
  const title = escapeHtml(slide.heading ?? slide.title);
  const eyebrow = slide.eyebrow ? `<p class="slide-eyebrow">${escapeHtml(slide.eyebrow)}</p>` : '';
  const contact = `<div class="slide-contact"><strong>${escapeHtml(config.name ?? '')}</strong>${config.email ? `<a href="mailto:${escapeHtml(config.email)}">${escapeHtml(config.email)}</a>` : ''}</div>`;
  const showKubernetesMark = !closing && config.coverMark === 'kubernetes';
  const mark = showKubernetesMark
    ? '<svg class="slide-hero-mark float-slow" viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="50,4 86,21.3 94.8,60.2 70,91.4 30,91.4 5.2,60.2 14,21.3"/><g stroke-width="1.6" stroke-linecap="round" opacity=".85"><line x1="50" y1="50" x2="50" y2="4"/><line x1="50" y1="50" x2="86" y2="21.3"/><line x1="50" y1="50" x2="94.8" y2="60.2"/><line x1="50" y1="50" x2="70" y2="91.4"/><line x1="50" y1="50" x2="30" y2="91.4"/><line x1="50" y1="50" x2="5.2" y2="60.2"/><line x1="50" y1="50" x2="14" y2="21.3"/></g><circle cx="50" cy="50" r="9" fill="currentColor" stroke="none"/><circle cx="50" cy="50" r="20" stroke-width="1.2" opacity=".5"/></svg>'
    : '';
  const coverClass = showKubernetesMark ? 'is-cover has-cover-art' : 'is-cover';
  return `<div class="slide-inner ${closing ? 'is-closing' : coverClass}"><div class="slide-cover-copy">${eyebrow}<h1>${title}</h1>${subtitle}${tags}${contact}</div>${mark ? `<div class="slide-cover-art">${mark}</div>` : ''}</div>`;
}

function renderSlideBody(slide, config) {
  if (slide.layout === 'title') return renderCover(slide, config);
  if (slide.layout === 'closing') return renderCover(slide, config, true);

  const eyebrow = slide.eyebrow ? `<p class="slide-eyebrow">${escapeHtml(slide.eyebrow)}</p>` : '';
  const subtitle = slide.subtitle ? `<p class="slide-subtitle">${markdown.renderInline(String(slide.subtitle))}</p>` : '';
  const header = `<header class="slide-header">${eyebrow}<h2>${escapeHtml(slide.heading ?? slide.title)}</h2>${subtitle}</header>`;
  if (slide.layout === 'qa') {
    const urlKey = slide.qr ?? 'questionUrl';
    const caption = slide.caption ? `<p class="slide-caption">${escapeHtml(slide.caption)}</p>` : '';
    return `<div class="slide-inner"><div class="${layoutClasses.qa}">${header}<p>Scan to share a question or follow up after the talk.</p><div data-qr-config="${escapeHtml(urlKey)}"></div>${caption}</div></div>`;
  }

  const className = layoutClasses[slide.layout] ?? layoutClasses.content;
  const components = renderComponents(slide.components);
  let body;
  if (['two-column', 'comparison'].includes(slide.layout)) {
    body = renderTwoColumn(slide.body, slide.layout);
  } else if (slide.layout === 'cards') {
    body = renderCards(slide.body, slide.layout);
  } else {
    body = `<div class="${className}">${markdown.render(slide.body)}</div>`;
  }
  const flow = slide.flow ? renderFlow(slide.flow) : '';
  return `<div class="slide-inner"><div class="slide-prose">${header}${body}${flow}${components}</div></div>`;
}

export const supportedLayouts = Object.keys(layoutClasses);

export async function renderSlides(container, slideSources, config = {}) {
  const slides = Object.entries(slideSources)
    .map(([file, source]) => {
      const parsed = parseFrontmatter(source);
      const title = String(parsed.data.title ?? file.split('/').at(-1).replace(/^\d+-|\.md$/g, ''));
      return {
        order: Number(file.match(/\/(\d+)-/)?.[1] ?? Number.MAX_SAFE_INTEGER),
        ...parsed.data,
        title,
        slug: String(parsed.data.slug ?? slugify(title)),
        layout: String(parsed.data.layout ?? 'content'),
        body: parsed.content.trim()
      };
    })
    .sort((a, b) => a.order - b.order);

  if (!slides.length) throw new Error('No Markdown slides found in content/slides.');
  const slugs = new Set();
  slides.forEach((slide) => {
    if (!slide.title.trim()) throw new Error('Every slide needs a non-empty title.');
    if (slugs.has(slide.slug)) throw new Error(`Duplicate slide slug "${slide.slug}".`);
    if (!layoutClasses[slide.layout]) throw new Error(`Unknown slide layout "${slide.layout}".`);
    slugs.add(slide.slug);
  });

  container.replaceChildren(...slides.map((slide, index) => {
    const section = document.createElement('section');
    section.className = 'slide';
    section.dataset.title = slide.title;
    section.dataset.slug = slide.slug;
    section.dataset.layout = slide.layout;
    section.dataset.section = String(Boolean(slide.section && slide.section !== 'false'));
    section.dataset.reveal = String(Boolean(slide.reveal && slide.reveal !== 'false'));
    section.setAttribute('role', 'group');
    section.setAttribute('aria-roledescription', 'slide');
    section.setAttribute('aria-label', `Slide ${index + 1}: ${slide.title}`);
    const notes = document.createElement('aside');
    notes.className = 'speaker-notes';
    notes.dataset.speakerNotes = '';
    notes.hidden = true;
    notes.textContent = slide.notes ?? '';
    section.innerHTML = renderSlideBody(slide, config);
    section.append(notes);
    const heading = section.querySelector('h1, h2');
    if (heading) {
      heading.tabIndex = -1;
      heading.id = `slide-heading-${slide.slug}`;
      section.setAttribute('aria-labelledby', heading.id);
    }
    return section;
  }));

  for (const element of container.querySelectorAll('[data-qr-config]')) {
    const url = config[element.dataset.qrConfig];
    if (typeof url !== 'string' || !url) {
      throw new Error(`Set the "${element.dataset.qrConfig}" URL in the talk configuration before using its QR component.`);
    }
    const parsedUrl = new URL(url, location.href);
    if (!['https:', 'http:'].includes(parsedUrl.protocol)) {
      throw new Error(`QR codes only support HTTP(S) URLs: ${url}`);
    }
    element.dataset.qrUrl = url;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label', `QR code linking to ${url}`);
    await QRCode.toCanvas(canvas, url, {
      margin: 1,
      width: 192,
      color: { dark: config.theme.qrDark, light: config.theme.qrLight }
    });
    element.replaceChildren(canvas);
  }
  return slides;
}
