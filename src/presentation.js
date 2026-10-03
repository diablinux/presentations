export function initializePresentation() {

  /* ── Tiny syntax highlighters ───────────────────── */
  const escapeHtml = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  function dedent(text) {
    const lines = text.replace(/^\n+/, '').replace(/\s+$/, '').split('\n');
    let min = Infinity;
    for (const line of lines) {
      if (!line.trim()) continue;
      const indent = line.match(/^\s*/)[0].length;
      if (indent < min) min = indent;
    }
    if (!isFinite(min)) min = 0;
    return lines.map((l) => l.slice(min)).join('\n');
  }

  function highlightYaml(src) {
    return src.split('\n').map((line) => {
      let out = escapeHtml(line);

      if (/^\s*#/.test(line)) return '<span class="tok-c">' + out + '</span>';

      // keys: "  key:" or "  - key:"
      out = out.replace(/^(\s*(?:-\s+)?)([A-Za-z0-9_.\-\/]+)(:)/,
        '$1<span class="tok-k">$2</span>$3');

      // quoted strings
      out = out.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g,
        '<span class="tok-s">$1</span>');

      // booleans / numbers after a colon
      out = out.replace(/(:\s+)(true|false|null|\d+(?:\.\d+)?)\b/g,
        '$1<span class="tok-n">$2</span>');

      return out;
    }).join('\n');
  }

  function highlightBash(src) {
    let out = escapeHtml(src);
    // comments
    out = out.replace(/^(\s*)(#.*)$/gm, '$1<span class="tok-c">$2</span>');
    // flags
    out = out.replace(/(\s)(--?[A-Za-z][\w-]*)/g, '$1<span class="tok-f">$2</span>');
    // commands
    out = out.replace(/\b(kubectl|kind|k)\b/g, '<span class="tok-k">$1</span>');
    return out;
  }

  document.querySelectorAll('pre code').forEach((code) => {
    const raw = dedent(code.textContent);
    if (code.classList.contains('language-yaml')) {
      code.innerHTML = highlightYaml(raw);
    } else if (code.classList.contains('language-bash')) {
      code.innerHTML = highlightBash(raw);
    } else {
      code.textContent = raw;
    }
  });

  /* ── Presentation engine ────────────────────────── */
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  if (total === 0) throw new Error('The deck needs at least one slide.');

  const progress = document.getElementById('progress');
  const counter = document.getElementById('counter');
  const counterMobile = document.getElementById('counterMobile');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  const menu = document.getElementById('menu');
  const scrim = document.getElementById('scrim');
  const menuList = document.getElementById('menuList');
  const menuBtn = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');

  let index = 0;

  const pad = (n) => String(n).padStart(2, '0');

  /* Build outline */
  slides.forEach((slide, i) => {
    const title = slide.dataset.title || ('Slide ' + (i + 1));
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.goTo = String(i);
    btn.className =
      'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ' +
      'text-slate-400 hover:bg-white/5 hover:text-white';
    const number = document.createElement('span');
    number.className = 'w-6 shrink-0 font-mono text-[11px] tabular-nums text-slate-600 group-hover:text-k8s-300';
    number.textContent = pad(i + 1);
    const label = document.createElement('span');
    label.className = 'truncate';
    label.textContent = title;
    btn.append(number, label);
    menuList.appendChild(btn);
  });

  const menuItems = Array.from(menuList.querySelectorAll('button'));

  function render() {
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    const label = pad(index + 1) + ' / ' + pad(total);
    counter.textContent = label;
    counterMobile.textContent = pad(index + 1) + '/' + pad(total);

    progress.style.width = (((index + 1) / total) * 100).toFixed(4) + '%';

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;

    menuItems.forEach((item, i) => {
      const active = i === index;
      item.classList.toggle('bg-k8s-500/15', active);
      item.classList.toggle('text-white', active);
      item.classList.toggle('text-slate-400', !active);
    });
    const heading = slides[index].querySelector('h1, h2');
    if (heading) heading.focus({ preventScroll: true });
    window.dispatchEvent(new CustomEvent('deck:slidechange', {
      detail: { index, title: slides[index].dataset.title, source: 'local' }
    }));
  }

  function goTo(target, updateHash) {
    if (typeof target === 'string' && !/^\d+$/.test(target)) {
      target = slides.findIndex((slide) => slide.dataset.slug === target || slide.dataset.title.toLowerCase() === target.toLowerCase());
    }
    target = Number(target);
    if (!Number.isInteger(target) || target < 0) return;
    target = Math.max(0, Math.min(total - 1, target));
    if (target === index) return;

    index = target;
    render();

    // reset inner scroll so each slide starts at the top
    slides[index].scrollTop = 0;

    if (updateHash !== false) {
      history.replaceState(null, '', '#' + slides[index].dataset.slug);
    }
  }

  function revealNext() {
    if (slides[index].dataset.reveal !== 'true') return false;
    const unrevealed = slides[index].querySelector('.reveal-item[data-revealed="false"]');
    if (!unrevealed) return false;
    unrevealed.dataset.revealed = 'true';
    unrevealed.setAttribute('aria-hidden', 'false');
    return true;
  }

  const next = () => { if (!revealNext()) goTo(index + 1); };
  const prev = () => goTo(index - 1);
  window.deckGoTo = (target, updateHash) => goTo(target, updateHash);

  slides.forEach((slide) => {
    if (slide.dataset.reveal !== 'true') return;
    const items = slide.querySelectorAll('.slide-bullets ol > li');
    items.forEach((item, step) => {
      item.classList.add('reveal-item');
      item.dataset.revealStep = String(step + 1);
      item.dataset.revealed = step === 0 ? 'true' : 'false';
      item.setAttribute('aria-hidden', step === 0 ? 'false' : 'true');
    });
    slide.dataset.revealCount = String(items.length);
  });

  /* ── Outline drawer ─────────────────────────────── */
  function openMenu() {
    menu.classList.remove('translate-x-full');
    scrim.classList.remove('hidden');
  }
  function closeMenu() {
    menu.classList.add('translate-x-full');
    scrim.classList.add('hidden');
  }
  function toggleMenu() {
    if (menu.classList.contains('translate-x-full')) openMenu();
    else closeMenu();
  }

  menuBtn.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  scrim.addEventListener('click', closeMenu);

  menuList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-go-to]');
    if (!btn) return;
    goTo(Number(btn.dataset.goTo));
    closeMenu();
  });

  /* ── Buttons ────────────────────────────────────── */
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  /* ── Keyboard ───────────────────────────────────── */
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault(); next(); break;

      case ' ':
        e.preventDefault();
        e.shiftKey ? prev() : next();
        break;

      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault(); prev(); break;

      case 'Home':
        e.preventDefault(); goTo(0); break;

      case 'End':
        e.preventDefault(); goTo(total - 1); break;

      case 'Escape':
        closeMenu(); break;

      case 'm':
      case 'M':
        e.preventDefault(); toggleMenu(); break;

      case 'f':
      case 'F':
        e.preventDefault(); toggleFullscreen(); break;

      case '?':
        e.preventDefault(); window.dispatchEvent(new CustomEvent('deck:help')); break;
    }
  });

  /* ── Fullscreen ─────────────────────────────────── */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch((error) => console.error('Unable to enter fullscreen.', error));
    } else {
      document.exitFullscreen?.().catch((error) => console.error('Unable to exit fullscreen.', error));
    }
  }

    /* ── Export: PDF ─────────────────────────────────── */
  document.getElementById('exportPdf').addEventListener('click', () => {
    window.print();
  });

  /* ── Touch / swipe ──────────────────────────────── */
  let touchStartX = 0;
  let touchStartY = 0;
  let tracking = false;

  window.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    tracking = true;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  /* ── Boot ───────────────────────────────────────── */
  const initialHash = decodeURIComponent((location.hash || '').slice(1));
  if (/^\d+$/.test(initialHash)) {
    const hashIndex = Number(initialHash);
    if (hashIndex >= 1 && hashIndex <= total) index = hashIndex - 1;
  } else if (initialHash) {
    const matched = slides.findIndex((slide) => slide.dataset.slug === initialHash || slide.dataset.title.toLowerCase() === initialHash.toLowerCase());
    if (matched >= 0) index = matched;
  }

  render();

  // Force the first slide's entrance animation to play on load.
  requestAnimationFrame(() => {
    const first = slides[index];
    first.classList.remove('active');
    void first.offsetWidth;
    first.classList.add('active');
  });

  window.addEventListener('hashchange', () => {
    const hash = decodeURIComponent((location.hash || '').slice(1));
    if (/^\d+$/.test(hash)) goTo(Number(hash) - 1, false);
    else goTo(hash, false);
  });
}
