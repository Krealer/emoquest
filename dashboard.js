// Dashboard handling for EmoQuest
(function() {
  const dashBtn = document.getElementById('view-journey');
  const dash = document.getElementById('dashboard');
  const closeBtn = document.getElementById('close-dashboard');
  const tagHistory = document.getElementById('tag-history');
  const unexplored = document.getElementById('unexplored');
  const summary = document.getElementById('journey-summary');

  if (!dashBtn) return;

  function progressBar(count) {
    const filled = Math.min(count, 5);
    const empty = 5 - filled;
    return '●'.repeat(filled) + '○'.repeat(empty);
  }

  function update() {
    Tracker.load();
    const counts = Tracker.data || {};
    const tags = Object.keys(Tracker.EMOJI);
    const lines = tags.map(t => ({
      tag: t,
      count: counts[t] || 0,
      label: Tracker.label(t)
    }));

    // history
    const explored = lines.filter(l => l.count > 0)
      .sort((a,b) => b.count - a.count);
    tagHistory.innerHTML = explored.length ?
      explored.map(l => {
        const title = INSIGHTS[l.tag] ? ` title="${INSIGHTS[l.tag]}"` : '';
        return `<div class="tag-line" data-tag="${l.tag}"${title}>${l.label} — ${l.count} ${progressBar(l.count)}</div>`;
      }).join('') :
      '<p>No themes explored yet.</p>';

    // unexplored suggestions
    const missing = lines.filter(l => l.count === 0);
    unexplored.innerHTML = missing.length ?
      missing.map(l => {
        const title = INSIGHTS[l.tag] ? ` title="${INSIGHTS[l.tag]}"` : '';
        return `<div${title}>${Tracker.EMOJI[l.tag] || ''} You haven’t explored ${l.tag} yet.</div>`;
      }).join('') :
      '<div>You’ve touched every listed emotion.</div>';

    // reflection summary
    if (explored.length === 0) {
      summary.textContent = 'Your journey is just beginning.';
    } else {
      const maxTag = explored[0];
      const lowTag = missing[0] || explored[explored.length - 1];
      if (explored.length > 1 && maxTag.count - explored[explored.length - 1].count <= 1) {
        summary.textContent = 'Your explorations are fairly balanced so far.';
      } else {
        summary.textContent = `You seem to gravitate toward ${maxTag.label}. Is there space to explore ${Tracker.label(lowTag.tag)}?`;
      }
    }
  }

  dashBtn.addEventListener('click', () => {
    update();
    Modal.open(dash);
  });

  closeBtn.addEventListener('click', () => {
    Modal.close(dash);
  });

  // tag click jump to story
  dash.addEventListener('click', e => {
    const el = e.target.closest('.tag-line');
    if (el && window.EmoQuest && window.EmoQuest.tagStarts) {
      const tag = el.getAttribute('data-tag');
      const start = window.EmoQuest.tagStarts[tag];
      if (start) {
        const id = Array.isArray(start)
          ? start[Math.floor(Math.random() * start.length)]
          : start;
        Modal.close(dash);
        window.EmoQuest.render(id);
      }
    }
  });
})();
