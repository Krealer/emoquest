(async function() {
  const gameEl = document.getElementById('game');
  const story = await fetch('stories/example.json').then(r => r.json());
  let current = localStorage.getItem('emoquest_current_node') || 'start';

  function render(nodeId) {
    const node = story[nodeId];
    if (!node) return;
    gameEl.innerHTML = `
      <div class="text">${node.text}</div>
      <div class="options">
        ${node.options.map(opt => `<button data-next="${opt.next}">${opt.text}</button>`).join('')}
      </div>
    `;
    document.querySelectorAll('#game button').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-next');
        if (next) {
          localStorage.setItem('emoquest_current_node', next);
          render(next);
        }
      });
    });
  }

  render(current);
})();
