/**
 * 추천 서비스 (통합 API 사용)
 * HTML 프로젝트와 기존 React 프로젝트의 추천 로직을 통합
 */

import { recommendationAPI } from './api.js';
import { createCacheKey, cachedFetch } from '../utils/apiCache.js';
import { API_CONFIG } from '../utils/apiConfig.js';

/**
 * 응답 아이템을 일관된 형식으로 정규화
 * @param {Array} items - API에서 받은 원본 아이템들
 * @returns {Array} - 정규화된 아이템들
 */
const normalizeItems = (items = []) => {
  return items.map(item => {
    // 다양한 필드에서 ID 추출
    const contentId = item.idx || item.asset_idx || item.id || null;
    
    return {
      idx: contentId,
      id: contentId,
      asset_idx: contentId,
      asset_nm: item.asset_nm || item.super_asset_nm || '제목 없음',
      genre: item.genre || '',
      poster_path: item.poster_path || `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.asset_nm || 'Content')}`,
      release_year: item.release_year || item.rlse_year || null,
      is_movie: item.is_movie || false,
      is_adult: item.is_adult || false
    };
  });
};

/**
 * 히어로 슬라이더 데이터 가져오기
 * @param {Object} options - 가져오기 옵션
 * @returns {Promise<Array>} - 히어로 아이템들
 */
export const getHeroContent = async (options = { isMovie: true, limit: 5 }) => {
  const cacheKey = createCacheKey('hero-content', {
    limit: options.limit || 5,
    isMovie: options.isMovie === false ? false : true
  });
  
  try {
    const data = await cachedFetch(cacheKey, async () => {
      const results = await recommendationAPI.fetchRecommendations('test', options.limit || 5, {
        is_movie: options.isMovie === false ? false : true,
        is_main: true
      });
      return results;
    }, API_CONFIG.cacheTimeout);
    
    return normalizeItems(data);
  } catch (error) {
    console.error('히어로 콘텐츠 가져오기 실패:', error);
    return [];
  }
};

/**
 * 인기 콘텐츠 가져오기
 * @param {Object} options - 가져오기 옵션
 * @returns {Promise<Array>} - 인기 아이템들
 */
export const getPopularContent = async (options = { isMovie: null, isAdult: false, limit: 10 }) => {
  const cacheKey = createCacheKey('popular-content', {
    limit: options.limit || 10,
    isMovie: options.isMovie,
    isAdult: options.isAdult
  });
  
  try {
    const data = await cachedFetch(cacheKey, async () => {
      const results = await recommendationAPI.fetchRecommendations('top', options.limit || 10, {
        is_movie: options.isMovie,
        is_adult: options.isAdult
      });
      return results;
    }, API_CONFIG.cacheTimeout);
    
    return normalizeItems(data);
  } catch (error) {
    console.error('인기 콘텐츠 가져오기 실패:', error);
    return [];
  }
};

/**
 * 최신 콘텐츠 가져오기
 * @param {Object} options - 가져오기 옵션
 * @returns {Promise<Array>} - 최신 아이템들
 */
export const getRecentContent = async (options = { isMovie: null, isAdult: false, limit: 10 }) => {
  const cacheKey = createCacheKey('recent-content', {
    limit: options.limit || 10,
    isMovie: options.isMovie,
    isAdult: options.isAdult
  });
  
  try {
    const data = await cachedFetch(cacheKey, async () => {
      const results = await recommendationAPI.fetchRecommendations('recent', options.limit || 10, {
        is_movie: options.isMovie,
        is_adult: options.isAdult
      });
      return results;
    }, API_CONFIG.cacheTimeout);
    
    return normalizeItems(data);
  } catch (error) {
    console.error('최신 콘텐츠 가져오기 실패:', error);
    return [];
  }
};

/**
 * 감정 기반 추천 콘텐츠 가져오기
 * @param {Object} options - 가져오기 옵션
 * @returns {Promise<Array>} - 감정 기반 추천 아이템들
 */
export const getEmotionContent = async (options = { isMovie: null, isAdult: false, limit: 10 }) => {
  const cacheKey = createCacheKey('emotion-content', {
    limit: options.limit || 10,
    isMovie: options.isMovie,
    isAdult: options.isAdult
  });
  
  try {
    const data = await cachedFetch(cacheKey, async () => {
      const results = await recommendationAPI.fetchRecommendations('emotion', options.limit || 10, {
        is_movie: options.isMovie,
        is_adult: options.isAdult
      });
      return results;
    }, API_CONFIG.cacheTimeout);
    
    return normalizeItems(data);
  } catch (error) {
    console.error('감정 기반 추천 콘텐츠 가져오기 실패:', error);
    return [];
  }
};

/**
 * 유사 콘텐츠 가져오기
 * @param {Object} options - 가져오기 옵션
 * @returns {Promise<Array>} - 유사 아이템들
 */
export const getSimilarContent = async (options = { isMovie: null, isAdult: false, limit: 10 }) => {
  const cacheKey = createCacheKey('similar-content', {
    limit: options.limit || 10,
    isMovie: options.isMovie,
    isAdult: options.isAdult
  });
  
  try {
    const data = await cachedFetch(cacheKey, async () => {
      const results = await recommendationAPI.fetchRecommendations('similar', options.limit || 10, {
        is_movie: options.isMovie,
        is_adult: options.isAdult
      });
      return results;
    }, API_CONFIG.cacheTimeout);
    
    return normalizeItems(data);
  } catch (error) {
    console.error('유사 콘텐츠 가져오기 실패:', error);
    return [];
  }
};

/**
 * 테스트 추천 콘텐츠 가져오기 (기존 호환성 유지)
 * @param {Object} options - 가져오기 옵션
 * @returns {Promise<Array>} - 테스트 추천 아이템들
 */
export const getTestRecommendations = async (options = { limit: 10 }) => {
  const cacheKey = createCacheKey('test-recommendations', {
    limit: options.limit || 10
  });
  
  try {
    const data = await cachedFetch(cacheKey, async () => {
      const results = await recommendationAPI.fetchRecommendations('test', options.limit || 10);
      return results;
    }, API_CONFIG.cacheTimeout);
    
    return normalizeItems(data);
  } catch (error) {
    console.error('테스트 추천 콘텐츠 가져오기 실패:', error);
    return [];
  }
};

/**
 * HTML 프로젝트의 rec_test.js에서 사용하던 함수들 (React용으로 변환)
 */

// 오늘의 인기작 가져오기
export const fetchTopRecs = (limit = 10) => getPopularContent({ limit });

// 개인화된 힐링 추천 가져오기  
export const fetchEmotionRecs = (limit = 10) => getEmotionContent({ limit });

// 최근 시청 콘텐츠 가져오기
export const fetchRecentRecs = (limit = 10) => getRecentContent({ limit });

// 기본 내보내기
export default {
  getHeroContent,
  getPopularContent,
  getRecentContent,
  getEmotionContent,
  getSimilarContent,
  getTestRecommendations,
  fetchTopRecs,
  fetchEmotionRecs,
  fetchRecentRecs
};
