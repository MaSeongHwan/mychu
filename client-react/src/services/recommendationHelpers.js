/**
 * HTML recommendation_test.js를 React용으로 포팅한 파일
 * 다양한 추천 API 엔드포인트를 병렬로 호출하고 특화된 초기화 함수들 제공
 */

import { recommendationAPI } from './api.js';
import { createCacheKey, cachedFetch } from '../utils/apiCache.js';
import { API_CONFIG } from '../utils/apiConfig.js';

/**
 * API 응답 데이터에서 필요한 필드만 추출하고 ID 필드를 통합하는 함수
 * @param {Array} items - API에서 받은 콘텐츠 배열
 * @returns {Array} 필수 필드를 포함한 배열
 */
function filterPosterPathOnly(items) {
  return items.map(item => {
    const contentId = item.idx || item.asset_idx || item.id || null;
    return {
      poster_path: item.poster_path || '',
      asset_idx: contentId,
      id: contentId,
      asset_nm: item.asset_nm || ''
    };
  });
}

/**
 * Hero 슬라이더용 영화 데이터를 가져오는 함수
 * @returns {Promise<Array>} Hero 슬라이더에 표시할 영화 데이터 배열
 */
export async function getHeroMovies() {
  const cacheKey = createCacheKey('hero-movies', { n: 5, is_movie: true, is_main: true });
  
  try {
    const data = await cachedFetch(cacheKey, async () => {
      return await recommendationAPI.fetchRecommendations('test', 5, {
        is_movie: true,
        is_main: true
      });
    }, API_CONFIG.cacheTimeout);
    
    return data || [];
  } catch (error) {
    console.error('Hero 슬라이더 영화 데이터 로드 실패:', error);
    return [];
  }
}

/**
 * main.html용 전체 콘텐츠 추천 API를 사용하여 모든 슬라이더를 초기화하는 함수
 */
export async function initRecommendationsForMain() {
  console.log('main.html용 전체 콘텐츠 추천 API로 슬라이더 초기화 시작');
  
  const results = {
    topItems: [],
    emoItems: [],
    recentItems: []
  };

  // 인기 콘텐츠 추천 데이터 가져오기
  try {
    const topData = await recommendationAPI.fetchRecommendations('test', 10, { 
      is_adult: false 
    });
    results.topItems = filterPosterPathOnly(topData);
  } catch (error) {
    console.error('인기 콘텐츠 추천 데이터 로드 실패:', error);
  }

  // 감정 기반 추천 슬라이더 초기화 - 코미디/힐링 장르로 필터링
  try {
    const emoData = await recommendationAPI.fetchRecommendations('test', 10, { 
      is_main: true, 
      genre: '코미디' 
    });
    results.emoItems = filterPosterPathOnly(emoData);
  } catch (error) {
    console.error('감정 기반 추천 데이터 로드 실패:', error);
  }

  // 최근 시청 콘텐츠 슬라이더 초기화
  try {
    const recentData = await recommendationAPI.fetchRecommendations('recent', 8);
    results.recentItems = filterPosterPathOnly(recentData);
  } catch (error) {
    console.error('최근 시청 콘텐츠 데이터 로드 실패:', error);
  }
  
  console.log('main.html용 모든 슬라이더 초기화 완료');
  return results;
}

/**
 * drama.html용 드라마 전용 추천 API를 사용하여 모든 슬라이더를 초기화하는 함수
 */
export async function initRecommendationsForDrama() {
  console.log('drama.html용 드라마 전용 추천 API로 슬라이더 초기화 시작');
  
  const results = {
    topItems: [],
    emoItems: [],
    recentItems: []
  };

  // 인기 드라마 추천 데이터 가져오기
  try {
    const topData = await recommendationAPI.fetchRecommendations('test', 10, { 
      is_adult: false, 
      is_movie: false, 
      is_drama: true 
    });
    results.topItems = filterPosterPathOnly(topData);
  } catch (error) {
    console.error('인기 드라마 추천 데이터 로드 실패:', error);
  }

  // 감정 기반 추천 슬라이더 초기화 - 드라마 장르로 필터링
  try {
    const emoData = await recommendationAPI.fetchRecommendations('test', 10, { 
      is_main: true, 
      is_movie: false, 
      is_drama: true, 
      genre: '로맨스' 
    });
    results.emoItems = filterPosterPathOnly(emoData);
  } catch (error) {
    console.error('감정 기반 드라마 추천 데이터 로드 실패:', error);
  }

  // 최근 시청 드라마 슬라이더 초기화
  try {
    const recentData = await recommendationAPI.fetchRecommendations('recent', 8, { 
      is_movie: false, 
      is_drama: true 
    });
    results.recentItems = filterPosterPathOnly(recentData);
  } catch (error) {
    console.error('최근 시청 드라마 데이터 로드 실패:', error);
  }
  
  console.log('drama.html용 모든 슬라이더 초기화 완료');
  return results;
}

