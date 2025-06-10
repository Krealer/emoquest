const Tracker = {
  EMOJI: {
    empathy: '💛',
    anxiety: '🌧',
    forgiveness: '🌱',
    boundaries: '🚧',
    resentment: '😠',
    guilt: '🔥',
    grief: '🖤',
    acceptance: '🌸',
    'social anxiety': '💦',
    exhaustion: '😴',
    support: '🤝',
    relief: '😌',
    assertion: '📢',
    communication: '💬',
    'self-compassion': '💗'
  },
  load() {
    try {
      const raw = localStorage.getItem('emoquest_tags');
      this.data = JSON.parse(raw || '{}');
    } catch (err) {
      console.warn('Failed to read localStorage', err);
      this.data = {};
    }
  },
  save() {
    try {
      localStorage.setItem('emoquest_tags', JSON.stringify(this.data));
    } catch (err) {
      console.warn('Failed to write localStorage', err);
    }
  },
  increment(tags = []) {
    tags.forEach(tag => {
      this.data[tag] = (this.data[tag] || 0) + 1;
    });
    this.save();
  },
  label(tag) {
    const emoji = this.EMOJI[tag] || '';
    const name = tag.replace(/\b\w/g, c => c.toUpperCase());
    return `${emoji} ${name}`.trim();
  },
  lines() {
    return Object.entries(this.data)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => `${this.label(tag)}: ${count}`);
  },
  summary() {
    const lines = this.lines();
    return lines.join('  ');
  }
};

Tracker.load();
