/**
 * 간단한 API 캐싱 메커니즘
 * 캐시 만료 시간과 함께 API 응답을 저장하여 중복 호출 방지
 */

// 캐시 저장소
const cache = new Map();

// 기본 캐시 유효 시간 (밀리초)
const DEFAULT_CACHE_TIME = 60000; // 1분

/**
 * API 응답을 캐싱하는 함수
 * @param {string} key - 캐시 키 (보통 API URL)
 * @param {Promise} apiCall - API 호출 Promise
 * @param {number} cacheTime - 캐시 유효 시간 (밀리초)
 * @returns {Promise} - API 응답 (캐시 또는 새로운 호출)
 */
export async function cachedFetch(key, apiCall, cacheTime = DEFAULT_CACHE_TIME) {
  const now = Date.now();
  const cached = cache.get(key);
  
  // 캐시가 있고 유효한 경우
  if (cached && cached.expiry > now) {
    console.log(`[캐시 사용] ${key}`);
    return cached.data;
  }
  
  // 캐시가 없거나 만료된 경우 새로 호출
  console.log(`[API 호출] ${key}`);
  try {
    const result = await apiCall();
    
    // 결과 캐싱
    cache.set(key, {
      data: result,
      expiry: now + cacheTime
    });
    
    return result;
  } catch (error) {
    console.error(`API 호출 실패 (${key}):`, error);
    throw error;
  }
}

/**
 * 캐시 키 생성 함수
 * 동일한 URL과 파라미터에 대해 동일한 캐시 키 생성
 * @param {string} baseUrl - 기본 URL
 * @param {Object} params - URL 파라미터
 * @returns {string} - 생성된 캐시 키
 */
export function createCacheKey(baseUrl, params) {
  // 파라미터를 알파벳순으로 정렬하여 일관된 키 생성
  const sortedParams = Object.keys(params || {})
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${baseUrl}?${sortedParams}`;
}

/**
 * 모든 캐시 항목 삭제
 */
export function clearCache() {
  cache.clear();
  console.log('API 캐시가 모두 삭제되었습니다.');
}

/**
 * 특정 캐시 항목 삭제
 * @param {string} keyPattern - 삭제할 캐시 키 패턴 (포함된 문자열)
 */
export function clearCacheByPattern(keyPattern) {
  let count = 0;
  cache.forEach((value, key) => {
    if (key.includes(keyPattern)) {
      cache.delete(key);
      count++;
    }
  });
  
  if (count > 0) {
    console.log(`${keyPattern} 관련 캐시 ${count}개 항목이 삭제되었습니다.`);
  }
}
