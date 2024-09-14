const CacheEntry = require('./CacheEntry');
const AsyncLock = require('async-lock');

class CacheLevel {
  constructor(size, evictionPolicy) {
    this.size = size;
    this.evictionPolicy = evictionPolicy.toUpperCase(); // Ensure consistency in eviction policy case sensitivity
    this.cache = new Map();
    this.lock = new AsyncLock();
  }

  // Retrieves a value from the cache if it exists
  async get(key) {
    return this.lock.acquire('cache', async () => {
      if (this.cache.has(key)) {
        const entry = this.cache.get(key);
        entry.access(); // Update access details
        return entry.value;
      }
      return null; // Cache miss
    });
  }

  // Inserts a new entry in the cache and evicts items if the cache is full
  async put(key, value) {
    return this.lock.acquire('cache', async () => {
      if (this.cache.size >= this.size) {
        await this.evict();
      }
      this.cache.set(key, new CacheEntry(key, value));
    });
  }

  // Evicts an entry based on the eviction policy (LRU or LFU)
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

      if (oldestKey) this.cache.delete(oldestKey); // Remove least recently used
    } else if (this.evictionPolicy === 'LFU') {
      let leastFreqKey = null;
      let leastFreq = Infinity;

      for (const [key, entry] of this.cache.entries()) {
        if (entry.frequency < leastFreq) {
          leastFreqKey = key;
          leastFreq = entry.frequency;
        }
      }

      if (leastFreqKey) this.cache.delete(leastFreqKey); // Remove least frequently used
    }
  }

  // Checks if the key exists in the cache
  async has(key) {
    return this.lock.acquire('cache', async () => this.cache.has(key));
  }

  // Clears all entries from the cache
  async clear() {
    return this.lock.acquire('cache', async () => {
      this.cache.clear();
    });
  }

  // Returns the cache entries for display
  async getEntries() {
    return this.lock.acquire('cache', async () => {
      return Array.from(this.cache.entries()).map(([key, entry]) => [key, entry.value]);
    });
  }
}

module.exports = CacheLevel;
