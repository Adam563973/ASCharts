(() => {
  'use strict';

  const A = window.ASCharts;
  if (!A) return;

  /* =============================================================
     ASCharts — content.js
     Header theming and the ASCharts wordmark.
     ============================================================= */

  const NAME_RE = /class\s*charts/gi;
  const originalTitle = document.title;
  const originalHeaderText = new Map();

  function header() {
    return document.querySelector('#desktop-app header.MuiAppBar-root') ||
      document.querySelector('#desktop-app header') ||
      document.querySelector('header.MuiAppBar-root');
  }

  function brandEnabled() {
    return A.getBool('brandReplace');
  }

  function applyHeaderTheme() {
    const appHeader = header();
    if (!appHeader) return;
    appHeader.style.setProperty('background-color', 'var(--as-header-bg, #0b1f4d)', 'important');
    appHeader.style.setProperty('background-image', 'none', 'important');
    appHeader.style.setProperty('color', 'var(--as-header-fg, #ffffff)', 'important');
    appHeader.style.setProperty('border-color', 'transparent', 'important');
    const toolbar = appHeader.querySelector('.MuiToolbar-root');
    if (toolbar) toolbar.style.setProperty('background', 'transparent', 'important');
  }

  function brandSlot() {
    const appHeader = header();
    if (!appHeader) return null;
    return appHeader.querySelector('.MuiToolbar-root > h6') ||
      appHeader.querySelector('.MuiToolbar-root > .MuiTypography-h6') ||
      appHeader.querySelector('.MuiToolbar-root > .MuiTypography-root');
  }

  function createBrand() {
    const brand = document.createElement('span');
    brand.className = 'ascharts-header-brand';
    brand.setAttribute('aria-label', 'ASCharts');

    const word = document.createElement('span');
    word.className = 'ascharts-brand-word';
    word.textContent = 'ASCharts';

    brand.append(word);
    return brand;
  }

  function ensureBrand() {
    const slot = brandSlot();
    if (!slot) return;
    const existing = slot.querySelector(':scope > .ascharts-header-brand');

    if (!brandEnabled()) {
      if (existing) existing.remove();
      slot.classList.remove('as-has-brand');
      return;
    }

    if (!existing) slot.appendChild(createBrand());
    slot.classList.add('as-has-brand');
  }

  function renameHeaderText() {
    const appHeader = header();
    if (!appHeader || !brandEnabled()) return;
    const walker = document.createTreeWalker(appHeader, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!/class\s*charts/i.test(node.nodeValue)) continue;
      if (!originalHeaderText.has(node)) originalHeaderText.set(node, node.nodeValue);
      const next = node.nodeValue.replace(NAME_RE, 'ASCharts');
      if (node.nodeValue !== next) node.nodeValue = next;
    }
  }

  function restoreHeaderText() {
    for (const [node, value] of originalHeaderText) {
      if (node.isConnected && node.nodeValue !== value) node.nodeValue = value;
    }
    originalHeaderText.clear();
  }

  function updateTitle() {
    if (brandEnabled()) {
      if (/class\s*charts/i.test(document.title)) {
        document.title = document.title.replace(NAME_RE, 'ASCharts');
      }
    } else if (document.title !== originalTitle) {
      document.title = originalTitle;
    }
  }

  function run() {
    applyHeaderTheme();
    ensureBrand();
    if (brandEnabled()) renameHeaderText();
    else restoreHeaderText();
    updateTitle();
  }

  run();
  window.addEventListener('load', run, { once: true });

  document.addEventListener('ascharts:setting-changed', (event) => {
    const key = event.detail && event.detail.key;
    if (key === 'brandReplace' || key === 'theme' || key === 'accent') run();
  });

  window.addEventListener('ascharts:settings-imported', run);
  window.addEventListener('ascharts:settings-reset', run);

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      run();
    }, 220);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
