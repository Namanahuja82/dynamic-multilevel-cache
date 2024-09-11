const MultiLevelCache = require('./src/MultiLevelCache');

async function runExample() {
  const cache = new MultiLevelCache();

  await cache.addCacheLevel(3, 'LRU');
  await cache.addCacheLevel(2, 'LFU');

  await cache.put("A", "1");
  await cache.put("B", "2");
  await cache.put("C", "3");
  console.log("Get A:", await cache.get("A"));
  await cache.put("D", "4");
  console.log("Get C:", await cache.get("C"));

  console.log("\nInitial cache state:");
  await cache.displayCache();

  console.log("\nGet B:", await cache.get("B"));
  await cache.put("E", "5");
  console.log("\nAfter putting E:");
  await cache.displayCache();

  await cache.removeCacheLevel(2);
  console.log("\nAfter removing L2 cache:");
  await cache.displayCache();

  console.log("\nAttempting to get non-existent key:");
  console.log("Get F:", await cache.get("F"));

  await cache.addCacheLevel(2, 'LRU');
  console.log("\nAfter adding a new L2 cache:");
  await cache.displayCache();
}

runExample().catch(console.error);