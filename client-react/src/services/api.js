/**
 * API 호출을 위한 유틸리티 함수
 */

// API 기본 URL
const API_BASE_URL = '/api';

/**
 * 기본 fetch 래퍼 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise<any>} 응답 데이터
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('/api') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 추천 API 관련 함수
 */
export const recommendationAPI = {
  /**
   * 테스트 추천 목록 가져오기
   * @param {number} n - 가져올 아이템 수
   * @returns {Promise<any>} 추천 목록
   */
  getTestRecommendations: (n = 10) => {
    return fetchAPI(`/recommendation/test?n=${n}`);
  },
  
  /**
   * 인기 콘텐츠 가져오기
   * @param {number} limit - 가져올 아이템 수
   * @returns {Promise<any>} 인기 콘텐츠 목록
   */
  getPopular: (limit = 10) => {
    return fetchAPI(`/api/recommendation/popular?limit=${limit}`);
  },
  
  /**
   * 최신 콘텐츠 가져오기
   * @param {number} limit - 가져올 아이템 수
   * @returns {Promise<any>} 최신 콘텐츠 목록
   */
  getRecent: (limit = 10) => {
    return fetchAPI(`/api/recommendation/recent?limit=${limit}`);
  },
  
  /**
   * 장르별 콘텐츠 가져오기
   * @param {string} genre - 장르 이름
   * @param {number} limit - 가져올 아이템 수
   * @returns {Promise<any>} 장르별 콘텐츠 목록
   */
  getByGenre: (genre, limit = 10) => {
    return fetchAPI(`/api/recommendation/genre?genre=${genre}&limit=${limit}`);
  },
  
  /**
   * 히어로 섹션 데이터 가져오기
   * @returns {Promise<any>} 히어로 섹션 데이터
   */
  getHero: () => {
    return fetchAPI('/api/recommendation/hero');
  }
};

/**
 * 검색 API 관련 함수
 */
export const searchAPI = {
  /**
   * 콘텐츠 검색
   * @param {string} query - 검색어
   * @param {number} limit - 검색 결과 수
   * @returns {Promise<any>} 검색 결과
   */
  search: (query, limit = 20) => {
    return fetchAPI(`/api/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  }
};

export default {
  fetchAPI,
  recommendationAPI,
  searchAPI
};
