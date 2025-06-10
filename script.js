(async function() {
  const gameEl = document.getElementById('game');
  const progressEl = document.getElementById('progress');

  const storyNames = await fetch('stories/list.json').then(r => r.json());
  const STORIES = {};
  for (const name of storyNames) {
    STORIES[name] = await fetch(`stories/${name}.json`).then(r => r.json());
  }

  let currentStory = null;
  let currentNode = 'start';

  function titleCase(str) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function render(nodeId) {
    const story = STORIES[currentStory];
    const node = story[nodeId];
    if (!node) return;
    Tracker.increment(node.tags);
    currentNode = nodeId;
    localStorage.setItem(`emoquest_current_${currentStory}`, nodeId);

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

  function startStory(name) {
    currentStory = name;
    localStorage.setItem('emoquest_last_story', name);
    currentNode = localStorage.getItem(`emoquest_current_${name}`) || 'start';
    render(currentNode);
  }

  function showMenu() {
    const buttons = storyNames
      .map(n => `<button data-story="${n}">${titleCase(n)}</button>`)
      .join('');
    gameEl.innerHTML = `<div class="options">${buttons}</div>`;
    document.querySelectorAll('[data-story]').forEach(btn => {
      btn.addEventListener('click', () => startStory(btn.getAttribute('data-story')));
    });
    progressEl.textContent = Tracker.summary();
  }

  const params = new URLSearchParams(location.search);
  const chosen = params.get('story') || localStorage.getItem('emoquest_last_story');
  if (chosen && STORIES[chosen]) {
    startStory(chosen);
  } else {
    showMenu();
  }
})();
