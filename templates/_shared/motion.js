/* ==========================================================================
   Motion Kit — no dependencies. Load at the end of <body>.
   Put this in <head> too, so hidden-until-revealed content never flashes:
   <script>document.documentElement.classList.add('motion')</script>
   Live demos of every effect: animations.html in the vault.
   ========================================================================== */
(function () {
  'use strict';
  const root = document.documentElement;
  root.classList.add('motion');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ---- Theme toggle: restore saved theme before anything paints ---- */
  const themeKey = 'mk-theme:' + location.pathname;
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme) root.dataset.theme = savedTheme;

  /* ---- Split text: data-split (words) or data-split="chars" (letters) ---- */
  $$('[data-split]').forEach(el => {
    const chars = el.dataset.split === 'chars';
    let i = 0;
    const word = html => `<span class="split-w"><span style="--i:${i++}">${html}</span></span>`;
    const charWord = text => `<span class="split-w">${Array.from(text).map(c => `<span style="--i:${i++}">${esc(c)}</span>`).join('')}</span>`;
    const out = [];
    el.childNodes.forEach(n => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) out.push(' ');
          else out.push(chars ? charWord(part) : word(esc(part)));
        });
      } else if (n.nodeName === 'BR') out.push('<br>');
      else if (n.nodeType === 1) out.push(word(n.outerHTML));
    });
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = out.join('');
  });

  /* ---- Delays + stagger indexes ---- */
  $$('[data-delay]').forEach(el => el.style.setProperty('--d', (parseFloat(el.dataset.delay) || 0) + 'ms'));
  $$('[data-stagger]').forEach(el => {
    if (el.dataset.stagger) el.style.setProperty('--stagger', el.dataset.stagger + 'ms');
    Array.from(el.children).forEach((c, i) => c.style.setProperty('--i', i));
  });

  /* ---- Counters ---- */
  function fmt(el, v) {
    const dec = (el.dataset.count.split('.')[1] || '').length;
    return (el.dataset.prefix || '') + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.dataset.suffix || '');
  }
  function runCount(el) {
    const to = parseFloat(el.dataset.count);
    if (reduce) { el.textContent = fmt(el, to); return; }
    const dur = parseFloat(el.dataset.duration) || 1800;
    let t0;
    const step = t => {
      if (t0 === undefined) t0 = t;
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = fmt(el, to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  $$('[data-count]').forEach(el => { el.textContent = fmt(el, 0); });

  /* ---- Scramble / decode text: data-scramble (add ="hover" to replay on hover) ---- */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/[]{}=+*^?#';
  function scramble(el) {
    const text = el.dataset.text || el.textContent;
    el.dataset.text = text;
    if (reduce) { el.textContent = text; return; }
    let frame = 0;
    const total = text.length * 2 + 14;
    cancelAnimationFrame(el._sc);
    const tick = () => {
      let out = '';
      for (let i = 0; i < text.length; i++) {
        out += (text[i] === ' ' || frame > i * 2 + 10) ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (frame++ < total) el._sc = requestAnimationFrame(tick);
    };
    tick();
  }
  $$('[data-scramble]').forEach(el => {
    el.setAttribute('aria-label', el.textContent);
    if (el.dataset.scramble === 'hover') el.addEventListener('pointerenter', () => scramble(el));
  });

  /* ---- SVG line drawing: data-draw on an <svg> ---- */
  $$('[data-draw]').forEach(svg => {
    $$('path, line, polyline, polygon, circle, rect, ellipse', svg).forEach(p => {
      if (!p.getTotalLength) return;
      const len = Math.ceil(p.getTotalLength());
      p.classList.add('draw-path');
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
  });

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('is-in');
    if (el.hasAttribute('data-count')) runCount(el);
    if (el.hasAttribute('data-scramble')) scramble(el);
    io.unobserve(el);
    // Once the entrance has played, drop the reveal hooks so the element's
    // own transitions (hover lifts, etc.) work without stagger delays.
    const settle = (parseFloat(el.dataset.delay) || 0) + 1200 +
      (el.hasAttribute('data-stagger') ? el.children.length * (parseFloat(el.dataset.stagger) || 90) : 0);
    setTimeout(() => { el.removeAttribute('data-reveal'); el.removeAttribute('data-stagger'); }, settle);
  }), { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  const startReveals = () => $$('[data-reveal],[data-stagger],[data-split],[data-count],[data-scramble],[data-draw]').forEach(el => io.observe(el));

  /* ---- Preloader: data-preloader (+ optional [data-preloader-count] inside) ---- */
  const loader = document.querySelector('[data-preloader]');
  if (loader && !reduce) {
    const num = loader.querySelector('[data-preloader-count]');
    const minTime = parseFloat(loader.dataset.preloader) || 1400;
    const t0 = performance.now();
    let loaded = document.readyState === 'complete';
    addEventListener('load', () => { loaded = true; });
    (function tick(t) {
      const p = clamp((t - t0) / minTime, 0, loaded ? 1 : .9);
      if (num) num.textContent = Math.round(p * 100);
      if (p < 1) return requestAnimationFrame(tick);
      loader.classList.add('is-done');
      root.classList.add('is-loaded');
      setTimeout(startReveals, 250);
      setTimeout(() => { loader.style.display = 'none'; }, 1600);
    })(t0);
  } else {
    if (loader) loader.style.display = 'none';
    root.classList.add('is-loaded');
    startReveals();
  }

  /* ---- Marquee ---- */
  $$('[data-marquee]').forEach(el => {
    const track = document.createElement('div');
    track.className = 'marquee__track';
    while (el.firstChild) track.appendChild(el.firstChild);
    track.innerHTML += track.innerHTML;
    el.appendChild(track);
    el.classList.add('marquee');
    if (el.hasAttribute('data-marquee-reverse')) el.classList.add('marquee--reverse');
    if (el.dataset.marquee) el.style.setProperty('--speed', el.dataset.marquee + 's');
  });

  /* ---- Typed words ---- */
  $$('[data-typed]').forEach(el => {
    const words = el.dataset.typed.split('|');
    if (reduce) { el.textContent = words[0]; return; }
    let w = 0, c = 0, del = false;
    (function tick() {
      const word = words[w];
      c += del ? -1 : 1;
      el.textContent = word.slice(0, c);
      let wait = del ? 45 : 95;
      if (!del && c === word.length) { del = true; wait = 1800; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; wait = 350; }
      setTimeout(tick, wait);
    })();
  });

  /* ---- Rotating words (flip up): data-rotate="one|two|three" ---- */
  $$('[data-rotate]').forEach(el => {
    const words = el.dataset.rotate.split('|');
    el.classList.add('rotate-words');
    el.setAttribute('aria-label', words.join(', '));
    el.innerHTML = words.map((w, i) => `<span aria-hidden="true" class="${i === 0 ? 'is-active' : ''}">${esc(w)}</span>`).join('');
    if (reduce) return;
    const spans = Array.from(el.children);
    let i = 0;
    setInterval(() => {
      spans[i].classList.remove('is-active'); spans[i].classList.add('is-out');
      const prev = spans[i];
      setTimeout(() => prev.classList.remove('is-out'), 700);
      i = (i + 1) % spans.length;
      spans[i].classList.add('is-active');
    }, parseInt(el.dataset.interval, 10) || 2200);
  });

  /* ---- Countdown: data-countdown="2026-12-31T18:00", children [data-unit=d|h|m|s] ---- */
  $$('[data-countdown]').forEach(el => {
    const end = new Date(el.dataset.countdown).getTime();
    const set = (u, v) => { const n = el.querySelector(`[data-unit="${u}"]`); if (n) n.textContent = String(v).padStart(2, '0'); };
    (function tick() {
      const left = Math.max(0, end - Date.now());
      set('d', Math.floor(left / 864e5));
      set('h', Math.floor(left / 36e5) % 24);
      set('m', Math.floor(left / 6e4) % 60);
      set('s', Math.floor(left / 1e3) % 60);
      if (left > 0) setTimeout(tick, 1000);
    })();
  });

  /* ---- Tabs ---- */
  $$('[data-tabs]').forEach(box => {
    const tabs = $$('[data-tab]', box), panels = $$('[data-panel]', box);
    const show = id => {
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === id));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === id));
    };
    tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.tab)));
    if (tabs[0]) show((tabs.find(t => t.classList.contains('is-active')) || tabs[0]).dataset.tab);
  });

  /* ---- Carousel ---- */
  $$('[data-carousel]').forEach(el => {
    const slides = Array.from(el.children);
    if (slides.length < 2) { slides[0] && slides[0].classList.add('is-active'); return; }
    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    let i = 0, timer;
    const go = n => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      Array.from(dots.children).forEach((d, k) => d.classList.toggle('is-active', k === i));
    };
    slides.forEach((_, k) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Slide ' + (k + 1));
      b.addEventListener('click', () => { go(k); restart(); });
      dots.appendChild(b);
    });
    el.after(dots);
    const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(i + 1), parseInt(el.dataset.carousel, 10) || 5000); };
    go(0); restart();
  });

  /* ---- Before / after slider: data-compare with two children ---- */
  $$('[data-compare]').forEach(el => {
    el.classList.add('compare');
    const input = document.createElement('input');
    input.type = 'range'; input.min = 0; input.max = 100; input.value = el.dataset.compare || 50;
    input.setAttribute('aria-label', 'Drag to compare before and after');
    const handle = document.createElement('span');
    handle.className = 'compare__handle';
    el.append(handle, input);
    const set = () => el.style.setProperty('--pos', input.value + '%');
    input.addEventListener('input', set); set();
  });

  /* ---- Theme toggle button: data-theme-toggle ---- */
  $$('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem(themeKey, next);
  }));

  /* ---- Click ripple: data-ripple ---- */
  $$('[data-ripple]').forEach(el => el.addEventListener('pointerdown', e => {
    const r = el.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2;
    const s = document.createElement('span');
    s.className = 'mk-ripple';
    s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    el.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }));

  /* ---- Confetti burst on click: data-confetti ---- */
  $$('[data-confetti]').forEach(el => el.addEventListener('click', e => {
    if (reduce) return;
    const colors = (el.dataset.confetti || '#ff5d8f|#ffd166|#06d6a0|#4cc9f0|#7b61ff').split('|');
    for (let i = 0; i < 70; i++) {
      const c = document.createElement('i');
      c.className = 'mk-confetti';
      c.style.background = colors[i % colors.length];
      c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px';
      if (i % 3 === 0) c.style.borderRadius = '50%';
      document.body.appendChild(c);
      const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 260;
      c.animate([
        { transform: 'translate(-50%,-50%) rotate(0deg)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * v}px, ${Math.sin(a) * v + 260}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], { duration: 1200 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => c.remove();
    }
  }));

  /* ---- Particle network background: data-particles="#color" ---- */
  $$('[data-particles]').forEach(host => {
    const cv = document.createElement('canvas');
    cv.className = 'mk-particles';
    host.prepend(cv);
    const ctx = cv.getContext('2d');
    const color = host.dataset.particles || '255,255,255';
    const rgb = color.startsWith('#') ? [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16)).join(',') : color;
    let w, h, pts = [], visible = true, mouse = { x: -999, y: -999 };
    const dpr = Math.min(devicePixelRatio || 1, 2);
    function size() {
      w = host.offsetWidth; h = host.offsetHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(clamp(w * h / 14000, 30, 110));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
    }
    host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    host.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(host);
    addEventListener('resize', size); size();
    (function draw() {
      requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 120) { p.x += (p.x - mouse.x) / dm; p.y += (p.y - mouse.y) / dm; }
        ctx.fillStyle = `rgba(${rgb},.7)`;
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) { ctx.strokeStyle = `rgba(${rgb},${(1 - d / 120) * .35})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
    })();
  });

  /* ---- Pointer effects (skip on touch) ---- */
  if (finePointer && !reduce) {
    $$('[data-magnetic]').forEach(el => {
      const s = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * s}px, ${(e.clientY - r.top - r.height / 2) * s}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    $$('[data-tilt]').forEach(el => {
      const max = parseFloat(el.dataset.tilt) || 10;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.transform = `perspective(900px) rotateX(${(.5 - y) * max}deg) rotateY(${(x - .5) * max}deg)`;
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => { el.classList.remove('is-tilting'); el.style.transform = ''; });
    });

    // Spotlight: sets --sx/--sy (px) on the element itself, and on each child card
    $$('[data-spotlight]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--sy', (e.clientY - r.top) + 'px');
        Array.from(el.children).forEach(c => {
          const cr = c.getBoundingClientRect();
          c.style.setProperty('--sx', (e.clientX - cr.left) + 'px');
          c.style.setProperty('--sy', (e.clientY - cr.top) + 'px');
        });
      });
    });

    // Image trail: children with .trail-item pop up along the cursor path
    $$('[data-trail]').forEach(el => {
      const items = $$('.trail-item', el);
      if (!items.length) return;
      let lx = 0, ly = 0, k = 0, z = 1;
      const gap = parseFloat(el.dataset.trail) || 90;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        if (Math.hypot(x - lx, y - ly) < gap) return;
        lx = x; ly = y;
        const it = items[k++ % items.length];
        it.classList.remove('is-on'); void it.offsetWidth;
        it.style.left = x + 'px'; it.style.top = y + 'px'; it.style.zIndex = z++;
        it.classList.add('is-on');
      });
    });

    if (document.body.hasAttribute('data-cursor')) {
      const dot = document.createElement('div'), ring = document.createElement('div');
      dot.className = 'mk-cursor'; ring.className = 'mk-cursor-ring';
      document.body.append(dot, ring);
      let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
      addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; });
      (function loop() {
        rx += (x - rx) * .16; ry += (y - ry) * .16;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      })();
      document.addEventListener('pointerover', e => {
        const t = e.target.closest('a, button, [data-cursor-text], [data-cursor-hover]');
        const text = t && t.dataset.cursorText;
        ring.classList.toggle('is-hover', !!t && !text);
        ring.classList.toggle('has-text', !!text);
        ring.textContent = text || '';
      });
    }
  }

  /* ---- Scroll-lit text: data-scrub (words light up as you scroll) ---- */
  const scrubs = $$('[data-scrub]').map(el => {
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = el.innerHTML.split(/(<[^>]+>|\s+)/).map(part =>
      !part || part.startsWith('<') || /^\s+$/.test(part) ? part : `<span class="scrub-w" aria-hidden="true">${part}</span>`).join('');
    return { el, words: $$('.scrub-w', el) };
  });

  /* ---- Scroll-linked: progress, header, parallax, h-scroll, stack, expand, zoom, skew ---- */
  const bars = $$('[data-scroll-progress]');
  const headers = $$('[data-header]');
  const parallax = $$('[data-parallax]');
  const hscrolls = $$('[data-hscroll]').map(sec => ({ sec, track: sec.querySelector('.hscroll__track') }));
  const stacks = $$('[data-stack]').map(el => {
    const cards = Array.from(el.children);
    const top = parseFloat(el.dataset.stack) || 100;
    cards.forEach((c, i) => { c.style.top = (top + i * 18) + 'px'; });
    return cards;
  });
  const expands = $$('[data-expand]');
  const zooms = $$('[data-zoom]');
  const skews = $$('[data-skew]');

  function sizeH() {
    hscrolls.forEach(h => {
      const extra = Math.max(0, h.track.scrollWidth - innerWidth);
      h.extra = extra;
      h.sec.style.height = (innerHeight + extra) + 'px';
    });
  }
  function onScroll() {
    const y = scrollY, vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    bars.forEach(b => { b.style.transform = `scaleX(${max > 0 ? y / max : 0})`; });
    headers.forEach(h => h.classList.toggle('is-scrolled', y > 24));
    hscrolls.forEach(h => {
      const r = h.sec.getBoundingClientRect();
      const p = clamp(-r.top / (h.extra || 1), 0, 1);
      h.track.style.transform = `translate3d(${-p * h.extra}px, 0, 0)`;
    });
    scrubs.forEach(s => {
      const r = s.el.getBoundingClientRect();
      const p = clamp((vh * .85 - r.top) / (vh * .6 + r.height * .5), 0, 1);
      const lit = Math.round(p * s.words.length);
      s.words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    });
    if (reduce) return;
    parallax.forEach(el => {
      const r = (el.parentElement || el).getBoundingClientRect();
      const c = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-c * (parseFloat(el.dataset.parallax) || .15)).toFixed(1)}px, 0)`;
    });
    stacks.forEach(cards => cards.forEach((c, i) => {
      const next = cards[i + 1];
      if (!next) return;
      const cr = c.getBoundingClientRect(), nr = next.getBoundingClientRect();
      const p = clamp(1 - (nr.top - cr.top) / cr.height, 0, 1);
      c.style.transform = `scale(${1 - p * .06})`;
      c.style.filter = `brightness(${1 - p * .3})`;
    }));
    expands.forEach(el => {
      const r = el.getBoundingClientRect();
      const p = clamp(1 - r.top / vh, 0, 1);
      const inset = (1 - p) * (parseFloat(el.dataset.expand) || 10);
      el.style.clipPath = `inset(0 ${inset}% round ${(1 - p) * 40}px)`;
    });
    zooms.forEach(el => {
      const r = (el.parentElement || el).getBoundingClientRect();
      const p = clamp(1 - (r.top + r.height) / (vh + r.height), 0, 1);
      const to = parseFloat(el.dataset.zoom) || 1.25;
      el.style.transform = `scale(${to - (to - 1) * p})`;
    });
  }

  // Skew with scroll velocity (eases back to 0 when scrolling stops)
  if (skews.length && !reduce) {
    let last = scrollY, skew = 0;
    (function loop() {
      const v = scrollY - last; last = scrollY;
      skew += (clamp(v * .25, -8, 8) - skew) * .12;
      skews.forEach(el => { el.style.transform = `skewY(${skew.toFixed(2)}deg)`; });
      requestAnimationFrame(loop);
    })();
  }

  let ticking = false;
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { sizeH(); request(); });
  addEventListener('load', () => { sizeH(); onScroll(); });
  sizeH(); onScroll();
})();
