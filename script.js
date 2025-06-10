(async function() {
  const gameEl = document.getElementById('game');
  const progressEl = document.getElementById('progress');

  function getStoryName() {
    const params = new URLSearchParams(location.search);
    return params.get('story') || 'empathy';
  }

  const storyName = getStoryName();
  const story = await fetch(`stories/${storyName}.json`).then(r => r.json());
  let current = localStorage.getItem(`emoquest_current_${storyName}`) || 'start';

  function render(nodeId) {
    const node = story[nodeId];
    if (!node) return;
    Tracker.increment(node.tags);
    current = nodeId;
    localStorage.setItem(`emoquest_current_${storyName}`, nodeId);

    const optionsHtml = (node.options || [])
      .map(opt => `<button data-next="${opt.next}">${opt.text}</button>`)
      .join('');

    gameEl.innerHTML = `
      <div class="text">${node.text}</div>
      ${node.insight ? `<div class="insight">${node.insight}</div>` : ''}
      ${node.reflect ? `<div class="reflect">${node.reflect}</div>` : ''}
      <div class="options">${optionsHtml}</div>
    `;

    document.querySelectorAll('#game button').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-next');
        if (next) render(next);
      });
    });

    progressEl.textContent = Tracker.summary();
  }

  render(current);
})();
