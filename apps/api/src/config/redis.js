const Redis = require('ioredis');

let redisClient = null;

/**
 * Initialize Redis client for caching
 */
function initRedis() {
  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL || process.env.REDISCLOUD_URL || 'redis://localhost:6379';
  
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) {
        console.error('Redis connection failed after 3 retries');
        return null;
      }
      return Math.min(times * 100, 3000);
    },
    enableReadyCheck: true,
  });

  redisClient.on('connect', () => {
    console.log('Redis client connected');
  });

  redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
  });

  return redisClient;
}

/**
 * Get Redis client instance
 */
function getRedisClient() {
  if (!redisClient) {
    return initRedis();
  }
  return redisClient;
}

/**
 * Set cache value with TTL
 */
async function setCache(key, value, ttl = 3600) {
  try {
    const client = getRedisClient();
    const serializedValue = JSON.stringify(value);
    await client.setex(key, ttl, serializedValue);
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
}

/**
 * Get cache value
 */
async function getCache(key) {
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Delete cache value
 */
async function deleteCache(key) {
  try {
    const client = getRedisClient();
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
}

/**
 * Clear all cache
 */
async function clearCache() {
  try {
    const client = getRedisClient();
    await client.flushall();
    return true;
  } catch (error) {
    console.error('Redis flush error:', error);
    return false;
  }
}

/**
 * Close Redis connection
 */
async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

module.exports = {
  initRedis,
  getRedisClient,
  setCache,
  getCache,
  deleteCache,
  clearCache,
  closeRedis,
};
