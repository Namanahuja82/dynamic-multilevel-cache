const CacheLevel = require('./CacheLevel');
const AsyncLock = require('async-lock');

class MultiLevelCache {
  constructor() {
    this.levels = [];
    this.lock = new AsyncLock();
  }

  async addCacheLevel(size, evictionPolicy) {
    return this.lock.acquire('levels', async () => {
      this.levels.push(new CacheLevel(size, evictionPolicy));
    });
  }

  async get(key) {
    return this.lock.acquire('levels', async () => {
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
      return null;
    });
  }

  async put(key, value) {
    return this.lock.acquire('levels', async () => {
      if (this.levels.length > 0) {
        await this.levels[0].put(key, value);
      }
    });
  }

  async removeCacheLevel(level) {
    return this.lock.acquire('levels', async () => {
      if (level > 0 && level <= this.levels.length) {
        this.levels.splice(level - 1, 1);
      }
    });
  }

  async displayCache() {
    return this.lock.acquire('levels', async () => {
      for (let i = 0; i < this.levels.length; i++) {
        const entries = await this.levels[i].getEntries();
        console.log(`L${i + 1} Cache:`, Object.fromEntries(entries));
      }
    });
  }
}

module.exports = MultiLevelCache;