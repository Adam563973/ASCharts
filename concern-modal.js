(() => {
  // Wrap the existing Class Charts submit action in a branded confirmation.
  // The real site action is replayed unchanged after the pupil confirms.
  let activeOverlay = null;
  let replayControl = null;

  function isConcernSubmit(control) {
    if (!control || !control.closest('.report-concern-page')) return false;
    if (control.matches('.save-button, button[type="submit"], input[type="submit"]')) return true;
    const label = String(control.innerText || control.value || control.getAttribute('aria-label') || '')
      .replace(/\s+/g, ' ').trim().toLowerCase();
    return /^(submit|send|report concern|submit concern)$/.test(label);
  }

  function headerFont() {
    const header = document.querySelector('#desktop-app header .MuiToolbar-root') ||
      document.querySelector('#desktop-app header');
    try {
      if (header) return getComputedStyle(header).fontFamily;
    } catch (e) {}
    return '"Open Sans", Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
  }

  function syncHeaderFont() {
    document.documentElement.style.setProperty('--as-header-font', headerFont());
  }

  function closeModal(restoreFocus = true) {
    const overlay = activeOverlay;
    if (!overlay) return;
    activeOverlay = null;
    overlay.classList.remove('as-info-modal-open');
    if (overlay._asEscHandler) document.removeEventListener('keydown', overlay._asEscHandler, true);
    const opener = overlay._asOpener;
    setTimeout(() => overlay.remove(), 190);
    if (restoreFocus && opener && document.contains(opener) && typeof opener.focus === 'function') {
      setTimeout(() => opener.focus(), 200);
    }
  }

  function showConfirmation(control) {
    if (activeOverlay) return;
    const overlay = document.createElement('div');
    overlay.className = 'as-info-modal-overlay as-concern-confirm-overlay';
    overlay.setAttribute('data-as-modal', 'concern-confirmation');
    overlay.style.setProperty('--as-header-font', headerFont());
    overlay._asOpener = control;
    overlay.addEventListener('click', event => {
      if (event.target === overlay) closeModal(true);
    });

    const card = document.createElement('section');
    card.className = 'as-info-modal-card as-concern-confirm-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-labelledby', 'as-concern-confirm-title');
    card.innerHTML = `
      <div class="as-info-modal-header">
        <div class="as-info-modal-title" id="as-concern-confirm-title">Are you sure you want to report a concern?</div>
        <button class="as-info-modal-close" type="button" aria-label="Close dialog" title="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="as-info-modal-body">
        <p>This will be handled by your school and SLT.</p>
      </div>
      <div class="as-info-modal-footer">
        <button class="as-info-modal-button as-info-modal-button-secondary" type="button" data-as-cancel>Go back</button>
        <button class="as-info-modal-button as-info-modal-button-primary" type="button" data-as-confirm>Yes, report concern</button>
      </div>`;
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    activeOverlay = overlay;

    const cancel = () => closeModal(true);
    card.querySelector('.as-info-modal-close').addEventListener('click', cancel);
    card.querySelector('[data-as-cancel]').addEventListener('click', cancel);
    card.querySelector('[data-as-confirm]').addEventListener('click', () => {
      closeModal(false);
      if (!control || !document.contains(control) || control.disabled) return;
      replayControl = control;
      // Let the website's own React/native click handler run on the replay.
      control.click();
      setTimeout(() => { if (replayControl === control) replayControl = null; }, 1200);
    });

    const escHandler = event => {
      if (event.key === 'Escape' && activeOverlay === overlay) closeModal(true);
    };
    overlay._asEscHandler = escHandler;
    document.addEventListener('keydown', escHandler, true);
    requestAnimationFrame(() => overlay.classList.add('as-info-modal-open'));
    setTimeout(() => card.querySelector('[data-as-cancel]')?.focus(), 40);
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const control = target && target.closest('button, input[type="submit"], input[type="button"], [role="button"], .save-button');
    if (!control || !isConcernSubmit(control)) return;

    // The confirmation button replays the exact original control once.
    if (replayControl === control) {
      replayControl = null;
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    showConfirmation(control);
  }, true);

  // If the live concern page exposes inbox/draft navigation, hide only exact
  // navigation labels on that page; do not remove any report form fields.
  function removeConcernInboxDraftNavigation() {
    const page = document.querySelector('.report-concern-page');
    if (!page) return;
    for (const item of page.querySelectorAll('button, a, [role="tab"], [role="button"]')) {
      const label = String(item.innerText || item.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (/^(inbox|drafts?)(?:\s+\d+)?$/.test(label)) {
        item.style.setProperty('display', 'none', 'important');
        item.setAttribute('aria-hidden', 'true');
      }
    }
  }

  syncHeaderFont();
  removeConcernInboxDraftNavigation();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      syncHeaderFont();
      removeConcernInboxDraftNavigation();
    }, 100);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
