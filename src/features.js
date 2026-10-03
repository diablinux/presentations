const channelName = 'presentation-sync';

function createButton(label, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.className = 'rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10';
  button.addEventListener('click', onClick);
  return button;
}

function initializeDialog(id, heading) {
  const dialog = document.createElement('dialog');
  dialog.id = id;
  dialog.setAttribute('aria-label', heading);
  dialog.className = 'max-h-[90vh] max-w-[92vw] overflow-auto rounded-2xl border border-white/15 bg-slate-950 p-6 shadow-2xl backdrop:bg-black/75';
  const title = document.createElement('h2');
  title.className = 'mb-5 text-xl font-semibold text-white';
  title.textContent = heading;
  dialog.append(title);
  document.body.append(dialog);
  return dialog;
}

function initializeShortcutHelp() {
  const dialog = initializeDialog('shortcutDialog', 'Keyboard shortcuts');
  const list = document.createElement('dl');
  list.className = 'grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm';
  [
    ['← / →, Page Up / Page Down', 'Previous / next slide'],
    ['Space / Shift + Space', 'Next / previous slide'],
    ['Home / End', 'First / last slide'],
    ['M', 'Toggle outline'],
    ['O', 'Toggle slide overview'],
    ['P', 'Open presenter view'],
    ['F', 'Toggle fullscreen'],
    ['L', 'Toggle laser pointer'],
    ['?', 'Show this help'],
    ['Escape', 'Close open panel / clear pointer']
  ].forEach(([key, description]) => {
    const term = document.createElement('dt');
    term.className = 'font-mono text-cyan-300';
    term.textContent = key;
    const detail = document.createElement('dd');
    detail.className = 'text-slate-300';
    detail.textContent = description;
    list.append(term, detail);
  });
  const close = createButton('Close', () => dialog.close());
  close.classList.add('mt-6');
  dialog.append(list, close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  return dialog;
}

function initializeOverview(slides) {
  const dialog = initializeDialog('overviewDialog', 'Slide overview');
  const grid = document.createElement('div');
  grid.className = 'overview-grid grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  slides.forEach((slide, index) => {
    const button = createButton('', () => {
      window.deckGoTo(index);
      dialog.close();
    });
    button.className += ' relative aspect-video overflow-hidden text-left';
    const number = document.createElement('span');
    number.className = 'absolute left-2 top-2 z-10 rounded bg-slate-950/90 px-2 py-1 font-mono text-xs';
    number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('span');
    title.className = 'absolute inset-x-0 bottom-0 z-10 truncate bg-slate-950/90 p-2 text-xs';
    title.textContent = slide.dataset.title;
    const preview = slide.cloneNode(true);
    preview.classList.add('active');
    preview.classList.remove('slide');
    preview.classList.add('overview-preview');
    preview.removeAttribute('aria-hidden');
    preview.querySelectorAll('.speaker-notes').forEach((note) => note.remove());
    button.append(preview, number, title);
    grid.append(button);
  });
  dialog.append(grid);
  dialog.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
    const buttons = Array.from(grid.querySelectorAll('button'));
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    event.stopPropagation();
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    buttons[(current + direction + buttons.length) % buttons.length].focus();
  });
  dialog.addEventListener('close', () => {
    document.querySelector('#menuBtn')?.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  return dialog;
}

function initializeProgress(slides) {
  const track = document.querySelector('#progress')?.parentElement;
  if (!track) return;
  track.style.position = 'relative';
  const markers = document.createElement('div');
  markers.id = 'progressMarkers';
  markers.setAttribute('aria-hidden', 'true');
  slides.forEach((slide, index) => {
    const marker = document.createElement('span');
    marker.style.width = `${100 / slides.length}%`;
    if (index === 0 || slide.dataset.section === 'true') marker.classList.add('is-section');
    markers.append(marker);
  });
  track.append(markers);
}

export function initializeMediaComponents(slides) {
  slides.forEach((slide) => {
    if (slide.dataset.layout === 'diagram') {
      slide.querySelectorAll('svg path, svg line, svg polyline').forEach((path) => {
        if (!path.closest('marker')) path.classList.add('diagram-flow');
      });
    }
    slide.querySelectorAll('[data-reveal-step]').forEach((item) => {
      item.classList.add('reveal-item');
      const step = Array.from(slide.querySelectorAll('[data-reveal-step]')).indexOf(item);
      item.dataset.revealed = slide.dataset.reveal !== 'true' || step === 0 ? 'true' : 'false';
      item.setAttribute('aria-hidden', item.dataset.revealed === 'false' ? 'true' : 'false');
    });
    slide.querySelectorAll('[data-terminal]').forEach((terminal) => {
      const command = terminal.dataset.command ?? '';
      const output = terminal.dataset.output ?? '';
      const display = document.createElement('pre');
      display.className = 'terminal-output mt-3 rounded-xl border border-white/10 bg-slate-950/80 p-4 font-mono text-sm text-slate-200';
      const button = createButton('Run command', () => {
        window.clearInterval(terminal.timer);
        display.textContent = '';
        const text = `$ ${command}\n${output}`;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
          display.textContent = text;
          return;
        }
        let offset = 0;
        terminal.timer = window.setInterval(() => {
          display.textContent += text[offset++] ?? '';
          if (offset >= text.length) window.clearInterval(terminal.timer);
        }, 18);
      });
      terminal.replaceChildren(button, display);
    });
    slide.querySelectorAll('[data-code-diff]').forEach((diff) => {
      const columns = document.createElement('div');
      columns.className = 'grid gap-4 md:grid-cols-2';
      [['before', 'Removed'], ['after', 'Added']].forEach(([side, label]) => {
        const section = document.createElement('section');
        const heading = document.createElement('h3');
        heading.className = 'mb-2 text-sm font-semibold text-slate-300';
        heading.textContent = label;
        const pre = document.createElement('pre');
        pre.className = 'overflow-auto rounded-xl border border-white/10 bg-slate-950/80 p-4 font-mono text-sm';
        const code = document.createElement('code');
        code.className = side === 'before' ? 'diff-removed' : 'diff-added';
        code.textContent = diff.dataset[side] ?? '';
        pre.append(code);
        section.append(heading, pre);
        columns.append(section);
      });
      diff.replaceChildren(columns);
    });
  });
}

