const { getCache, setCache } = require('../config/redis');

/**
 * Cache middleware for GET requests
 * Caches responses based on request URL and query parameters
 */
function cacheMiddleware(ttl = 300) {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching for authenticated requests
    if (req.headers.authorization) {
      return next();
    }

    // Generate cache key from URL and query params
    const cacheKey = `cache:${req.originalUrl}`;

    try {
      // Try to get cached response
      const cachedData = await getCache(cacheKey);
      
      if (cachedData) {
        console.log(`Cache hit for ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`Cache miss for ${cacheKey}`);
      
      // Store original res.json to intercept response
      const originalJson = res.json.bind(res);
      
      res.json = function(data) {
        // Cache the response
        setCache(cacheKey, data, ttl).catch(err => {
          console.error('Cache set error:', err);
        });
        
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}

/**
 * Invalidate cache for specific pattern
 */
async function invalidateCachePattern(pattern) {
  try {
    const { getRedisClient } = require('../config/redis');
    const client = getRedisClient();
    
    const keys = await client.keys(`cache:${pattern}*`);
    
    if (keys.length > 0) {
      await client.del(keys);
      console.log(`Invalidated ${keys.length} cache entries matching ${pattern}`);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

/**
 * Cache invalidation middleware
 * Invalidates cache after POST, PUT, DELETE requests
 */
function invalidateCache(pattern) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      // Invalidate cache after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        invalidateCachePattern(pattern).catch(err => {
          console.error('Cache invalidation error:', err);
        });
      }
      
      return originalJson(data);
    };

    next();
  };
}

module.exports = {
  cacheMiddleware,
  invalidateCache,
  invalidateCachePattern,
  invalidateCacheMiddleware,
};
