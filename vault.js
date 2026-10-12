(function () {
  'use strict';
  const T = window.TEMPLATES || [], S = window.SNIPPETS || [], P = window.PALETTES || [], F = window.FONT_PAIRS || [];
  const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const url = t => `templates/${t.id}/index.html`;
  const state = { view: 'templates', cat: 'All', style: 'All', theme: 'all', favOnly: false, sort: 'default', group: 'All', q: '' };

  /* ---------- Favourites (saved in this browser) ---------- */
  const favs = new Set(JSON.parse(localStorage.getItem('vault-favs') || '[]'));
  const saveFavs = () => localStorage.setItem('vault-favs', JSON.stringify([...favs]));
  function toggleFav(id) {
    favs.has(id) ? favs.delete(id) : favs.add(id);
    saveFavs();
    $$(`[data-fav="${id}"]`).forEach(b => { b.classList.toggle('is-on', favs.has(id)); b.textContent = favs.has(id) ? '★' : '☆'; });
    if (current && current.id === id) $('#m-fav').textContent = favs.has(id) ? '★' : '☆';
    toast(favs.has(id) ? 'Added to favourites' : 'Removed from favourites');
    if (state.favOnly) render(true);
  }

  $('#summary').textContent = `${T.length} templates · ${S.length} animations · ${P.length} palettes`;

  /* ---------- Toast + clipboard ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('is-on'), 1800);
  }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); }
    catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    toast(msg || 'Copied');
  }

  /* ---------- Views ---------- */
  const placeholders = { templates: 'Search templates, industries, sections, animations…  ( / )', animations: 'Search animations…  ( / )', styles: 'Search palettes and fonts…  ( / )' };
  function setView(v) {
    state.view = v;
    $$('.tabs button').forEach(b => b.classList.toggle('is-active', b.dataset.view === v));
    $$('.view').forEach(el => el.classList.toggle('is-active', el.id === 'view-' + v));
    $('#q').placeholder = placeholders[v];
    if (v === 'styles') loadFonts();
    render();
  }
  $$('.tabs button').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));

  /* ---------- Filter chips ---------- */
  function chipRow(el, values, key, counter) {
    el.innerHTML = ['All', ...values].map(v => `<button data-v="${esc(v)}" class="${v === state[key] ? 'is-active' : ''}">${esc(v)}${counter ? `<span>${counter(v)}</span>` : ''}</button>`).join('');
    Array.from(el.children).forEach(b => b.addEventListener('click', () => {
      state[key] = b.dataset.v;
      Array.from(el.children).forEach(x => x.classList.toggle('is-active', x === b));
      render();
    }));
  }
  const uniq = arr => [...new Set(arr)];
  chipRow($('#chips'), uniq(T.map(t => t.category)), 'cat', v => v === 'All' ? T.length : T.filter(t => t.category === v).length);
  chipRow($('#style-chips'), uniq(T.map(t => t.style)).sort(), 'style', v => v === 'All' ? T.length : T.filter(t => t.style === v).length);
  chipRow($('#group-chips'), uniq(S.map(s => s.group)), 'group', v => v === 'All' ? S.length : S.filter(s => s.group === v).length);
  $$('.chips--theme button').forEach(b => b.addEventListener('click', () => {
    state.theme = b.dataset.theme;
    $$('.chips--theme button').forEach(x => x.classList.toggle('is-active', x === b));
    render();
  }));
  $('#fav-filter').addEventListener('click', e => {
    state.favOnly = !state.favOnly;
    e.currentTarget.classList.toggle('is-active', state.favOnly);
    e.currentTarget.setAttribute('aria-pressed', state.favOnly);
    render();
  });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });

  /* ---------- Search ---------- */
  $('#q').addEventListener('input', e => { state.q = e.target.value.trim().toLowerCase(); render(); });
  document.addEventListener('keydown', e => {
    const typing = /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); $('#q').focus(); }
    if ($('#modal').hidden) return;
    if (e.key === 'Escape') closeModal();
    if (!typing && e.key === 'ArrowRight') step(1);
    if (!typing && e.key === 'ArrowLeft') step(-1);
  });
  const matches = (obj, fields) => !state.q || fields.map(f => [].concat(obj[f] || []).join(' ')).join(' ').toLowerCase().includes(state.q);

  /* ---------- Thumbnails scale to fit their card ---------- */
  const ro = new ResizeObserver(entries => entries.forEach(e => e.target.style.setProperty('--s', e.contentRect.width / 1440)));

  /* ---------- Render: templates ---------- */
  let visible = T;
  function filteredTemplates() {
    let list = T.filter(t =>
      (state.cat === 'All' || t.category === state.cat) &&
      (state.style === 'All' || t.style === state.style) &&
      (state.theme === 'all' || t.theme === state.theme) &&
      (!state.favOnly || favs.has(t.id)) &&
      matches(t, ['name', 'category', 'style', 'description', 'bestFor', 'sections', 'animations', 'fonts']));
    if (state.sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === 'new') list = [...list].reverse().sort((a, b) => b.added.localeCompare(a.added));
    return list;
  }
  function renderTemplates(force) {
    visible = filteredTemplates();
    const grid = $('#grid');
    const want = visible.map(t => t.id).join(',');
    $('#count').textContent = `${visible.length} of ${T.length} templates`;
    $('#empty').hidden = visible.length > 0;
    // Only rebuild when the list changed, so live previews don't reload on every keystroke.
    if (grid.dataset.ids === want && !force) return;
    grid.dataset.ids = want;
    grid.innerHTML = visible.map((t, i) => `
      <article class="card" style="--i:${i}">
        <div class="thumb" data-open="${t.id}">
          <span class="thumb__badge">${t.theme === 'dark' ? '● Dark' : '○ Light'} · ${esc(t.style)}</span>
          <iframe src="${url(t)}" loading="lazy" tabindex="-1" aria-hidden="true" title="${esc(t.name)}"></iframe>
        </div>
        <div class="card__body">
          <div class="card__row"><h2>${esc(t.name)}</h2>
            <div class="card__row-r"><div class="swatches">${t.colors.map(c => `<i style="background:${c}"></i>`).join('')}</div>
            <button class="star ${favs.has(t.id) ? 'is-on' : ''}" data-fav="${t.id}" aria-label="Favourite ${esc(t.name)}">${favs.has(t.id) ? '★' : '☆'}</button></div>
          </div>
          <span class="card__cat">${esc(t.category)}</span>
          <p>${esc(t.description)}</p>
          <div class="tags">${t.animations.slice(0, 3).map(a => `<span>${esc(a)}</span>`).join('')}${t.animations.length > 3 ? `<span>+${t.animations.length - 3} more</span>` : ''}</div>
          <div class="card__actions">
            <button class="btn" data-open="${t.id}">Preview</button>
            <a class="btn btn--ghost" href="${url(t)}" target="_blank">Open ↗</a>
            <button class="btn btn--ghost" data-use="${t.id}">Use</button>
          </div>
        </div>
      </article>`).join('');
    $$('#grid .thumb').forEach(th => ro.observe(th));
    $$('#grid [data-open]').forEach(el => el.addEventListener('click', () => openModal(el.dataset.open)));
    $$('#grid [data-use]').forEach(el => el.addEventListener('click', () => openModal(el.dataset.use, true)));
    $$('#grid [data-fav]').forEach(el => el.addEventListener('click', () => toggleFav(el.dataset.fav)));
  }

  /* ---------- Render: animations ---------- */
  function highlight(code) {
    return esc(code)
      .replace(/(&lt;\/?)([a-z0-9-]+)/gi, '$1<span class="t">$2</span>')
      .replace(/ ([a-z-]+)=(&quot;)/gi, ' <span class="a">$1</span>=$2')
      .replace(/(&quot;)(.*?)(&quot;)/g, '$1<span class="s">$2</span>$3');
  }
  function renderSnippets() {
    const list = S.filter(s => (state.group === 'All' || s.group === state.group) && matches(s, ['name', 'description', 'code', 'group']));
    const groups = uniq(list.map(s => s.group));
    let i = 0;
    $('#snippets').innerHTML = groups.map(g => `
      <h2 class="sub">${esc(g)} <small>${list.filter(s => s.group === g).length}</small></h2>
      <div class="snippets">${list.filter(s => s.group === g).map(s => `
        <div class="snippet" style="--i:${i++}">
          <div class="snippet__head"><h3>${esc(s.name)}</h3>
            <div class="snippet__links"><a class="btn btn--ghost btn--sm" href="animations.html#${s.id}" target="_blank">Live ↗</a><button class="btn btn--sm" data-copy="${s.id}">Copy</button></div>
          </div>
          <p>${esc(s.description)}</p>
          <pre>${highlight(s.code)}</pre>
        </div>`).join('')}</div>`).join('') || '<p class="empty">No animations match that search.</p>';
    $$('[data-copy]').forEach(b => b.addEventListener('click', () => copy(S.find(s => s.id === b.dataset.copy).code, 'Snippet copied')));
  }

  /* ---------- Render: styles (palettes + fonts) ---------- */
  let fontsLoaded = false;
  function loadFonts() {
    if (fontsLoaded) return;
    fontsLoaded = true;
    const fams = uniq(F.flatMap(f => [f.display, f.body])).map(f => 'family=' + f.replace(/ /g, '+') + ':wght@400;700').join('&');
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?' + fams + '&display=swap';
    document.head.appendChild(l);
  }
  const textOn = hex => { const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#111' : '#fff'; };
  function renderStyles() {
    const pals = P.filter(p => matches(p, ['name', 'mood', 'colors']));
    $('#palettes').innerHTML = pals.map((p, i) => `
      <div class="pal" style="--i:${i}">
        <div class="pal__strip">${p.colors.map(c => `<button data-hex="${c}" style="background:${c};color:${textOn(c)}" title="Copy ${c}"><span>${c}</span></button>`).join('')}</div>
        <div class="pal__meta"><div><b>${esc(p.name)}</b><small>${esc(p.mood)}</small></div><button class="btn btn--ghost btn--sm" data-pal="${i}">Copy CSS</button></div>
      </div>`).join('') || '<p class="empty">No palettes match.</p>';
    $$('[data-hex]').forEach(b => b.addEventListener('click', () => copy(b.dataset.hex, b.dataset.hex + ' copied')));
    $$('[data-pal]').forEach(b => b.addEventListener('click', () => {
      const p = pals[b.dataset.pal], names = ['--bg', '--text', '--accent', '--accent-2', '--accent-3'];
      copy(`:root {\n${p.colors.map((c, k) => `  ${names[k]}: ${c};`).join('\n')}\n}`, `${p.name} copied as CSS`);
    }));

    const fonts = F.filter(f => matches(f, ['display', 'body', 'mood']));
    $('#fonts').innerHTML = fonts.map((f, i) => `
      <div class="fpair" style="--i:${i}">
        <p class="fpair__d" style="font-family:'${f.display}'">The quick brown fox</p>
        <p class="fpair__b" style="font-family:'${f.body}'">Good typography makes a website feel trustworthy before anyone reads a word.</p>
        <div class="pal__meta"><div><b>${esc(f.display)}${f.body !== f.display ? ' + ' + esc(f.body) : ''}</b><small>${esc(f.mood)}</small></div><button class="btn btn--ghost btn--sm" data-font="${i}">Copy</button></div>
      </div>`).join('') || '<p class="empty">No fonts match.</p>';
    $$('[data-font]').forEach(b => b.addEventListener('click', () => {
      const f = fonts[b.dataset.font];
      const fam = uniq([f.display, f.body]).map(n => 'family=' + n.replace(/ /g, '+') + ':wght@400;500;700').join('&');
      copy(`<link href="https://fonts.googleapis.com/css2?${fam}&display=swap" rel="stylesheet">\n\n:root {\n  --display: '${f.display}', sans-serif;\n  --font: '${f.body}', sans-serif;\n}`, 'Font pairing copied');
    }));
  }

  function render(force) {
    if (state.view === 'templates') renderTemplates(force);
    if (state.view === 'animations') renderSnippets();
    if (state.view === 'styles') renderStyles();
  }

  /* ---------- Preview modal ---------- */
  let current;
  const slug = s => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-') || 'new-client';
  function updateCmd() {
    const name = slug($('#m-client').value || 'new-client');
    $('#m-cmd').textContent = `powershell -ExecutionPolicy Bypass -File .\\new-site.ps1 -Template ${current.id} -Client ${name} -Open`;
  }
  function fill(t) {
    current = t;
    $('#m-name').textContent = t.name;
    $('#m-cat').textContent = t.category;
    $('#m-desc').textContent = t.description;
    $('#m-best').textContent = t.bestFor;
    $('#m-style').textContent = `${t.style} · ${t.theme}`;
    $('#m-fonts').textContent = t.fonts;
    $('#m-colors').innerHTML = t.colors.map(c => `<i style="background:${c}" title="${c}"></i>`).join('');
    $('#m-sections').innerHTML = t.sections.map(s => `<span>${esc(s)}</span>`).join('');
    $('#m-anims').innerHTML = t.animations.map(s => `<span>${esc(s)}</span>`).join('');
    $('#m-fav').textContent = favs.has(t.id) ? '★' : '☆';
    $('#m-open').href = url(t);
    $('#m-frame').src = url(t);
    updateCmd();
  }
  function openModal(id, focusUse) {
    const t = T.find(x => x.id === id);
    if (!t) return;
    fill(t);
    setDevice('100%');
    $('#modal').hidden = false;
    document.body.style.overflow = 'hidden';
    const info = $('#info');
    info.classList.toggle('is-hidden', !focusUse && innerWidth < 900);
    if (focusUse) { info.classList.remove('is-hidden'); setTimeout(() => $('#m-client').focus(), 350); }
  }
  function step(dir) {
    const list = visible.length ? visible : T;
    const i = list.findIndex(t => t.id === current.id);
    fill(list[(i + dir + list.length) % list.length]);
  }
  function closeModal() {
    $('#modal').hidden = true;
    $('#m-frame').src = 'about:blank';
    document.body.style.overflow = '';
  }
  function setDevice(w) {
    $('#frame-wrap').style.width = w;
    $$('#devices button').forEach(b => b.classList.toggle('is-active', b.dataset.w === w));
  }
  $$('#devices button').forEach(b => b.addEventListener('click', () => setDevice(b.dataset.w)));
  $('[data-close]').addEventListener('click', closeModal);
  $('#m-prev').addEventListener('click', () => step(-1));
  $('#m-next').addEventListener('click', () => step(1));
  $('#m-fav').addEventListener('click', () => toggleFav(current.id));
  $('#m-reload').addEventListener('click', () => { $('#m-frame').src = url(current); });
  $('#m-info-toggle').addEventListener('click', () => { $('#info').classList.toggle('is-hidden'); });
  $('#m-client').addEventListener('input', updateCmd);
  $('#m-copy').addEventListener('click', () => copy($('#m-cmd').textContent, 'Command copied. Paste it in PowerShell'));

  // Deep links: index.html#animations or #styles opens that tab
  const fromHash = () => { const v = location.hash.slice(1); if (placeholders[v]) setView(v); };
  addEventListener('hashchange', fromHash);
  if (placeholders[location.hash.slice(1)]) fromHash(); else render();
})();
