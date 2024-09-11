class CacheEntry {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.frequency = 1;
    this.lastAccessed = Date.now();
  }

  access() {
    this.frequency++;
    this.lastAccessed = Date.now();
  }
}

module.exports = CacheEntry;