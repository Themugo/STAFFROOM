/**
 * Database Query Optimization Utilities
 * Provides helper functions for optimizing database queries
 */

/**
 * Select only required fields from Prisma queries
 * Reduces data transfer and improves performance
 */
function selectFields(fields) {
  return fields.reduce((acc, field) => {
    acc[field] = true;
    return acc;
  }, {});
}

/**
 * Common field selectors for frequently queried models
 */
const fieldSelectors = {
  employee: {
    basic: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'status'],
    profile: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'phone', 'departmentId', 'positionId'],
    full: ['id', 'employeeId', 'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'address', 'departmentId', 'positionId', 'status'],
  },
  department: {
    basic: ['id', 'name', 'status'],
    full: ['id', 'name', 'description', 'headId', 'status'],
  },
  leave: {
    basic: ['id', 'employeeId', 'type', 'startDate', 'endDate', 'status'],
    full: ['id', 'employeeId', 'type', 'startDate', 'endDate', 'reason', 'status', 'createdAt'],
  },
  attendance: {
    basic: ['id', 'employeeId', 'date', 'checkIn', 'checkOut', 'status'],
    full: ['id', 'employeeId', 'date', 'checkIn', 'checkOut', 'status', 'location'],
  },
};

/**
 * Pagination helper for large datasets
 */
function paginate(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return {
    skip,
    take: limit,
  };
}

/**
 * Build where clause with optional filters
 */
function buildWhereClause(filters = {}) {
  const where = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      where[key] = value;
    }
  }
  
  return where;
}

/**
 * Build search clause for text search
 */
function buildSearchClause(searchFields, searchTerm) {
  if (!searchTerm) {
    return {};
  }
  
  const where = {
    OR: searchFields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    })),
  };
  
  return where;
}

/**
 * Build date range filter
 */
function buildDateRangeFilter(field, startDate, endDate) {
  const where = {};
  
  if (startDate) {
    where[field] = {
      ...where[field],
      gte: new Date(startDate),
    };
  }
  
  if (endDate) {
    where[field] = {
      ...where[field],
      lte: new Date(endDate),
    };
  }
  
  return where;
}

/**
 * Optimize query with caching strategy
 */
async function cachedQuery(cacheKey, queryFn, ttl = 300) {
  const { getCache, setCache } = require('../config/redis');
  
  try {
    // Try to get from cache
    const cached = await getCache(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Execute query
    const result = await queryFn();
    
    // Cache result
    await setCache(cacheKey, result, ttl);
    
    return result;
  } catch (error) {
    console.error('Cached query error:', error);
    // Fallback to direct query
    return queryFn();
  }
}

/**
 * Batch query helper for multiple related queries
 */
async function batchQueries(queries) {
  const results = await Promise.allSettled(queries);
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return { success: true, data: result.value };
    } else {
      return { success: false, error: result.reason };
    }
  });
}

/**
 * Optimize count queries with caching
 */
async function optimizedCount(model, where = {}, cacheKey = null, ttl = 60) {
  if (cacheKey) {
    return cachedQuery(cacheKey, () => model.count({ where }), ttl);
  }
  
  return model.count({ where });
}

/**
 * Cursor-based pagination for large datasets
 */
function cursorPagination(cursor, limit = 10) {
  const options = {
    take: limit + 1, // Fetch one extra to check if there's a next page
  };
  
  if (cursor) {
    options.cursor = { id: cursor };
    options.skip = 1;
  }
  
  return options;
}

/**
 * Extract pagination metadata
 */
function extractPaginationMetadata(results, limit) {
  const hasMore = results.length > limit;
  const items = hasMore ? results.slice(0, -1) : results;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  
  return {
    items,
    hasMore,
    nextCursor,
  };
}

module.exports = {
  selectFields,
  fieldSelectors,
  paginate,
  buildWhereClause,
  buildSearchClause,
  buildDateRangeFilter,
  cachedQuery,
  batchQueries,
  optimizedCount,
  cursorPagination,
  extractPaginationMetadata,
};
