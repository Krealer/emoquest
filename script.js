(async function() {
  const gameEl = document.getElementById('game');
  const progressEl = document.getElementById('progress');
  const logBtn = document.getElementById('view-log');
  const reloadBtn = document.getElementById('reload-stories');
  const promptBtn = document.getElementById('start-prompt');
  const logModal = document.getElementById('log-modal');
  const logBody = document.getElementById('log-body');
  const closeLog = document.getElementById('close-log');
  const memoryBtn = document.getElementById('view-memory');
  const memoryModal = document.getElementById('memory-modal');
  const memoryBody = document.getElementById('memory-body');
  const closeMemory = document.getElementById('close-memory');
  const identityModal = document.getElementById('identity-modal');
  const setIdentityBtn = document.getElementById('set-identity');

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

  if (memoryBtn) {
    memoryBtn.addEventListener('click', () => {
      const list = Memory.list().map(f => f.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
      memoryBody.innerHTML = list.length ? list.join('<br>') : '<p>No memories yet.</p>';
      memoryModal.style.display = 'flex';
    });
  }
  if (closeMemory) {
    closeMemory.addEventListener('click', () => {
      memoryModal.style.display = 'none';
    });
  }

  function showIdentityPrompt() {
    if (identityModal) identityModal.style.display = 'flex';
  }

  if (setIdentityBtn) {
    setIdentityBtn.addEventListener('click', showIdentityPrompt);
  }

  if (identityModal) {
    identityModal.addEventListener('click', e => {
      const btn = e.target.closest('button[data-identity]');
      if (btn) {
        const id = btn.getAttribute('data-identity');
        localStorage.setItem('emoquest-identity', id);
        identity = id;
        identityModal.style.display = 'none';
        render(currentNode);
      }
    });
  }

  if (promptBtn) {
    promptBtn.addEventListener('click', () => {
      if (!todaysPrompt) return;
      const node = storyMap[todaysPrompt];
      const firstTag = (node.tags || [])[0];
      progressEl.textContent = `\u{1F31E} Today’s Emotional Prompt: ${Tracker.label(firstTag)}`;
      render(todaysPrompt);
    });
  }

  let storyMap = {};
  let tagStarts = {};
  let promptList = [];
  let todaysPrompt = null;
  let identity = localStorage.getItem('emoquest-identity');

  async function loadStories() {
    const files = await fetch('stories/index.json').then(r => r.json());
    const newMap = {};
    const startMap = {};
    const prompts = [];

    const storyData = await Promise.all(
      files.map(f => fetch(`stories/${f}.json`).then(r => r.json()))
    );

    for (const data of storyData) {
      Object.entries(data).forEach(([id, node]) => {
        if (node.start && Array.isArray(node.tags)) {
          node.tags.forEach(tag => {
            if (!startMap[tag]) startMap[tag] = id;
          });
        }
        if (node.promptOfDay) {
          prompts.push(id);
        }
      });
      Object.assign(newMap, data);
    }
    storyMap = newMap;
    tagStarts = startMap;
    promptList = prompts;
  }

  await loadStories();

  if (promptList.length) {
    const day = new Date().getDate();
    todaysPrompt = promptList[day % promptList.length];
  }

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
    if (node.condition && !Memory.has(node.condition)) return;
    if (node.identity && identity && !node.identity.includes(identity)) return;
    if (node.identity && !identity) return;
    Memory.remember(node.remember);
    Tracker.increment(node.tags);
    currentNode = nodeId;
    localStorage.setItem('emoquest_current_node', nodeId);

    const optionsHtml = (node.options || [])
      .filter(opt => {
        if (opt.condition && !Memory.has(opt.condition)) return false;
        if (opt.identity && identity && !opt.identity.includes(identity)) return false;
        if (opt.identity && !identity) return false;
        return true;
      })
      .map(opt => {
        const mem = opt.remember ? ` data-remember="${opt.remember}"` : '';
        return `<button data-next="${opt.next}"${mem}>${opt.text}</button>`;
      })
      .join('');

    let text = node.text || '';
    if (node.identityVariants && identity && node.identityVariants[identity]) {
      text += ' ' + node.identityVariants[identity];
    }
    let html = `<div class="text">${text}</div>`;
    const mirror = Memory.reflection();
    if (mirror) html += `<div class="reflect">${mirror}</div>`;
    let insight = node.insight || '';
    if (node.insightVariants && identity && node.insightVariants[identity]) {
      insight += (insight ? ' ' : '') + node.insightVariants[identity];
    }
    if (insight) html += `<div class="insight">${insight}</div>`;

    let reflect = node.reflect || '';
    if (node.reflectVariants && identity && node.reflectVariants[identity]) {
      reflect += (reflect ? ' ' : '') + node.reflectVariants[identity];
    }
    if (reflect) {
      html += `<div class="reflect">${reflect}</div>`;
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
        const mem = btn.getAttribute('data-remember');
        if (mem) Memory.remember(mem);
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
      if (promptList.length) {
        const day = new Date().getDate();
        todaysPrompt = promptList[day % promptList.length];
      } else {
        todaysPrompt = null;
      }
      render(currentNode);
    });
  }

  const params = new URLSearchParams(location.search);
  currentNode = params.get('node') || localStorage.getItem('emoquest_current_node') || pickStart();
  render(currentNode);

  if (!identity) {
    showIdentityPrompt();
  }

  window.EmoQuest = {
    render,
    tagStarts
  };
})();
