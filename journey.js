// 7-Day Journey handler
(function() {
  const startBtn = document.getElementById('start-journey');
  const modal = document.getElementById('journey-modal');
  const listEl = document.getElementById('journey-days');
  const closeBtn = document.getElementById('close-journey');

  if (!startBtn) return;

  function daysSince(start) {
    if (!start) return 0;
    const diff = Date.now() - new Date(start).getTime();
    return Math.floor(diff / 86400000);
  }

  function loadProgress() {
    return {
      start: localStorage.getItem('journey-start'),
      done: parseInt(localStorage.getItem('journey-day') || '0', 10)
    };
  }

  function saveDay(n) {
    const cur = parseInt(localStorage.getItem('journey-day') || '0', 10);
    if (n > cur) {
      localStorage.setItem('journey-day', String(n));
    }
  }

  function openModal() {
    const data = loadProgress();
    const avail = Math.min(daysSince(data.start) + 1, 7);
    listEl.innerHTML = '';
    for (let i = 1; i <= avail; i++) {
      const b = document.createElement('button');
      b.textContent = 'Day ' + i;
      b.setAttribute('data-day', i);
      listEl.appendChild(b);
    }
    Modal.open(modal);
  }

  startBtn.addEventListener('click', () => {
    let data = loadProgress();
    if (!data.start) {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('journey-start', today);
      data.start = today;
    }
    openModal();
  });

  closeBtn.addEventListener('click', () => {
    Modal.close(modal);
  });

  modal.addEventListener('click', e => {
    const btn = e.target.closest('button[data-day]');
    if (btn) {
      const d = btn.getAttribute('data-day');
      Modal.close(modal);
      if (window.EmoQuest) window.EmoQuest.render('journey-' + d);
    }
  });

  window.Journey = { completeDay: saveDay };
})();