/**
 * 테스트 추천 API를 사용하여 모든 슬라이더를 초기화하는 함수
 * 각 슬라이더마다 다른 파라미터로 API를 호출하여 서로 다른 콘텐츠를 표시
 * 영화 데이터만 가져오도록 is_movie=true 파라미터 추가
 */
export async function initRecommendationsWithTest() {
  console.log('테스트 추천 API로 슬라이더 초기화 시작 (영화 데이터만)');
  
  const results = {
    topItems: [],
    emoItems: [],
    recentItems: []
  };

  // 인기 영화 추천 데이터 가져오기
  try {
    const topData = await recommendationAPI.fetchRecommendations('test', 10, { 
      is_adult: false, 
      is_movie: true 
    });
    results.topItems = filterPosterPathOnly(topData);
  } catch (error) {
    console.error('인기 영화 추천 데이터 로드 실패:', error);
  }

  // 감정 기반 추천 슬라이더 초기화 - 코미디/힐링 장르로 필터링, 영화만
  try {
    const emoData = await recommendationAPI.fetchRecommendations('test', 10, { 
      is_main: true, 
      is_movie: true, 
      genre: '코미디' 
    });
    results.emoItems = filterPosterPathOnly(emoData);
  } catch (error) {
    console.error('감정 기반 추천 데이터 로드 실패:', error);
  }

  // 최근 시청 콘텐츠 슬라이더 초기화 - 드라마 장르로 필터링, 영화만
  try {
    const recentData = await recommendationAPI.fetchRecommendations('test', 8, { 
      is_movie: true, 
      genre: '드라마' 
    });
    results.recentItems = filterPosterPathOnly(recentData);
  } catch (error) {
    console.error('최근 시청 추천 데이터 로드 실패:', error);
  }
  
  console.log('모든 슬라이더 초기화 완료 (영화 데이터만)');
  return results;
}

/**
 * 여러 추천 엔드포인트를 병렬로 호출하는 최적화된 함수
 * @param {Array<string>} types - 호출할 추천 유형 배열 ('popular', 'emotion', 'recent', 'test' 등)
 * @param {Object} options - 각 호출에 대한 추가 옵션
 * @returns {Promise<Object>} - 각 유형별 결과가 담긴 객체
 */
export async function fetchMultipleRecommendations(types = ['top', 'emotion', 'recent'], options = {}) {
  console.log(`병렬로 ${types.length}개의 추천 데이터 요청 시작`);
  console.time('parallel-recommendations');
  
  // 기본 옵션
  const defaultOptions = {
    n: 10,
    is_adult: false,
    is_main: true
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // 병렬로 모든 타입의 추천 데이터 가져오기
    const promises = types.map(async (type) => {
      try {
        const data = await recommendationAPI.fetchRecommendations(type, mergedOptions.n, mergedOptions);
        return { type, data: filterPosterPathOnly(data) };
      } catch (error) {
        console.error(`${type} 추천 데이터 로드 실패:`, error);
        return { type, data: [] };
      }
    });
    
    const results = await Promise.all(promises);
    console.timeEnd('parallel-recommendations');
    
    // 결과를 객체 형태로 변환
    const resultObj = {};
    results.forEach(({ type, data }) => {
      resultObj[type] = data;
    });
    
    return resultObj;
  } catch (error) {
    console.error('병렬 추천 데이터 로드 실패:', error);
    console.timeEnd('parallel-recommendations');
    
    // 실패 시 빈 객체 반환
    const emptyResult = {};
    types.forEach(type => {
      emptyResult[type] = [];
    });
    return emptyResult;
  }
}

export default {
  getHeroMovies,
  initRecommendationsForMain,
  initRecommendationsForDrama,
  initRecommendationsWithTest,
  fetchMultipleRecommendations,
  filterPosterPathOnly
};
