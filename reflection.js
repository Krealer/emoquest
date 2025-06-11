const Reflection = {
  PROMPTS: {
    empathy: ["Recall a moment you offered kindness recently."],
    anxiety: ["What worries surfaced in this story?"],
    guilt: ["Is there something you wish to forgive?"],
    boundaries: ["Where might you draw a gentle line?"],
    resentment: ["What feeling hides beneath any anger?"],
    identity: ["Which part of yourself spoke the loudest today?"],
    default: ["What feeling stands out to you right now?"]
  },
  pickPrompt(tags = [], id = '') {
    for (const t of tags) {
      if (this.PROMPTS[t]) {
        const arr = this.PROMPTS[t];
        return arr[Math.floor(Math.random() * arr.length)];
      }
    }
    if (id && this.PROMPTS[id]) {
      const arr = this.PROMPTS[id];
      return arr[Math.floor(Math.random() * arr.length)];
    }
    const arr = this.PROMPTS.default;
    return arr[Math.floor(Math.random() * arr.length)];
  },
  init() {
    this.modal = document.getElementById('reflection-modal');
    this.entry = document.getElementById('reflection-entry');
    this.promptEl = document.getElementById('reflection-prompt');
    this.closeBtn = document.getElementById('close-reflection');
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => Modal.close(this.modal));
    }
  },
  open(tags = [], id = '') {
    if (!this.modal) this.init();
    if (!this.modal) return;
    const prompt = this.pickPrompt(tags, id);
    if (this.promptEl) this.promptEl.textContent = prompt;
    if (this.entry) this.entry.value = '';
    Modal.open(this.modal);
  }
};

window.Reflection = Reflection;
