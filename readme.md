Dynamic Multilevel Caching System

This project implements a parallel dynamic multi-tier caching system using Node.js. It efficiently manages data across multiple cache levels, allows runtime dynamic addition/removal of cache levels, supports different eviction policies, and ensures thread safety for parallel operations.
Features

    Multi-level Caches (L1, L2, ..., Ln): Supports hierarchical caching, allowing for multiple levels of cache.
    Dynamic Cache Management: Add or remove cache levels at runtime without downtime.
    Eviction Policies: Supports both LRU (Least Recently Used) and LFU (Least Frequently Used) eviction policies.
    Efficient Data Management: Data fetching and insertion are handled efficiently across multiple cache levels.
    Thread Safety: Ensures safe parallel operations using asynchronous locks.

API

All methods are asynchronous and return Promises.
addCacheLevel(size: number, evictionPolicy: string): Promise<void>

Adds a new cache level with the specified size and eviction policy (either LRU or LFU).
get(key: string): Promise<string | null>

Retrieves the data associated with the given key. If the key is not found, returns null.
put(key: string, value: string): Promise<void>

Inserts the key-value pair into the L1 cache.
removeCacheLevel(level: number): Promise<void>

Removes a cache level by specifying its index (e.g., L1, L2, ..., Ln).
displayCache(): Promise<void>

Displays the current state of all cache levels, showing the keys and their corresponding values.
Design Decisions
Modular Structure

The system is divided into three main classes:

    CacheEntry: Represents individual cache entries.
    CacheLevel: Manages cache operations for a single level.
    MultiLevelCache: Orchestrates cache operations across multiple levels.

This structure enhances readability and maintainability.
Map Data Structure

We use the JavaScript Map to efficiently store and manage key-value pairs. It allows for fast lookups, insertions, and deletions.
Eviction Policies

We implement two eviction policies:

    LRU (Least Recently Used): Removes the least recently accessed items.
    LFU (Least Frequently Used): Removes the least frequently accessed items.

These policies are implemented within the CacheLevel class.
Data Promotion

When data is found at a lower cache level, it is automatically promoted to higher levels, ensuring faster access times for subsequent requests.
Dynamic Level Management

The system allows the addition and removal of cache levels at runtime, offering great flexibility and adaptability.
Concurrency

By using async locks (async-lock), all cache operations are thread-safe, meaning that multiple threads can interact with the cache concurrently without issues.

To run this 
Install the dependcies : npm i 
To run : npm start
