const CacheEntry = require('./CacheEntry');
const AsyncLock = require('async-lock');

class CacheLevel {
  constructor(size, evictionPolicy) {
    this.size = size;
    this.evictionPolicy = evictionPolicy;
    this.cache = new Map();
    this.lock = new AsyncLock();
  }

  async get(key) {
    return this.lock.acquire('cache', async () => {
      if (this.cache.has(key)) {
        const entry = this.cache.get(key);
        entry.access();
        return entry.value;
      }
      return null;
    });
  }

  async put(key, value) {
    return this.lock.acquire('cache', async () => {
      if (this.cache.size >= this.size) {
        await this.evict();
      }
      this.cache.set(key, new CacheEntry(key, value));
    });
  }

  async evict() {
    if (this.evictionPolicy === 'LRU') {
      let oldestKey = null;
      let oldestTime = Infinity;
      for (const [key, entry] of this.cache.entries()) {
        if (entry.lastAccessed < oldestTime) {
          oldestKey = key;
          oldestTime = entry.lastAccessed;
        }
      }
      if (oldestKey) this.cache.delete(oldestKey);
    } else if (this.evictionPolicy === 'LFU') {
      let leastFreqKey = null;
      let leastFreq = Infinity;
      for (const [key, entry] of this.cache.entries()) {
        if (entry.frequency < leastFreq) {
          leastFreqKey = key;
          leastFreq = entry.frequency;
        }
      }
      if (leastFreqKey) this.cache.delete(leastFreqKey);
    }
  }

  async has(key) {
    return this.lock.acquire('cache', async () => {
      return this.cache.has(key);
    });
  }

  async clear() {
    return this.lock.acquire('cache', async () => {
      this.cache.clear();
    });
  }

  async getEntries() {
    return this.lock.acquire('cache', async () => {
      return Array.from(this.cache.entries()).map(([key, entry]) => [key, entry.value]);
    });
  }
}

module.exports = CacheLevel;