const Memory = {
  load() {
    try {
      this.flags = JSON.parse(localStorage.getItem('emoquest-memory') || '[]');
      this.counts = JSON.parse(localStorage.getItem('emoquest-memory-counts') || '{}');
    } catch (err) {
      console.warn('Failed to read localStorage', err);
      this.flags = [];
      this.counts = {};
    }
  },
  save() {
    try {
      localStorage.setItem('emoquest-memory', JSON.stringify(this.flags));
      localStorage.setItem('emoquest-memory-counts', JSON.stringify(this.counts));
    } catch (err) {
      console.warn('Failed to write localStorage', err);
    }
  },
  remember(flag) {
    if (!flag) return;
    if (!this.flags.includes(flag)) {
      this.flags.push(flag);
    }
    this.counts[flag] = (this.counts[flag] || 0) + 1;
    this.save();
  },
  has(flag) {
    return this.flags.includes(flag);
  },
  list() {
    return this.flags.slice();
  },
  reflection() {
    const entries = Object.entries(this.counts || {}).filter(([,c]) => c >= 2);
    if (!entries.length) return null;
    entries.sort((a,b) => b[1] - a[1]);
    const [flag,count] = entries[0];
    if (this._lastFlag === flag && this._lastCount === count) return null;
    this._lastFlag = flag;
    this._lastCount = count;
    const label = flag.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase());
    return `\u{1FAA9} You’ve often chosen ${label}. What pattern do you notice?`;
  }
};

Memory.load();
