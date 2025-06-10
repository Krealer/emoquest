const Tracker = {
  load() {
    this.data = JSON.parse(localStorage.getItem('emoquest_tags') || '{}');
  },
  save() {
    localStorage.setItem('emoquest_tags', JSON.stringify(this.data));
  },
  increment(tags = []) {
    tags.forEach(tag => {
      this.data[tag] = (this.data[tag] || 0) + 1;
    });
    this.save();
  },
  summary() {
    const entries = Object.entries(this.data);
    if (!entries.length) return '';
    const parts = entries.map(([tag, count]) => `${tag} ${count}`);
    return `You've explored ${parts.join(', ')}.`;
  }
};

Tracker.load();
