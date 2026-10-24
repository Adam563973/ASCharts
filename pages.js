(() => {
  /* =============================================================
     ASCharts — pages.js
     Page-level layout adjustments, positive points & popup styling
     ============================================================= */

  function fixPositivePoints() {
    const entries = document.querySelectorAll('.activity-entry');
    entries.forEach(entry => {
      entry.style.setProperty('position', 'relative', 'important');
      entry.style.setProperty('padding-left', '64px', 'important');
      entry.style.setProperty('padding-top', '16px', 'important');
      entry.style.setProperty('padding-bottom', '16px', 'important');

      // Find the points badge (+1, +2, etc.)
      const candidates = entry.querySelectorAll('div, span, p');
      for (const el of candidates) {
        const text = el.textContent.trim();
        if (/^[+-]\d+$/.test(text) && el.children.length === 0) {
          el.style.setProperty('position', 'absolute', 'important');
          el.style.setProperty('top', '16px', 'important');
          el.style.setProperty('left', '18px', 'important');
          el.style.setProperty('margin', '0', 'important');
          el.style.setProperty('transform', 'none', 'important');
          el.style.setProperty('width', '32px', 'important');
          el.style.setProperty('height', '32px', 'important');
          el.style.setProperty('min-width', '32px', 'important');
          el.style.setProperty('border-radius', '50%', 'important');
          el.style.setProperty('display', 'inline-flex', 'important');
          el.style.setProperty('align-items', 'center', 'important');
          el.style.setProperty('justify-content', 'center', 'important');
          el.style.setProperty('font-size', '13px', 'important');
          el.style.setProperty('font-weight', '700', 'important');
          el.style.setProperty('line-height', '1', 'important');

          if (el.parentElement && el.parentElement !== entry) {
            el.parentElement.style.setProperty('position', 'static', 'important');
            el.parentElement.style.setProperty('margin', '0', 'important');
          }
          break;
        }
      }
    });
  }

  function adjustBehaviourLayout() {
    const page = document.querySelector('.behaviour-page');
    if (!page) return;

    // Ensure behaviour cards maintain proportional grid structure
    const gridItems = page.querySelectorAll('.MuiGrid-item');
    gridItems.forEach(item => {
      item.style.maxWidth = '100%';
    });
  }

  function enhancePopups() {
    const dialogs = document.querySelectorAll('.MuiDialog-paper, [role="dialog"], .modal-content, .MuiPopover-paper');
    dialogs.forEach(dialog => {
      // Find code text inside dialog (e.g., student code like 5ma6b4dbxc)
      const textNodes = dialog.querySelectorAll('input, pre, code, p, h3, h4, h5, div, span');
      for (const el of textNodes) {
        if (el.children.length > 0) continue;
        const text = el.textContent.trim();
        // Match code formats (e.g. 8-12 alphanumeric characters like 5ma6b4dbxc)
        if (/^[a-z0-9]{8,12}$/i.test(text) && !el.classList.contains('as-code-box')) {
          el.classList.add('as-code-box');
          el.title = 'Click to copy';
          el.style.cursor = 'pointer';
          el.addEventListener('click', () => {
            navigator.clipboard.writeText(text).then(() => {
              const orig = el.textContent;
              el.textContent = 'Copied!';
              setTimeout(() => { el.textContent = orig; }, 1200);
            }).catch(() => {});
          });
          break;
        }
      }
    });
  }

  function run() {
    adjustBehaviourLayout();
    fixPositivePoints();
    enhancePopups();
  }

  run();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; run(); }, 100);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
