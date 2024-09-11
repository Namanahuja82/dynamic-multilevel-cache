Dynamic Multilevel Caching System

The project explains the implementation of a parallel dynamic multi-tier caching system using Node.js. It efficiently manages data across multilevel caches, allows runtime dynamic addition of cache levels, employs different eviction policies, and has thread safety for parallel operations.

Features

Multi-level of Caches (L1, L2, ., Ln)
Runtime dynamic addition and removal of cache levels
Different eviction policies have been supported-LRU, LFU
Data fetch and insertion across the multi-level cache efficiently
Parallel operation-thread-safe

API


MultiLevelCache

All methods are asynchronous and return Promises.

addCacheLevel(size: number, evictionPolicy: string): Promise<void>
Adds a new cache level with the specified size and eviction policy (LRU or LFU).
get(key: string): Promise<string | null>
Retrieves the data corresponding to the key. If not found, returns null.
put(key: string, value: string): Promise<void>
Inserts the key-value pair into the L1 cache.
removeCacheLevel(level: number): Promise<void>
Removes a cache level by specifying its index (L1, L2, ..., Ln).
displayCache(): Promise<void>
Prints the current state of each cache level, showing the keys and values.


Decisions
Modular Structure: The top three classes in the system are CacheEntry, CacheLevel, and MultiLevelCache. This supports good readability and maintainability.
Map Data Structure: Internal utilization of the predefined JavaScript Map for storing cache entries efficiently deals with key-value pairs for storage and lookups.
Eviction Policies: The system supports both Least Recently Used and Least Frequently Used as eviction policies. We have implemented the eviction policies in the CacheLevel class.
Data Promotion: Whenever data is located on a lower cache level, it always gets promoted to higher levels due to the reduction in time taken by subsequent accesses to that particular data. Dynamic Level Management: In this cache, addition and removal of cache levels at runtime can be done with ease. Concurrency: Async-Lock will make all cache operations thread-safe, meaning any number of threads can have parallel access to the cache safely.

