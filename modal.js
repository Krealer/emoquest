const Modal = {
  open(modal) {
    if (!modal) return;
    modal._returnFocus = document.activeElement;
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
    const elems = Array.from(focusable);
    const first = elems[0];
    const last = elems[elems.length - 1];
    if (first) first.focus();
    function handleKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        Modal.close(modal);
      } else if (e.key === 'Tab') {
        if (elems.length === 0) return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    modal._modalHandler = handleKey;
    modal.addEventListener('keydown', handleKey);
  },
  close(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    if (modal._modalHandler) {
      modal.removeEventListener('keydown', modal._modalHandler);
      modal._modalHandler = null;
    }
    const opener = modal._returnFocus;
    if (opener && typeof opener.focus === 'function') {
      opener.focus();
    }
    modal._returnFocus = null;
  }
};

window.Modal = Modal;
