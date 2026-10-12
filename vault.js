(function () {
  'use strict';
  const T = window.TEMPLATES || [], S = window.SNIPPETS || [], P = window.PALETTES || [], F = window.FONT_PAIRS || [];
  const CZ = window.CUSTOMIZE || {}, CL = window.CHECKLIST || [];
  const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const url = t => `templates/${t.id}/index.html`;
  const uniq = arr => [...new Set(arr)];
  const VIEWS = ['templates', 'animations', 'styles', 'launch'];
  const state = { view: 'templates', cat: 'All', style: 'All', theme: 'all', favOnly: false, sort: 'default', group: 'All', q: '' };
  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
  };
  let current = null;

  $('#summary').textContent = `${T.length} templates · ${S.length} animations · ${P.length} palettes`;

  /* ---------- Toast + clipboard ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('is-on'), 1900);
  }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); }
    catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    toast(msg || 'Copied');
  }

  /* ---------- URL hash routing: #styles, #launch, #preview/nova ---------- */
  const setHash = h => history.replaceState(null, '', h ? '#' + h : location.pathname + location.search);
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.startsWith('preview/')) { const id = h.split('/')[1]; if (T.some(t => t.id === id)) { if (state.view !== 'templates') setView('templates', true); openModal(id); return; } }
    if (VIEWS.includes(h)) setView(h, true); else render();
  }
  addEventListener('hashchange', route);

  /* ---------- Favourites (saved in this browser) ---------- */
  const favs = new Set(store.get('vault-favs', []));
  function toggleFav(id) {
    favs.has(id) ? favs.delete(id) : favs.add(id);
    store.set('vault-favs', [...favs]);
    $$(`[data-fav="${id}"]`).forEach(b => { b.classList.toggle('is-on', favs.has(id)); b.textContent = favs.has(id) ? '★' : '☆'; });
    if (current && current.id === id) $('#m-fav').textContent = favs.has(id) ? '★' : '☆';
    toast(favs.has(id) ? 'Added to shortlist ★' : 'Removed from shortlist');
    updateShortlist();
    if (state.favOnly) renderTemplates(true);
  }

  /* ---------- Client shortlist link ---------- */
  function shortlistUrl() {
    const ids = T.filter(t => favs.has(t.id)).map(t => t.id).join(',');
    const client = $('#sl-client').value.trim();
    const base = location.href.split('#')[0].replace(/index\.html$/, '').replace(/[^/]*$/, '');
    return `${base}present.html?ids=${ids}${client ? '&client=' + encodeURIComponent(client) : ''}`;
  }
  function updateShortlist() {
    $('#shortlist').hidden = favs.size === 0;
    $('#sl-count').textContent = favs.size;
    $('#sl-open').href = shortlistUrl();
  }
  $('#sl-client').addEventListener('input', updateShortlist);
  $('#sl-copy').addEventListener('click', () => copy(shortlistUrl(), location.protocol === 'file:' ? 'Copied. Tip: share the link from the live site so clients can open it' : 'Client link copied'));

  /* ---------- Views ---------- */
  const placeholders = { templates: 'Search templates, industries, sections, animations…  ( / )', animations: 'Search animations…  ( / )', styles: 'Search palettes and fonts…  ( / )', launch: 'Search checklist…  ( / )' };
  function setView(v, fromRoute) {
    state.view = v;
    $$('.tabs button').forEach(b => b.classList.toggle('is-active', b.dataset.view === v));
    $$('.view').forEach(el => el.classList.toggle('is-active', el.id === 'view-' + v));
    $('#q').placeholder = placeholders[v];
    if (v === 'styles') loadFonts();
    if (!fromRoute) setHash(v === 'templates' ? '' : v);
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

  /* ---------- Search + keyboard ---------- */
  $('#q').addEventListener('input', e => { state.q = e.target.value.trim().toLowerCase(); render(); });
  const matches = (obj, fields) => !state.q || fields.map(f => [].concat(obj[f] || []).join(' ')).join(' ').toLowerCase().includes(state.q);
  document.addEventListener('keydown', e => {
    const typing = /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName);
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape') { if (!$('#help').hidden) return toggleHelp(false); if (!$('#modal').hidden) return closeModal(); if (typing) document.activeElement.blur(); return; }
    if (typing) return;
    if (e.key === '/') { e.preventDefault(); $('#q').focus(); return; }
    if (e.key === '?') return toggleHelp(true);
    const modalOpen = !$('#modal').hidden;
    if (modalOpen) {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'f' || e.key === 'F') toggleFav(current.id);
      const dev = { 1: '100%', 2: '820px', 3: '390px' }[e.key];
      if (dev) setDevice(dev);
    } else {
      if (e.key === 'r' || e.key === 'R') surprise();
      const v = VIEWS[parseInt(e.key, 10) - 1];
      if (v) setView(v);
    }
  });

  /* ---------- Help overlay + surprise ---------- */
  function toggleHelp(on) { $('#help').hidden = !on; }
  $('#help-btn').addEventListener('click', () => toggleHelp(true));
  $('#help-close').addEventListener('click', () => toggleHelp(false));
  $('#help').addEventListener('click', e => { if (e.target.id === 'help') toggleHelp(false); });
  function surprise() {
    const pool = T.filter(t => !current || t.id !== current.id);
    const t = pool[Math.floor(Math.random() * pool.length)];
    if (state.view !== 'templates') setView('templates');
    openModal(t.id);
    toast('🎲 ' + t.name);
  }
  $('#surprise').addEventListener('click', surprise);

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
    updateShortlist();
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
            <button class="star ${favs.has(t.id) ? 'is-on' : ''}" data-fav="${t.id}" aria-label="Add ${esc(t.name)} to shortlist">${favs.has(t.id) ? '★' : '☆'}</button></div>
          </div>
          <span class="card__cat">${esc(t.category)}</span>
          <p>${esc(t.description)}</p>
          <div class="tags">${t.animations.slice(0, 3).map(a => `<span>${esc(a)}</span>`).join('')}${t.animations.length > 3 ? `<span>+${t.animations.length - 3} more</span>` : ''}</div>
          <div class="card__actions">
            <button class="btn" data-open="${t.id}">Preview</button>
            <a class="btn btn--ghost" href="${url(t)}" target="_blank">Open ↗</a>
            <button class="btn btn--ghost" data-use="${t.id}">Customise</button>
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
    let i = 0;
    $('#snippets').innerHTML = uniq(list.map(s => s.group)).map(g => `
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

  /* ---------- Render: launch checklist ---------- */
  const launch = store.get('vault-launch', { current: 'My first client', projects: { 'My first client': [] } });
  const saveLaunch = () => store.set('vault-launch', launch);
  const itemId = (g, i) => `${g}:${i}`;
  const totalItems = CL.reduce((n, g) => n + g.items.length, 0);
  function renderLaunch() {
    const names = Object.keys(launch.projects);
    if (!names.includes(launch.current)) launch.current = names[0];
    $('#lp-select').innerHTML = names.map(n => `<option ${n === launch.current ? 'selected' : ''}>${esc(n)}</option>`).join('');
    $('#lp-del').disabled = names.length < 2;
    const done = new Set(launch.projects[launch.current] || []);
    const pct = Math.round(done.size / totalItems * 100);
    $('#lp-bar').style.width = pct + '%';
    $('#lp-pct').textContent = pct === 100 ? '100% 🎉 Ready to launch' : `${pct}% · ${done.size} of ${totalItems}`;
    $('#lp-groups').innerHTML = CL.map((g, gi) => {
      const items = g.items.map((t, i) => ({ t, id: itemId(gi, i) })).filter(x => matches({ t: x.t, g: g.group }, ['t', 'g']));
      if (!items.length) return '';
      const n = g.items.filter((_, i) => done.has(itemId(gi, i))).length;
      return `<section class="lg"><h3>${esc(g.group)} <small>${n}/${g.items.length}</small></h3>${items.map(x => `
        <label class="lg__item ${done.has(x.id) ? 'is-done' : ''}"><input type="checkbox" data-item="${x.id}" ${done.has(x.id) ? 'checked' : ''}><span>${esc(x.t)}</span></label>`).join('')}</section>`;
    }).join('') || '<p class="empty">Nothing matches that search.</p>';
    $$('[data-item]').forEach(cb => cb.addEventListener('change', () => {
      const list = new Set(launch.projects[launch.current] || []);
      cb.checked ? list.add(cb.dataset.item) : list.delete(cb.dataset.item);
      launch.projects[launch.current] = [...list];
      saveLaunch(); renderLaunch();
      if (list.size === totalItems) toast('🎉 Everything ticked. Ship it!');
    }));
  }
  $('#lp-select').addEventListener('change', e => { launch.current = e.target.value; saveLaunch(); renderLaunch(); });
  function addProject() {
    const name = $('#lp-new').value.trim();
    if (!name) { $('#lp-new').focus(); return; }
    if (!launch.projects[name]) launch.projects[name] = [];
    launch.current = name; $('#lp-new').value = '';
    saveLaunch(); renderLaunch(); toast(`Project "${name}" added`);
  }
  $('#lp-add').addEventListener('click', addProject);
  $('#lp-new').addEventListener('keydown', e => { if (e.key === 'Enter') addProject(); });
  $('#lp-del').addEventListener('click', () => {
    if (Object.keys(launch.projects).length < 2) return;
    const gone = launch.current;
    delete launch.projects[gone];
    launch.current = Object.keys(launch.projects)[0];
    saveLaunch(); renderLaunch(); toast(`Deleted "${gone}"`);
  });

  function render(force) {
    if (state.view === 'templates') renderTemplates(force);
    if (state.view === 'animations') renderSnippets();
    if (state.view === 'styles') renderStyles();
    if (state.view === 'launch') renderLaunch();
  }

  /* ---------- Customiser (live recolour via templates/_shared/vault-bridge.js) ---------- */
  const custom = {};   // per template: { vars: {'--bg': '#fff'}, pair: -1 }
  const frame = () => $('#m-frame');
  const cz = () => custom[current.id] || (custom[current.id] = { vars: {}, pair: -1 });
  function themePayload() {
    const c = cz(), conf = CZ[current.id] || {}, fv = conf.fonts || {};
    const vars = { ...c.vars }, fonts = [];
    const pair = F[c.pair];
    if (pair) {
      if (fv.display) { vars[fv.display] = `'${pair.display}', sans-serif`; fonts.push(pair.display); }
      if (fv.body) { vars[fv.body] = `'${pair.body}', sans-serif`; fonts.push(pair.body); }
    }
    return { vault: 'theme', vars, fonts: uniq(fonts) };
  }
  const sendTheme = () => { try { frame().contentWindow.postMessage(themePayload(), '*'); } catch (e) { /* frame not ready */ } };
  addEventListener('message', e => {
    if (e.data && e.data.vault === 'ready' && current && e.source === frame().contentWindow) sendTheme();
  });
  function renderCustomiser() {
    const conf = CZ[current.id] || { colors: [], fonts: {} };
    const c = cz();
    $('#cz-colors').innerHTML = conf.colors.map(([v, label, def]) => {
      const val = c.vars[v] || def;
      return `<label class="cz__c ${c.vars[v] ? 'is-changed' : ''}"><input type="color" data-var="${v}" value="${val}"><span>${esc(label)}<small>${val}</small></span></label>`;
    }).join('');
    $$('#cz-colors input').forEach(inp => inp.addEventListener('input', () => {
      cz().vars[inp.dataset.var] = inp.value;
      inp.nextElementSibling.querySelector('small').textContent = inp.value;
      inp.parentElement.classList.add('is-changed');
      sendTheme(); updateCmd();
    }));
    const fv = conf.fonts || {};
    $('#cz-font').innerHTML = `<option value="-1">Original (${esc(current.fonts)})</option>` +
      F.map((f, i) => `<option value="${i}" ${i === c.pair ? 'selected' : ''}>${esc(f.display)}${fv.body && f.body !== f.display ? ' + ' + esc(f.body) : ''} · ${esc(f.mood)}</option>`).join('');
    // Quick palettes: map palette colours onto this template's colour slots in order
    $('#cz-pals').innerHTML = P.map((p, i) => `<button data-qp="${i}" title="${esc(p.name)}">${p.colors.slice(0, 4).map(col => `<i style="background:${col}"></i>`).join('')}</button>`).join('');
    $$('#cz-pals button').forEach(b => b.addEventListener('click', () => {
      const p = P[b.dataset.qp];
      conf.colors.forEach(([v], k) => { if (p.colors[k]) cz().vars[v] = p.colors[k]; });
      renderCustomiser(); sendTheme(); updateCmd(); toast(`Applied "${p.name}"`);
    }));
  }
  $('#cz-font').addEventListener('change', e => { cz().pair = parseInt(e.target.value, 10); sendTheme(); updateCmd(); });
  $('#cz-reset').addEventListener('click', () => { custom[current.id] = { vars: {}, pair: -1 }; renderCustomiser(); sendTheme(); updateCmd(); toast('Back to the original look'); });
  $('#cz-copy').addEventListener('click', () => {
    const p = themePayload(), lines = Object.entries(p.vars).map(([k, v]) => `  ${k}: ${v};`);
    if (!lines.length) return toast('Nothing customised yet');
    const link = p.fonts.length ? `<link href="https://fonts.googleapis.com/css2?${p.fonts.map(f => 'family=' + f.replace(/ /g, '+') + ':wght@400;500;600;700;800').join('&')}&display=swap" rel="stylesheet">\n\n` : '';
    copy(`${link}:root, body, body[data-color] {\n${lines.join('\n')}\n}`, 'Brand CSS copied');
  });

  /* ---------- Preview modal ---------- */
  const slug = s => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-') || 'new-client';
  function updateCmd() {
    const name = slug($('#m-client').value || 'new-client');
    const c = cz(), conf = CZ[current.id] || {}, fv = conf.fonts || {};
    let cmd = `powershell -ExecutionPolicy Bypass -File .\\new-site.ps1 -Template ${current.id} -Client ${name}`;
    const theme = Object.entries(c.vars).map(([k, v]) => `${k}:${v}`).join(';');
    if (theme) cmd += ` -Theme "${theme}"`;
    const pair = F[c.pair];
    if (pair && fv.display) {
      cmd += fv.body ? ` -Fonts "${pair.display}|${pair.body}" -FontVars "${fv.display}|${fv.body}"` : ` -Fonts "${pair.display}" -FontVars "${fv.display}"`;
    }
    $('#m-cmd').textContent = cmd + ' -Open';
  }
  function fill(t) {
    current = t;
    $('#m-name').textContent = t.name;
    $('#m-cat').textContent = t.category;
    $('#m-desc').textContent = t.description;
    $('#m-best').textContent = t.bestFor;
    $('#m-style').textContent = `${t.style} · ${t.theme}`;
    $('#m-fonts').textContent = t.fonts;
    $('#m-sections').innerHTML = t.sections.map(s => `<span>${esc(s)}</span>`).join('');
    $('#m-anims').innerHTML = t.animations.map(s => `<span>${esc(s)}</span>`).join('');
    $('#m-fav').textContent = favs.has(t.id) ? '★' : '☆';
    $('#m-open').href = url(t);
    frame().src = url(t);
    renderCustomiser();
    updateCmd();
    setHash('preview/' + t.id);
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
    if (focusUse) { info.classList.remove('is-hidden'); info.scrollTop = 0; }
  }
  function step(dir) {
    const list = visible.length ? visible : T;
    const i = list.findIndex(t => t.id === current.id);
    fill(list[(i + dir + list.length) % list.length]);
  }
  function closeModal() {
    $('#modal').hidden = true;
    frame().src = 'about:blank';
    document.body.style.overflow = '';
    current = null;
    setHash(state.view === 'templates' ? '' : state.view);
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
  $('#m-link').addEventListener('click', () => copy(location.href, 'Link to this preview copied'));
  $('#m-reload').addEventListener('click', () => { frame().src = url(current); });
  $('#m-info-toggle').addEventListener('click', () => { $('#info').classList.toggle('is-hidden'); });
  $('#m-client').addEventListener('input', updateCmd);
  $('#m-copy').addEventListener('click', () => copy($('#m-cmd').textContent, 'Command copied. Paste it in PowerShell'));

  route();
})();
