(async function() {
  const gameEl = document.getElementById('game');
  const progressEl = document.getElementById('progress');
  const logBtn = document.getElementById('view-log');
  const reloadBtn = document.getElementById('reload-stories');
  const logModal = document.getElementById('log-modal');
  const logBody = document.getElementById('log-body');
  const closeLog = document.getElementById('close-log');

  if (logBtn) {
    logBtn.addEventListener('click', () => {
      logBody.innerHTML = Tracker.lines().join('<br>');
      logModal.style.display = 'flex';
    });
  }
  if (closeLog) {
    closeLog.addEventListener('click', () => {
      logModal.style.display = 'none';
    });
  }

  let storyMap = {};
  let tagStarts = {};

  async function loadStories() {
    const files = await fetch('stories/index.json').then(r => r.json());
    const newMap = {};
    const startMap = {};
    for (const f of files) {
      const data = await fetch(`stories/${f}.json`).then(r => r.json());
      Object.entries(data).forEach(([id, node]) => {
        if (node.start && Array.isArray(node.tags)) {
          node.tags.forEach(tag => {
            if (!startMap[tag]) startMap[tag] = id;
          });
        }
      });
      Object.assign(newMap, data);
    }
    storyMap = newMap;
    tagStarts = startMap;
  }

  await loadStories();

  let currentNode = 'start';

  function notifyNewTags(tags = []) {
    if (!tags.length) {
      progressEl.textContent = Tracker.summary();
      return;
    }
    const list = tags.map(t => Tracker.label(t)).join(', ');
    progressEl.textContent = `You just gained insight into: ${list}`;
    setTimeout(() => {
      progressEl.textContent = Tracker.summary();
    }, 2000);
  }

  function render(nodeId) {
    const node = storyMap[nodeId];
    if (!node) return;
    Tracker.increment(node.tags);
    currentNode = nodeId;
    localStorage.setItem('emoquest_current_node', nodeId);

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

    notifyNewTags(node.tags);
  }

  function pickStart() {
    if (storyMap['start']) return 'start';
    const starters = Object.keys(storyMap).filter(id => storyMap[id].start);
    if (starters.length) {
      const i = Math.floor(Math.random() * starters.length);
      return starters[i];
    }
    return Object.keys(storyMap)[0];
  }

  if (reloadBtn) {
    reloadBtn.style.display = 'block';
    reloadBtn.addEventListener('click', async () => {
      await loadStories();
      render(currentNode);
    });
  }

  const params = new URLSearchParams(location.search);
  currentNode = params.get('node') || localStorage.getItem('emoquest_current_node') || pickStart();
  render(currentNode);

  window.EmoQuest = {
    render,
    tagStarts
  };
})();
