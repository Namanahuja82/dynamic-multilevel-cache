class CacheEntry {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.frequency = 1;
    this.lastAccessed = Date.now(); // Stores the timestamp of last access
  }

  // Updates the access frequency and time when the entry is accessed
  access() {
    this.frequency++;
    this.lastAccessed = Date.now();
  }
}

module.exports = CacheEntry;
