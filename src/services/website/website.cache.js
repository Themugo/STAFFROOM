const CACHE = new Map()
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

export const websiteCache = {
  get(key) {
    const entry = CACHE.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      CACHE.delete(key)
      return null
    }
    return entry.value
  },

  set(key, value, ttl = DEFAULT_TTL) {
    CACHE.set(key, { value, expiresAt: Date.now() + ttl })
  },

  invalidate(key) {
    CACHE.delete(key)
  },

  invalidateAll() {
    CACHE.clear()
  },

  async getOrSet(key, fetcher, ttl = DEFAULT_TTL) {
    const cached = this.get(key)
    if (cached) return cached
    const value = await fetcher()
    this.set(key, value, ttl)
    return value
  },
}
