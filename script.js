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
  const journalBtn = document.getElementById('view-journal');
  const journalModal = document.getElementById('journal-modal');
  const journalList = document.getElementById('journal-list');
  const journalEntry = document.getElementById('journal-entry');
  const saveJournal = document.getElementById('save-journal');
  const closeJournal = document.getElementById('close-journal');
  const identityModal = document.getElementById('identity-modal');
  const setIdentityBtn = document.getElementById('set-identity');

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.warn('Failed to read localStorage', err);
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn('Failed to write localStorage', err);
    }
  }

  if (logBtn) {
    logBtn.addEventListener('click', () => {
      logBody.innerHTML = Tracker.lines().join('<br>');
      Modal.open(logModal);
    });
  }
  if (closeLog) {
    closeLog.addEventListener('click', () => {
      Modal.close(logModal);
    });
  }

  if (memoryBtn) {
    memoryBtn.addEventListener('click', () => {
      const list = Memory.list().map(f => f.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
      memoryBody.innerHTML = list.length ? list.join('<br>') : '<p>No memories yet.</p>';
      Modal.open(memoryModal);
    });
  }
  if (closeMemory) {
    closeMemory.addEventListener('click', () => {
      Modal.close(memoryModal);
    });
  }

  function loadJournal() {
    try {
      return JSON.parse(localStorage.getItem('emoquest-journal') || '[]');
    } catch (err) {
      console.warn('Failed to read localStorage', err);
      return [];
    }
  }

  function saveJournalEntries(list) {
    try {
      localStorage.setItem('emoquest-journal', JSON.stringify(list));
    } catch (err) {
      console.warn('Failed to write localStorage', err);
    }
  }

  function openJournal() {
    const entries = loadJournal();
    journalList.innerHTML = entries.length ? entries.map(e => `<p>${e}</p>`).join('') : '<p>No entries yet.</p>';
    if (journalEntry) journalEntry.value = '';
    Modal.open(journalModal);
  }

  if (journalBtn) {
    journalBtn.addEventListener('click', openJournal);
  }
  if (saveJournal) {
    saveJournal.addEventListener('click', () => {
      const text = journalEntry.value.trim();
      if (!text) return;
      const list = loadJournal();
      list.push(text);
      saveJournalEntries(list);
      journalEntry.value = '';
      journalList.innerHTML = list.map(e => `<p>${e}</p>`).join('');
    });
  }
  if (closeJournal) {
    closeJournal.addEventListener('click', () => {
      Modal.close(journalModal);
    });
  }

  function showIdentityPrompt() {
    if (identityModal) Modal.open(identityModal);
  }

  if (setIdentityBtn) {
    setIdentityBtn.addEventListener('click', showIdentityPrompt);
  }

  if (identityModal) {
    identityModal.addEventListener('click', e => {
      const btn = e.target.closest('button[data-identity]');
      if (btn) {
        const id = btn.getAttribute('data-identity');
        safeSet('emoquest-identity', id);
        identity = id;
        Modal.close(identityModal);
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
  let identity = safeGet('emoquest-identity');

  async function loadStories() {
    try {
      const indexRes = await fetch('stories/index.json');
      if (!indexRes.ok) throw new Error('index.json request failed');
      const files = await indexRes.json();
      const newMap = {};
      const startMap = {};
      const prompts = [];

      const storyData = await Promise.all(
        files.map(async f => {
          const res = await fetch(`stories/${f}.json`);
          if (!res.ok) throw new Error(`${f}.json request failed`);
          return res.json();
        })
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
      return true;
    } catch (err) {
      console.error('Error loading stories', err);
      gameEl.innerHTML = '<p>Failed to load stories. Please try again later.</p>';
      return false;
    }
  }

  const loaded = await loadStories();
  if (!loaded) return;

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
    if (node.journeyDay && window.Journey && Journey.completeDay) {
      Journey.completeDay(node.journeyDay);
    }
    Tracker.increment(node.tags);
    currentNode = nodeId;
    safeSet('emoquest_current_node', nodeId);

    const optionData = (node.options || [])
      .filter(opt => {
        if (opt.condition && !Memory.has(opt.condition)) return false;
        if (opt.identity && identity && !opt.identity.includes(identity)) return false;
        if (opt.identity && !identity) return false;
        return true;
      });

    let text = node.text || '';
    if (node.identityVariants && identity && node.identityVariants[identity]) {
      text += ' ' + node.identityVariants[identity];
    }

    // Clear game area
    gameEl.innerHTML = '';

    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.textContent = text;
    gameEl.appendChild(textDiv);

    const mirror = Memory.reflection();
    if (mirror) {
      const mirrorDiv = document.createElement('div');
      mirrorDiv.className = 'reflect';
      mirrorDiv.textContent = mirror;
      gameEl.appendChild(mirrorDiv);
    }

    let insight = node.insight || '';
    if (node.insightVariants && identity && node.insightVariants[identity]) {
      insight += (insight ? ' ' : '') + node.insightVariants[identity];
    }
    if (insight) {
      const insightDiv = document.createElement('div');
      insightDiv.className = 'insight';
      insightDiv.textContent = insight;
      gameEl.appendChild(insightDiv);
    }

    let reflect = node.reflect || '';
    if (node.reflectVariants && identity && node.reflectVariants[identity]) {
      reflect += (reflect ? ' ' : '') + node.reflectVariants[identity];
    }

    let optsDiv = document.createElement('div');
    optsDiv.className = 'options';

    if (node.end) {
      if (node.closure) {
        const closeDiv = document.createElement('div');
        closeDiv.className = 'closure';
        closeDiv.textContent = node.closure;
        gameEl.appendChild(closeDiv);
      }
      if (node.symbol) {
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'symbol';
        symbolDiv.textContent = node.symbol;
        gameEl.appendChild(symbolDiv);
      }
      if (node.endInsight) {
        const endInDiv = document.createElement('div');
        endInDiv.className = 'insight';
        endInDiv.textContent = node.endInsight;
        gameEl.appendChild(endInDiv);
      }
      if (node.endReflect) {
        const endReDiv = document.createElement('div');
        endReDiv.className = 'reflect';
        endReDiv.textContent = node.endReflect;
        gameEl.appendChild(endReDiv);
      }
      if (node.journal) {
        const jBtn = document.createElement('button');
        jBtn.textContent = 'Journal';
        jBtn.addEventListener('click', openJournal);
        gameEl.appendChild(jBtn);
      }
      notifyNewTags(node.tags);
      return;
    }

    if (reflect) {
      const reflectDiv = document.createElement('div');
      reflectDiv.className = 'reflect';
      reflectDiv.textContent = reflect;
      gameEl.appendChild(reflectDiv);

      const contBtn = document.createElement('button');
      contBtn.id = 'continue';
      contBtn.textContent = 'Next';
      gameEl.appendChild(contBtn);

      optsDiv.style.display = 'none';
      gameEl.appendChild(optsDiv);
    } else {
      gameEl.appendChild(optsDiv);
    }

    optionData.forEach(opt => {
      const btn = document.createElement('button');
      btn.setAttribute('data-next', opt.next);
      if (opt.remember) btn.setAttribute('data-remember', opt.remember);
      btn.textContent = opt.text;
      optsDiv.appendChild(btn);
    });

    const continueBtn = document.getElementById('continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        continueBtn.remove();
        document.querySelectorAll('.reflect').forEach(el => el.remove());
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

    if (node.journal) {
      const jBtn = document.createElement('button');
      jBtn.textContent = 'Journal';
      jBtn.addEventListener('click', openJournal);
      gameEl.appendChild(jBtn);
    }

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

  if (reloadBtn && /localhost|127\.0\.0\.1/.test(location.hostname)) {
    reloadBtn.style.display = 'block';
    reloadBtn.addEventListener('click', async () => {
      const ok = await loadStories();
      if (!ok) return;
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
  currentNode = params.get('node') || safeGet('emoquest_current_node') || pickStart();
  render(currentNode);

  if (!identity) {
    showIdentityPrompt();
  }

  window.EmoQuest = {
    render,
    tagStarts
  };
})();