function initializeBranding() {
  const brand = window.deckBrand;
  if (!brand) return;
  document.querySelectorAll('[data-brand-name]').forEach((node) => {
    node.textContent = brand.name ?? '';
  });
  document.querySelectorAll('[data-brand-email]').forEach((link) => {
    link.href = `mailto:${brand.email ?? ''}`;
    link.textContent = brand.email ?? '';
  });
  document.querySelectorAll('.slide span').forEach((node) => {
    if (node.textContent.trim() === 'Angel Cabrera') node.textContent = brand.name ?? '';
  });
  document.querySelectorAll('.slide a[href^="mailto:"]').forEach((link) => {
    link.href = `mailto:${brand.email ?? ''}`;
    link.textContent = brand.email ?? '';
  });
  [document.querySelector('.slide[data-title="Title"] .slide-inner'), document.querySelector('.slide[data-title="Thank You"] .slide-inner')]
    .filter(Boolean)
    .forEach((target) => {
      const details = document.createElement('p');
      details.className = 'mt-3 text-sm text-slate-400';
      details.dataset.brandDetails = '';
      details.textContent = [brand.company, brand.conference].filter(Boolean).join(' · ');
      if (details.textContent) target.append(details);
      if (brand.logo) {
        const logo = document.createElement('img');
        logo.src = brand.logo;
        logo.alt = `${brand.name} logo`;
        logo.className = 'mb-3 h-10 max-w-40 object-contain';
        target.prepend(logo);
      }
    });
  if (brand.conference) document.documentElement.dataset.conference = brand.conference;
}

