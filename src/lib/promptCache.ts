import { Temporal } from "temporal-polyfill";

type CacheItem<T> = {
  value: T;
  expiry: number;
};

export class PromptCache<T> {
  private cache: Map<string, CacheItem<T>>;
  private maxSize: number;
  private defaultExpiry: number;

  constructor(maxSize: number = 5, defaultExpiry: number = 3600000) { // default expiry is 1 hour
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultExpiry = defaultExpiry;
  }

  set(key: string, value: T, expiry?: number): void {
    if (this.cache.size >= this.maxSize) {
      this.evict();
    }

    const expiryTime = Temporal.Now.instant().epochMilliseconds + (expiry || this.defaultExpiry);
    this.cache.set(key, { value, expiry: expiryTime });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) {
      return undefined;
    }

    if (Temporal.Now.instant().epochMilliseconds > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  private evict(): void {
    let oldestKey: string | undefined;
    let oldestExpiry = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.expiry < oldestExpiry) {
        oldestExpiry = item.expiry;
        oldestKey = key;
      }
    }

    if (oldestKey !== undefined) {
      this.cache.delete(oldestKey);
    }
  }
}