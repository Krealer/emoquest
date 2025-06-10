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

    let html = `<div class="text">${node.text}</div>`;
    if (node.insight) html += `<div class="insight">${node.insight}</div>`;

    if (node.reflect) {
      html += `<div class="reflect">${node.reflect}</div>`;
      html += `<button id="continue">Next</button>`;
      html += `<div class="options" style="display:none">${optionsHtml}</div>`;
    } else {
      html += `<div class="options">${optionsHtml}</div>`;
    }

    gameEl.innerHTML = html;

    const continueBtn = document.getElementById('continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        continueBtn.remove();
        const reflectEl = document.querySelector('.reflect');
        if (reflectEl) reflectEl.remove();
        const optDiv = document.querySelector('#game .options');
        if (optDiv) optDiv.style.display = 'block';
      });
    }

    document.querySelectorAll('#game .options button').forEach(btn => {
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
