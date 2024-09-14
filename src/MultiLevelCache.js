const CacheLevel = require('./CacheLevel');
const AsyncLock = require('async-lock');

class MultiLevelCache {
  constructor() {
    this.levels = [];
    this.lock = new AsyncLock();
  }

  // Adds a new cache level with the specified size and eviction policy
  async addCacheLevel(size, evictionPolicy) {
    return this.lock.acquire('levels', async () => {
      if (evictionPolicy !== 'LRU' && evictionPolicy !== 'LFU') {
        throw new Error(`Invalid eviction policy: ${evictionPolicy}. Use 'LRU' or 'LFU'.`);
      }
      this.levels.push(new CacheLevel(size, evictionPolicy));
    });
  }

  // Retrieves data from the highest cache level first, promoting it to higher levels if found in a lower level
  async get(key) {
    return this.lock.acquire('levels', async () => {
      if (this.levels.length === 0) {
        console.error("No cache levels are defined.");
        return null; // No cache levels exist
      }

      for (let i = 0; i < this.levels.length; i++) {
        const value = await this.levels[i].get(key);
        if (value !== null) {
          // Move the data up to higher cache levels
          for (let j = i - 1; j >= 0; j--) {
            await this.levels[j].put(key, value);
          }
          return value;
        }
      }

      return null; // Cache miss
    });
  }

  // Inserts data into the L1 cache, evicting if necessary
  async put(key, value) {
    return this.lock.acquire('levels', async () => {
      if (this.levels.length === 0) {
        console.error("No cache levels are defined. Unable to put data.");
        return;
      }
      await this.levels[0].put(key, value);
    });
  }

  // Removes a cache level by index (L1 is 1, L2 is 2, etc.)
  async removeCacheLevel(level) {
    return this.lock.acquire('levels', async () => {
      if (level <= 0 || level > this.levels.length) {
        console.error(`Invalid cache level: ${level}.`);
        return;
      }
      this.levels.splice(level - 1, 1);
    });
  }

  // Displays the current state of all cache levels
  async displayCache() {
    return this.lock.acquire('levels', async () => {
      if (this.levels.length === 0) {
        console.log("No cache levels are defined.");
        return;
      }

      for (let i = 0; i < this.levels.length; i++) {
        const entries = await this.levels[i].getEntries();
        console.log(`L${i + 1} Cache:`, Object.fromEntries(entries));
      }
    });
  }
}

module.exports = MultiLevelCache;
