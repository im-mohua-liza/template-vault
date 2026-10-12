/* ==========================================================================
   Vault bridge — lets the Template Vault customiser recolour this page live.
   Only used inside the vault: new-site.ps1 strips it from client projects.
   Message: { vault: 'theme', vars: { '--bg': '#fff' }, fonts: ['Inter', 'Fraunces'] }
   ========================================================================== */
(function () {
  'use strict';
  const VAR = /^--[a-z0-9-]+$/i;
  const SAFE = /^[^;{}<>"\\]{1,80}$/;     // plain CSS values only
  const FONT = /^[A-Za-z0-9 ]{1,40}$/;    // Google Fonts family names
  const applied = new Set();

  addEventListener('message', e => {
    const d = e.data;
    if (!d || d.vault !== 'theme') return;
    const targets = [document.documentElement, document.body];
    // Clear anything set by a previous message
    applied.forEach(k => targets.forEach(t => t.style.removeProperty(k)));
    applied.clear();
    Object.entries(d.vars || {}).forEach(([k, v]) => {
      if (!VAR.test(k) || !SAFE.test(String(v))) return;
      targets.forEach(t => t.style.setProperty(k, v));
      applied.add(k);
    });
    const fams = (d.fonts || []).filter(f => FONT.test(f));
    if (fams.length) {
      let link = document.getElementById('vault-fonts');
      if (!link) { link = document.createElement('link'); link.id = 'vault-fonts'; link.rel = 'stylesheet'; document.head.appendChild(link); }
      link.href = 'https://fonts.googleapis.com/css2?' + fams.map(f => 'family=' + f.replace(/ /g, '+') + ':wght@400;500;600;700;800').join('&') + '&display=swap';
    }
  });

  // Tell the vault we're ready to receive a theme
  if (parent !== window) parent.postMessage({ vault: 'ready' }, '*');
})();