function initializePresenter(slides, channel, state) {
  if (document.body.classList.contains('presenter-mode')) {
    const shell = document.createElement('main');
    shell.className = 'presenter-shell';
    const current = document.createElement('section');
    const next = document.createElement('section');
    current.innerHTML = '<h2 class="mb-2 text-sm text-slate-400">Current slide</h2>';
    next.innerHTML = '<h2 class="mb-2 text-sm text-slate-400">Next slide</h2>';
    const currentPreview = document.createElement('div');
    currentPreview.className = 'presenter-preview';
    const nextPreview = document.createElement('div');
    nextPreview.className = 'presenter-preview';
    const notes = document.createElement('p');
    notes.className = 'mt-4 whitespace-pre-wrap text-slate-200';
    const timer = document.createElement('output');
    timer.className = 'mt-4 block font-mono text-cyan-300';
    current.append(currentPreview, notes);
    next.append(nextPreview, timer);
    shell.append(current, next);
    document.body.append(shell);
    const startedAt = Number(sessionStorage.getItem('presentation-started-at')) || Date.now();
    state.startedAt = startedAt;

    function update(index) {
      const currentSlide = slides[index];
      const nextSlide = slides[Math.min(index + 1, slides.length - 1)];
      const preview = (source) => {
        const clone = source.cloneNode(true);
        clone.classList.add('active');
        clone.removeAttribute('aria-hidden');
        clone.querySelectorAll('.speaker-notes').forEach((note) => note.remove());
        return clone;
      };
      currentPreview.replaceChildren(preview(currentSlide));
      nextPreview.replaceChildren(preview(nextSlide));
      notes.textContent = currentSlide.querySelector('[data-speaker-notes]')?.textContent ?? '';
    }
    window.addEventListener('deck:slidechange', (event) => update(event.detail.index));
    window.addEventListener('deck:slidechange', (event) => {
      channel?.postMessage({
        type: 'slide',
        index: event.detail.index,
        title: event.detail.title,
        source: location.origin
      });
    });
    channel?.addEventListener('message', (event) => {
      if (event.data.type === 'slide') {
        window.deckGoTo(event.data.index, false);
        update(event.data.index);
      }
    });
    update(state.index);
    window.setInterval(() => {
      const seconds = Math.floor((Date.now() - startedAt) / 1000);
      timer.textContent = `Elapsed ${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }, 1000);
    return;
  }

  window.addEventListener('deck:slidechange', (event) => {
    state.index = event.detail.index;
    channel?.postMessage({
      type: 'slide',
      index: state.index,
      title: event.detail.title,
      source: location.origin
    });
  });
  channel?.addEventListener('message', (event) => {
    if (event.data.type === 'slide' && !document.body.classList.contains('presenter-mode')) {
      window.deckGoTo(event.data.index, false);
    }
  });
}

export function initializeFeatures() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const params = new URLSearchParams(location.search);
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(channelName) : null;
  const state = {
    index: Math.max(0, slides.findIndex((slide) => slide.classList.contains('active'))),
    startedAt: Number(sessionStorage.getItem('presentation-started-at')) || Date.now()
  };
  const help = initializeShortcutHelp();
  const overview = initializeOverview(slides);
  initializeProgress(slides);
  initializeMediaComponents(slides);
  initializeBranding();
  initializePresenter(slides, channel, state);
  window.addEventListener('deck:help', () => {
    if (!help.open) help.showModal();
  });

  function openPresenter() {
    sessionStorage.setItem('presentation-started-at', String(state.startedAt));
    const presenterUrl = new URL(location.href);
    presenterUrl.searchParams.set('presenter', '1');
    const presenterWindow = window.open(presenterUrl, 'slide-presenter', 'popup,width=1280,height=820');
    if (!presenterWindow) console.error('Presenter view could not open. Allow pop-ups for this presentation.');
  }
  document.getElementById('presenterBtn')?.addEventListener('click', openPresenter);

  if (params.get('presenter') !== '1') {
    sessionStorage.setItem('presentation-started-at', String(state.startedAt));
    window.addEventListener('deck:slidechange', (event) => { state.index = event.detail.index; });
  }

  let laserEnabled = false;
  const marks = new Set();
  function clearMarks() {
    marks.forEach((mark) => mark.remove());
    marks.clear();
  }
  window.addEventListener('click', (event) => {
    if (!laserEnabled || !event.target.closest('.slide.active') || event.target.closest('button, a, input')) return;
    const mark = document.createElement('span');
    mark.className = 'laser-mark';
    mark.style.left = `${event.clientX}px`;
    mark.style.top = `${event.clientY}px`;
    document.body.append(mark);
    marks.add(mark);
    mark.addEventListener('animationend', () => marks.delete(mark), { once: true });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      help.showModal();
    } else if (event.key.toLowerCase() === 'o' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      overview.open ? overview.close() : overview.showModal();
    } else if (event.key.toLowerCase() === 'p' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (params.get('presenter') !== '1') openPresenter();
    } else if (event.key.toLowerCase() === 'l' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      laserEnabled = !laserEnabled;
      document.body.dataset.laser = String(laserEnabled);
    } else if (event.key === 'Escape') {
      clearMarks();
      [help, overview].forEach((dialog) => { if (dialog.open) dialog.close(); });
    }
  }, true);

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.error('Unable to register offline support.', error);
    });
  }
}
