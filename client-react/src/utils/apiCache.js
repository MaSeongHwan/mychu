/**
 * Cache utility for API requests
 * Used to avoid repeated API calls for the same data
 */

// Cache storage for API responses
const apiCache = new Map();

/**
 * Create a cache key based on URL and parameters
 * @param {string} url - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} - Cache key
 */
export const createCacheKey = (url, params = {}) => {
  const paramsString = Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
    
  return `${url}${paramsString ? '?' + paramsString : ''}`;
};

/**
 * Fetch with cache support
 * @param {string} cacheKey - Cache key for storing/retrieving response
 * @param {Function} fetchFn - Async function that returns data to cache
 * @param {number} maxAge - Maximum cache age in milliseconds (default: 5 minutes)
 * @returns {Promise<any>} - Response data
 */
export const cachedFetch = async (cacheKey, fetchFn, maxAge = 5 * 60 * 1000) => {
  const now = Date.now();
  
  // Check if we have a valid cached response
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    
    // Return cached data if it's not expired
    if (now - cachedData.timestamp < maxAge) {
      return cachedData.data;
    } else {
      // Cached data is expired, remove it
      apiCache.delete(cacheKey);
    }
  }
  
  // Fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  apiCache.set(cacheKey, {
    timestamp: now,
    data
  });
  
  return data;
};

/**
 * Clear all cached data or specific cache entry
 * @param {string} cacheKey - Optional cache key to clear specific entry
 */
export const clearCache = (cacheKey = null) => {
  if (cacheKey) {
    apiCache.delete(cacheKey);
  } else {
    apiCache.clear();
  }
};

/**
 * Get cache size (number of cached responses)
 * @returns {number} - Cache size
 */
export const getCacheSize = () => {
  return apiCache.size;
};

/**
 * Get cache stats for debugging
 * @returns {Object} - Cache statistics
 */
export const getCacheStats = () => {
  const stats = {
    size: apiCache.size,
    keys: [],
    totalSizeBytes: 0
  };
  
  apiCache.forEach((value, key) => {
    const entrySize = JSON.stringify(value).length;
    stats.keys.push({
      key,
      age: Date.now() - value.timestamp,
      size: entrySize
    });
    stats.totalSizeBytes += entrySize;
  });
  
  return stats;
};
