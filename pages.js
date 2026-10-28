(() => {
  'use strict';

  const A = window.ASCharts;
  if (!A) return;

  /* =============================================================
     ASCharts — pages.js
     Small, non-destructive page refinements.
     ============================================================= */

  function enhancePositivePoints() {
    for (const entry of document.querySelectorAll('.activity-entry')) {
      if (entry.dataset.asPointsReady === '1') continue;

      const badge = [...entry.querySelectorAll('div, span, p, b, strong')]
        .find((element) => element.children.length === 0 && /^[+-]\d+$/.test((element.textContent || '').trim()));

      if (!badge) continue;

      entry.dataset.asPointsReady = '1';
      entry.classList.add('as-has-points');
      const positive = (badge.textContent || '').trim().startsWith('+');
      entry.classList.toggle('as-points-positive', positive);
      entry.classList.toggle('as-points-negative', !positive);
      badge.classList.add('as-points-badge');
    }
  }

  const processedCodes = new WeakSet();

  function enhanceAnnouncements() {
    for (const card of document.querySelectorAll('.announcement-card')) {
      if (card.dataset.asAnnouncementReady === '1') continue;
      const paper = card.querySelector('.MuiPaper-root');
      if (!paper) continue;
      const header = paper.querySelector(':scope > .MuiGrid-container');
      if (!header) continue;

      // The school name is the bold 16px leaf line above the date/author meta.
      const school = [...header.querySelectorAll('div')].find((element) => {
        if (element.children.length || !(element.textContent || '').trim()) return false;
        const style = getComputedStyle(element);
        return parseFloat(style.fontSize) >= 16 && Number(style.fontWeight) >= 600;
      });

      if (school) {
        school.classList.add('as-announcement-school');
        const meta = school.parentElement && school.parentElement.querySelector(':scope > div:not(.as-announcement-school)');
        if (meta) meta.classList.add('as-announcement-meta');
        card.dataset.asAnnouncementReady = '1';
      }
    }
  }

  function fallbackCopy(value, onDone) {
    try {
      const area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
      document.body.appendChild(area);
      area.select();
      const copied = document.execCommand('copy');
      area.remove();
      if (copied) onDone();
      else A.toast({ key: 'code-copy', title: 'Copy failed', message: 'Select the code and copy it manually.', tone: 'error' });
    } catch (error) {
      A.toast({ key: 'code-copy', title: 'Copy failed', message: 'Select the code and copy it manually.', tone: 'error' });
    }
  }

  function copyCode(value) {
    const done = () => A.toast({
      key: 'code-copy',
      title: 'Code copied',
      message: value,
      tone: 'success',
      duration: 2,
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done).catch(() => fallbackCopy(value, done));
    } else {
      fallbackCopy(value, done);
    }
  }

  function enhancePopups() {
    const dialogs = document.querySelectorAll('.MuiDialog-paper, [role="dialog"], .modal-content');
    for (const dialog of dialogs) {
      if (!(dialog instanceof HTMLElement)) continue;
      if (!/code/i.test(dialog.innerText || '')) continue;

      const candidates = dialog.querySelectorAll('input, pre, code, p, h3, h4, h5, div, span, b, strong');
      for (const element of candidates) {
        if (element.children.length > 0) continue;
        if (processedCodes.has(element)) continue;

        const value = (element.textContent || '').trim();
        if (!/^[a-z0-9]{8,14}$/i.test(value)) continue;
        if (!/\d/.test(value) || !/[a-z]/i.test(value)) continue;

        processedCodes.add(element);
        element.classList.add('as-code-box');
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        element.title = 'Click to copy';

        const activate = (event) => {
          event.preventDefault();
          event.stopPropagation();
          copyCode(value);
        };
        element.addEventListener('click', activate);
        element.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') activate(event);
        });
        break;
      }
    }
  }

  function run() {
    enhancePositivePoints();
    enhanceAnnouncements();
    enhancePopups();
  }

  run();
  window.addEventListener('load', run, { once: true });

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      run();
    }, 220);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
