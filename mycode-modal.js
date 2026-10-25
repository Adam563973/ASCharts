(() => {
  /*
   * ASCharts — My Code dialog polish.
   * Marks the original Class Charts date-of-birth dialog and its separately
   * portaled Material-UI date picker. No values, inputs, or site handlers are
   * replaced; this script only adds styling hooks.
   */
  const DIALOG_SELECTOR = '.MuiDialog-paper, [role="dialog"], [aria-modal="true"], .modal-content';
  const DOB_TERMS = /date\s+of\s+birth|\bdob\b/i;
  const PICKER_PART_SELECTOR = [
    '.MuiPickersYear-root', '[class*="MuiPickersYear"]',
    '.MuiPickersToolbar-toolbar', '[class*="MuiPickersToolbar"]',
    '.MuiPickersBasePicker-container', '.MuiPickersModal-dialogRoot',
    '.MuiPickersPopper-root', '.MuiPickersPopper-paper',
    '.MuiPickersLayout-root', '.MuiYearCalendar-root', '.MuiDateCalendar-root',
    '.MuiPickersCalendarHeader-root', '.MuiPickersDay-daySelected',
    '.MuiPickersDay-root.Mui-selected'
  ].join(',');
  const PICKER_HOST_SELECTOR = [
    '.MuiPickersModal-dialogRoot', '.MuiPickersPopper-root',
    '.MuiPickersPopper-paper', '.MuiPopover-paper', '.MuiDialog-paper',
    '.MuiPickersBasePicker-container', '.MuiPickersLayout-root'
  ].join(',');

  function isVisible(element) {
    if (!(element instanceof HTMLElement)) return false;
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  function findMyCodeDialogs() {
    const matches = [];
    document.querySelectorAll(DIALOG_SELECTOR).forEach((dialog) => {
      if (!(dialog instanceof HTMLElement) || !isVisible(dialog)) return;
      const text = (dialog.innerText || dialog.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text || !DOB_TERMS.test(text)) return;

      dialog.classList.add('as-mycode-dialog');
      dialog.setAttribute('data-ascharts-dialog', 'my-code');
      matches.push(dialog);

      // Decorate the existing fields only; keep React/MUI handlers untouched.
      dialog.querySelectorAll('input, select, [role="combobox"]').forEach((control) => {
        if (!(control instanceof HTMLElement)) return;
        const type = control instanceof HTMLInputElement ? control.type : '';
        const isRelevant = ['date', 'text', 'number', 'tel'].includes(type)
          || control instanceof HTMLSelectElement
          || control.getAttribute('role') === 'combobox'
          || control.classList.contains('MuiInputBase-input')
          || control.classList.contains('MuiSelect-select');
        if (isRelevant) {
          control.classList.add('as-mycode-field');
          // Give the existing DOB field a clear, consistent name without changing
          // the site's controlled value, picker behaviour, or event handlers.
          if (DOB_TERMS.test(dialog.innerText || '') && control instanceof HTMLInputElement) {
            if (!control.getAttribute('aria-label')) control.setAttribute('aria-label', 'Date of birth');
            if (!control.getAttribute('placeholder') && control.type !== 'date') control.setAttribute('placeholder', 'Date of birth');
          }
        }
      });
    });
    return matches;
  }

  function markPortaledPicker(myCodeDialogs) {
    const active = myCodeDialogs.length > 0;
    document.documentElement.classList.toggle('as-mycode-active', active);

    if (!active) {
      document.querySelectorAll('.as-mycode-picker, .as-mycode-picker-part').forEach((element) => {
        element.classList.remove('as-mycode-picker', 'as-mycode-picker-part');
      });
      return;
    }

    const mainDialogSet = new Set(myCodeDialogs);
    document.querySelectorAll(PICKER_PART_SELECTOR).forEach((part) => {
      if (!(part instanceof HTMLElement) || !isVisible(part)) return;
      const host = part.closest(PICKER_HOST_SELECTOR);

      // The picker is normally portaled beside the original dialog. Mark its
      // own paper, not the main DOB dialog, so their sizing remains independent.
      if (host && !mainDialogSet.has(host) && host.getAttribute('data-ascharts-dialog') !== 'my-code') {
        host.classList.add('as-mycode-picker');
      } else {
        // Fallback for versions which render the picker inside the DOB dialog.
        part.classList.add('as-mycode-picker-part');
      }
    });
  }

  function decorate() {
    const dialogs = findMyCodeDialogs();
    markPortaledPicker(dialogs);
  }

  let queued = false;
  function scheduleDecorate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      decorate();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleDecorate, { once: true });
  } else {
    scheduleDecorate();
  }

  new MutationObserver(scheduleDecorate).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['role', 'aria-modal', 'class']
  });
})();
