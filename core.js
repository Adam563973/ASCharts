(() => {
  'use strict';

  if (window.ASCharts && window.ASCharts.__core) return;

  /* =============================================================
     ASCharts — core.js
     Shared settings store, theme engine, toast and confirm UI.
     ============================================================= */

  const VERSION = '1.5.0';
  const PREFIX = 'ascharts-';

  const KEYS = {
    theme: PREFIX + 'theme',
    accent: PREFIX + 'accent-color',
    radius: PREFIX + 'radius',
    density: PREFIX + 'density',
    fontSize: PREFIX + 'font-size',
    animation: PREFIX + 'anim-speed',
    reduceMotion: PREFIX + 'reduce-motion',
    bgStyle: PREFIX + 'bg-style',
    highContrast: PREFIX + 'high-contrast',
    compactSidebar: PREFIX + 'compact',
    sidebarWidth: PREFIX + 'sidebar-width',
    sidebarHidden: PREFIX + 'sidebar-hidden',
    pageTransitions: PREFIX + 'page-transitions',
    cardHover: PREFIX + 'card-hover',
    homeworkCard: PREFIX + 'homework-card-layout',
    readingMode: PREFIX + 'reading-mode',
    brandReplace: PREFIX + 'brand-replace',
    avatar: PREFIX + 'avatar',
    displayName: PREFIX + 'display-name',
    detentionCelebration: PREFIX + 'detention-celebration',
    confettiIntensity: PREFIX + 'confetti-intensity',
    confettiDuration: PREFIX + 'confetti-duration',
    confettiSound: PREFIX + 'confetti-sound',
    shortcuts: PREFIX + 'keyboard-shortcuts',
    scrollTop: PREFIX + 'scroll-top',
    scrollProgress: PREFIX + 'scroll-progress',
    toastDuration: PREFIX + 'toast-duration',
    settingsTab: PREFIX + 'settings-tab',
  };

  const DEFAULTS = {
    theme: 'light',
    accent: '#0b1f4d',
    radius: 'default',
    density: 'comfortable',
    fontSize: 'default',
    animation: 'normal',
    reduceMotion: '0',
    bgStyle: 'default',
    highContrast: '0',
    compactSidebar: '0',
    sidebarWidth: 'default',
    sidebarHidden: '0',
    pageTransitions: '1',
    cardHover: '1',
    homeworkCard: '1',
    readingMode: '0',
    brandReplace: '1',
    avatar: '',
    displayName: '',
    detentionCelebration: '0',
    confettiIntensity: 'medium',
    confettiDuration: '3',
    confettiSound: '0',
    shortcuts: '0',
    scrollTop: '0',
    scrollProgress: '1',
    toastDuration: '3',
    settingsTab: 'appearance',
  };

  const RADII = {
    sharp: { base: '6px', small: '4px', large: '8px' },
    default: { base: '14px', small: '9px', large: '18px' },
    round: { base: '20px', small: '12px', large: '26px' },
  };

  function read(key) {
    try { return localStorage.getItem(key); } catch (error) { return null; }
  }

  function write(key, value) {
    try {
      if (value === null || value === undefined) localStorage.removeItem(key);
      else localStorage.setItem(key, String(value));
    } catch (error) { /* Storage can be unavailable in private/embedded contexts. */ }
  }

  function keyOf(name) {
    return KEYS[name] || name;
  }

  function get(name) {
    const raw = read(keyOf(name));
    if (raw === null) {
      return Object.prototype.hasOwnProperty.call(DEFAULTS, name) ? DEFAULTS[name] : '';
    }
    return raw;
  }

  function getBool(name) {
    return get(name) === '1';
  }

  function migrate() {
    // Preserve the choice made in older builds where dark mode used its own key.
    if (read(KEYS.theme) === null && read(PREFIX + 'dark-mode') === '1') {
      write(KEYS.theme, 'dark');
    }
  }

  /* ─── Colour utilities ─────────────────────────────────── */

  function parseHex(input) {
    const value = String(input || '').trim();
    let match = value.match(/^#?([0-9a-f]{3})$/i);
    if (match) {
      const h = match[1];
      return [
        parseInt(h[0] + h[0], 16),
        parseInt(h[1] + h[1], 16),
        parseInt(h[2] + h[2], 16),
      ];
    }
    match = value.match(/^#?([0-9a-f]{6})$/i);
    if (match) {
      const h = match[1];
      return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16),
      ];
    }
    return [11, 31, 77];
  }

  function rgbHex(rgb) {
    return '#' + rgb
      .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0'))
      .join('');
  }

  function luminance(rgb) {
    const convert = (channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    };
    return (0.2126 * convert(rgb[0])) + (0.7152 * convert(rgb[1])) + (0.0722 * convert(rgb[2]));
  }

  function contrastText(rgb) {
    return luminance(rgb) > 0.5 ? '#0b1220' : '#ffffff';
  }

  function relativeContrast(a, b) {
    const la = luminance(a);
    const lb = luminance(b);
    const lighter = Math.max(la, lb);
    const darker = Math.min(la, lb);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function bestText(rgb) {
    const dark = [11, 18, 32];
    return relativeContrast(rgb, [255, 255, 255]) >= relativeContrast(rgb, dark) ? '#ffffff' : '#0b1220';
  }

  function rgbToHsl(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;
    if (delta !== 0) {
      if (max === r) h = ((g - b) / delta) % 6;
      else if (max === g) h = ((b - r) / delta) + 2;
      else h = ((r - g) / delta) + 4;
    }
    h = (h * 60 + 360) % 360;
    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs((2 * l) - 1));
    return [h, s, l];
  }

  function hslToRgb(h, s, l) {
    const c = (1 - Math.abs((2 * l) - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - (c / 2);
    let rgb;
    if (h < 60) rgb = [c, x, 0];
    else if (h < 120) rgb = [x, c, 0];
    else if (h < 180) rgb = [0, c, x];
    else if (h < 240) rgb = [0, x, c];
    else if (h < 300) rgb = [x, 0, c];
    else rgb = [c, 0, x];
    return rgb.map((channel) => Math.round((channel + m) * 255));
  }

  function liftAccent(rgb, lightness, minimumSaturation) {
    const hsl = rgbToHsl(rgb);
    const saturation = Math.min(0.72, Math.max(hsl[1], minimumSaturation));
    return hslToRgb(hsl[0], saturation, Math.max(hsl[2], lightness));
  }

  function mix(a, b, amount) {
    return a.map((value, index) => Math.round(value + ((b[index] - value) * amount)));
  }

  function shadeTo(rgb, target, direction) {
    let current = rgb.slice();
    for (let i = 0; i < 32; i += 1) {
      const value = luminance(current);
      if (direction === 'dark' ? value <= target : value >= target) break;
      current = direction === 'dark'
        ? current.map((channel) => Math.max(0, Math.round(channel * 0.9)))
        : mix(current, [255, 255, 255], 0.12);
    }
    return current;
  }

  function rgba(rgb, alpha) {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  }

  /* ─── Theme engine ─────────────────────────────────────── */

  function resolvedTheme() {
    const theme = get('theme');
    if (theme === 'system') {
      try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } catch (error) {
        return 'light';
      }
    }
    return theme === 'dark' ? 'dark' : 'light';
  }

  function applyAccent(theme) {
    const root = document.documentElement;
    if (!root) return;
    const rgb = parseHex(get('accent'));
    const dark = theme === 'dark';
    const accent = dark ? liftAccent(rgb, 0.62, 0.5) : rgb;
    const accentInk = dark ? liftAccent(rgb, 0.78, 0.38) : shadeTo(rgb, 0.16, 'dark');
    const navy = dark ? accentInk : shadeTo(rgb, 0.1, 'dark');
    const navy2 = dark ? mix(accent, [255, 255, 255], 0.12) : shadeTo(navy, 0.06, 'dark');
    const headerBg = dark ? mix(rgb, [8, 14, 28], 0.82) : navy;
    const onAccent = bestText(accent);

    root.style.setProperty('--as-accent', rgbHex(accent));
    root.style.setProperty('--as-accent-rgb', accent.join(', '));
    root.style.setProperty('--as-accent-ink', rgbHex(accentInk));
    root.style.setProperty('--as-accent-soft', rgba(accent, dark ? 0.18 : 0.11));
    root.style.setProperty('--as-navy', rgbHex(navy));
    root.style.setProperty('--as-navy-2', rgbHex(navy2));
    root.style.setProperty('--as-brand-fg', rgbHex(accentInk));
    root.style.setProperty('--as-on-accent', onAccent);
    root.style.setProperty('--as-header-bg', rgbHex(headerBg));
    root.style.setProperty('--as-header-fg', '#ffffff');
    root.style.setProperty('--as-header-soft', 'rgba(255, 255, 255, 0.14)');
    root.style.setProperty('--as-header-border', 'rgba(255, 255, 255, 0.2)');
    root.style.setProperty('--as-tint', rgba(accent, dark ? 0.18 : 0.11));
    root.style.setProperty('--as-tint-2', rgba(accent, dark ? 0.11 : 0.065));
  }

  let lastSidebarWidth = null;
  let lastSidebarHidden = null;

  function applySidebarWidth(widthName) {
    const widths = { narrow: '200px', default: '240px', wide: '300px' };
    const value = widths[widthName] || widths.default;
    const hidden = getBool('sidebarHidden');
    const drawer = document.querySelector('.desktop-drawer .MuiDrawer-paper');
    const drawerRoot = document.querySelector('.desktop-drawer');
    const container = drawerRoot && drawerRoot.parentElement;

    if (drawer) drawer.style.setProperty('width', value, 'important');
    if (container) {
      container.style.setProperty('width', hidden ? '0px' : value, 'important');
      container.style.setProperty('min-width', hidden ? '0px' : value, 'important');
    }

    if (lastSidebarWidth !== widthName || lastSidebarHidden !== hidden) {
      lastSidebarWidth = widthName;
      lastSidebarHidden = hidden;
      setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
    }
  }

  function applyAll() {
    const root = document.documentElement;
    if (!root) return;

    const theme = resolvedTheme();
    root.classList.toggle('as-dark', theme === 'dark');
    root.dataset.asTheme = theme;

    const radiusName = RADII[get('radius')] ? get('radius') : 'default';
    root.classList.remove('as-radius-sharp', 'as-radius-default', 'as-radius-round');
    root.classList.add('as-radius-' + radiusName);
    const radius = RADII[radiusName];
    root.style.setProperty('--as-radius', radius.base);
    root.style.setProperty('--as-radius-sm', radius.small);
    root.style.setProperty('--as-radius-lg', radius.large);

    root.classList.toggle('as-density-compact', get('density') === 'compact');

    root.classList.remove('as-font-small', 'as-font-large');
    if (get('fontSize') === 'small') root.classList.add('as-font-small');
    else if (get('fontSize') === 'large') root.classList.add('as-font-large');

    root.classList.remove('as-anim-off', 'as-anim-slow', 'as-anim-fast');
    const animation = get('animation');
    if (animation === 'off' || animation === 'slow' || animation === 'fast') {
      root.classList.add('as-anim-' + animation);
    }

    root.classList.toggle('as-reduce-motion', getBool('reduceMotion'));
    root.classList.toggle('as-high-contrast', getBool('highContrast'));
    root.classList.toggle('as-compact', getBool('compactSidebar'));
    root.classList.toggle('as-reading-mode', getBool('readingMode'));
    root.classList.toggle('as-homework-card-layout', getBool('homeworkCard'));
    root.classList.toggle('as-no-page-transitions', !getBool('pageTransitions'));
    root.classList.toggle('as-no-card-hover', !getBool('cardHover'));
    root.classList.toggle('as-brand-replace', getBool('brandReplace'));

    root.classList.remove('as-bg-soft', 'as-bg-flat');
    const background = get('bgStyle');
    if (background === 'soft' || background === 'flat') root.classList.add('as-bg-' + background);

    root.classList.remove('as-sidebar-narrow', 'as-sidebar-wide');
    const sidebarWidth = get('sidebarWidth');
    if (sidebarWidth === 'narrow') root.classList.add('as-sidebar-narrow');
    else if (sidebarWidth === 'wide') root.classList.add('as-sidebar-wide');

    root.classList.toggle('as-sidebar-hidden', getBool('sidebarHidden'));

    applyAccent(theme);
    applySidebarWidth(sidebarWidth);
  }

  /* ─── Settings writes ──────────────────────────────────── */

  function announce(name, value) {
    const detail = { key: name, storageKey: keyOf(name), value };
    document.dispatchEvent(new CustomEvent('ascharts:setting-changed', { detail }));
    if (name === 'displayName') window.dispatchEvent(new Event('ascharts:display-name-change'));
    if (name === 'detentionCelebration') window.dispatchEvent(new Event('ascharts:detention-celebration-setting-change'));
    if (name === 'brandReplace') window.dispatchEvent(new Event('ascharts:brand-change'));
  }

  function set(name, value) {
    write(keyOf(name), value === null || value === undefined ? null : String(value));
    applyAll();
    announce(name, value === null || value === undefined ? '' : String(value));
  }

  function setMany(entries, options) {
    const settings = entries && typeof entries === 'object' ? entries : {};
    Object.keys(settings).forEach((name) => {
      if (!Object.prototype.hasOwnProperty.call(KEYS, name)) return;
      const value = settings[name];
      if (value === null || value === undefined || typeof value === 'object') return;
      write(KEYS[name], String(value));
    });
    applyAll();
    if (!options || !options.silent) {
      window.dispatchEvent(new Event('ascharts:settings-imported'));
    }
  }

  function resetAll() {
    Object.keys(KEYS).forEach((name) => write(KEYS[name], null));
    write(PREFIX + 'dark-mode', null);
    applyAll();
    window.dispatchEvent(new Event('ascharts:settings-reset'));
  }

  function exportData() {
    const settings = {};
    Object.keys(KEYS).forEach((name) => {
      const value = read(KEYS[name]);
      if (value !== null) settings[name] = value;
    });
    return {
      app: 'ASCharts',
      version: VERSION,
      exportedAt: new Date().toISOString(),
      settings,
    };
  }

  function importData(payload) {
    const incoming = payload && typeof payload === 'object' && payload.settings && typeof payload.settings === 'object'
      ? payload.settings
      : payload;
    if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
      throw new Error('Invalid settings file.');
    }

    let count = 0;
    Object.keys(incoming).forEach((key) => {
      const value = incoming[key];
      if (value === null || value === undefined || typeof value === 'object') return;
      if (Object.prototype.hasOwnProperty.call(KEYS, key)) {
        write(KEYS[key], String(value));
        count += 1;
        return;
      }
      // Also accept older exports which stored the full localStorage key.
      const name = Object.keys(KEYS).find((candidate) => KEYS[candidate] === key);
      if (name) {
        write(KEYS[name], String(value));
        count += 1;
      }
    });

    if (!count) throw new Error('No ASCharts settings were found in that file.');
    applyAll();
    window.dispatchEvent(new Event('ascharts:settings-imported'));
    return count;
  }

  function storageUsage() {
    let bytes = 0;
    Object.keys(KEYS).forEach((name) => {
      const value = read(KEYS[name]);
      if (value) bytes += value.length;
    });
    return bytes;
  }

  /* ─── Scroll locking ───────────────────────────────────── */

  let scrollLocks = 0;

  function lockScroll() {
    scrollLocks += 1;
    document.documentElement.classList.add('as-scroll-locked');
  }

  function unlockScroll() {
    scrollLocks = Math.max(0, scrollLocks - 1);
    if (!scrollLocks) document.documentElement.classList.remove('as-scroll-locked');
  }

  /* ─── Toast ────────────────────────────────────────────── */

  const TOAST_ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
  };

  function getToastStack() {
    let stack = document.querySelector('.as-toast-stack');
    if (stack && document.body.contains(stack)) return stack;
    stack = document.createElement('div');
    stack.className = 'as-toast-stack';
    stack.setAttribute('aria-live', 'polite');
    stack.setAttribute('aria-atomic', 'false');
    document.body.appendChild(stack);
    return stack;
  }

  function toast(options) {
    if (!document.body) return null;
    const opts = typeof options === 'string' ? { title: options } : (options || {});
    const tone = ['success', 'error', 'warning', 'info'].includes(opts.tone) ? opts.tone : 'info';
    const key = opts.key || '';
    const seconds = Number(opts.duration || get('toastDuration') || 3);
    const duration = Math.max(1200, (Number.isFinite(seconds) ? seconds : 3) * 1000);

    if (key) {
      document.querySelectorAll('.as-toast').forEach((existing) => {
        if (existing.dataset.key === key) existing.remove();
      });
    }

    const stack = getToastStack();
    const element = document.createElement('div');
    element.className = 'as-toast as-toast-' + tone;
    if (key) element.dataset.key = key;
    element.setAttribute('role', tone === 'error' ? 'alert' : 'status');

    const icon = document.createElement('span');
    icon.className = 'as-toast-icon';
    icon.innerHTML = TOAST_ICONS[tone];

    const copy = document.createElement('div');
    copy.className = 'as-toast-copy';
    const title = document.createElement('div');
    title.className = 'as-toast-title';
    title.textContent = opts.title || (tone === 'success' ? 'Saved' : 'Notice');
    const message = document.createElement('div');
    message.className = 'as-toast-message';
    message.textContent = opts.message || '';
    copy.append(title);
    if (opts.message) copy.append(message);

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'as-toast-close';
    close.setAttribute('aria-label', 'Dismiss notification');
    close.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

    const progress = document.createElement('span');
    progress.className = 'as-toast-progress';
    progress.style.setProperty('--as-toast-duration', duration + 'ms');
    progress.style.animationDuration = duration + 'ms';

    element.append(icon, copy, close, progress);
    stack.appendChild(element);

    let remaining = duration;
    let startedAt = Date.now();
    let timer = null;
    let dismissed = false;

    const remove = () => {
      if (dismissed) return;
      dismissed = true;
      clearTimeout(timer);
      element.classList.remove('as-toast-in');
      element.classList.add('as-toast-out');
      setTimeout(() => {
        element.remove();
        if (stack && !stack.children.length) stack.remove();
      }, 200);
    };

    const schedule = () => {
      clearTimeout(timer);
      startedAt = Date.now();
      timer = setTimeout(remove, Math.max(300, remaining));
    };

    close.addEventListener('click', remove);
    element.addEventListener('mouseenter', () => {
      if (dismissed) return;
      clearTimeout(timer);
      remaining = Math.max(300, remaining - (Date.now() - startedAt));
      progress.style.animationPlayState = 'paused';
    });
    element.addEventListener('mouseleave', () => {
      if (dismissed) return;
      progress.style.animationPlayState = 'running';
      schedule();
    });

    requestAnimationFrame(() => element.classList.add('as-toast-in'));
    schedule();
    return element;
  }

  /* ─── Confirm dialog ───────────────────────────────────── */

  function confirm(options) {
    const opts = options || {};
    return new Promise((resolve) => {
      if (!document.body) { resolve(false); return; }

      const overlay = document.createElement('div');
      overlay.className = 'as-confirm-overlay';
      overlay.setAttribute('role', 'presentation');

      const card = document.createElement('section');
      card.className = 'as-confirm-card' + (opts.tone === 'danger' ? ' as-confirm-danger' : '');
      card.setAttribute('role', 'dialog');
      card.setAttribute('aria-modal', 'true');
      card.setAttribute('aria-labelledby', 'as-confirm-title');
      card.setAttribute('aria-describedby', 'as-confirm-message');

      const icon = document.createElement('div');
      icon.className = 'as-confirm-icon';
      icon.innerHTML = opts.tone === 'danger'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>';

      const title = document.createElement('h2');
      title.className = 'as-confirm-title';
      title.id = 'as-confirm-title';
      title.textContent = opts.title || 'Are you sure?';

      const message = document.createElement('p');
      message.className = 'as-confirm-message';
      message.id = 'as-confirm-message';
      message.textContent = opts.message || '';

      const actions = document.createElement('div');
      actions.className = 'as-confirm-actions';

      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'as-confirm-button as-confirm-cancel';
      cancel.textContent = opts.cancelLabel || 'Cancel';

      const accept = document.createElement('button');
      accept.type = 'button';
      accept.className = 'as-confirm-button as-confirm-accept';
      accept.textContent = opts.confirmLabel || 'Confirm';

      actions.append(cancel, accept);
      card.append(icon, title, message, actions);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      lockScroll();

      let finished = false;
      const finish = (result) => {
        if (finished) return;
        finished = true;
        document.removeEventListener('keydown', onKeyDown, true);
        overlay.classList.remove('as-confirm-open');
        unlockScroll();
        setTimeout(() => overlay.remove(), 180);
        resolve(result);
      };

      const onKeyDown = (event) => {
        if (event.key === 'Escape') { event.preventDefault(); finish(false); return; }
        if (event.key === 'Tab') {
          const focusable = [cancel, accept];
          const index = focusable.indexOf(document.activeElement);
          if (event.shiftKey && index <= 0) { event.preventDefault(); accept.focus(); }
          else if (!event.shiftKey && index === focusable.length - 1) { event.preventDefault(); cancel.focus(); }
        }
      };

      cancel.addEventListener('click', () => finish(false));
      accept.addEventListener('click', () => finish(true));
      overlay.addEventListener('mousedown', (event) => {
        if (event.target === overlay) finish(false);
      });
      document.addEventListener('keydown', onKeyDown, true);

      requestAnimationFrame(() => {
        overlay.classList.add('as-confirm-open');
        setTimeout(() => (opts.tone === 'danger' ? cancel : accept).focus(), 40);
      });
    });
  }

  /* ─── Boot ─────────────────────────────────────────────── */

  migrate();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll, { once: true });
  } else {
    applyAll();
  }

  window.addEventListener('load', () => {
    applyAll();
    setTimeout(applyAll, 450);
    setTimeout(applyAll, 1400);
  }, { once: true });

  try {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (get('theme') === 'system') applyAll(); };
    if (media.addEventListener) media.addEventListener('change', onChange);
    else if (media.addListener) media.addListener(onChange);
  } catch (error) { /* Older engines. */ }

  window.addEventListener('storage', (event) => {
    if (!event.key || !event.key.startsWith(PREFIX)) return;
    applyAll();
    const name = Object.keys(KEYS).find((candidate) => KEYS[candidate] === event.key);
    if (name) announce(name, event.newValue === null ? '' : event.newValue);
  });

  window.ASCharts = {
    __core: true,
    version: VERSION,
    PREFIX,
    KEYS,
    DEFAULTS,
    get,
    getBool,
    set,
    setMany,
    resetAll,
    exportData,
    importData,
    storageUsage,
    applyAll,
    applyAccent,
    applySidebarWidth,
    lockScroll,
    unlockScroll,
    toast,
    confirm,
    openSettings: (tab) => window.dispatchEvent(new CustomEvent('ascharts:open-settings', { detail: { tab } })),
    closeSettings: () => window.dispatchEvent(new CustomEvent('ascharts:close-settings')),
  };
})();
