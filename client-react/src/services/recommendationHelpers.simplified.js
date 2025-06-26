/**
 * 단순화된 추천 서비스 - 페이지별 초기화 함수 제거
 * 컴포넌트에서 필요한 데이터만 직접 호출하는 방식
 */

import { getPopularContent, getEmotionContent, getRecentContent } from './recommendationService.js';

/**
 * 범용 추천 데이터 로더
 * @param {Object} options - 로드 옵션
 * @returns {Promise<Object>} 추천 데이터 객체
 */
export async function loadRecommendations(options = {}) {
  const {
    types = ['popular', 'emotion', 'recent'], // 로드할 타입들
    isMovie = null,                           // 영화 필터
    isDrama = null,                          // 드라마 필터
    isAdult = false,                         // 성인 콘텐츠 필터
    limit = 10                               // 각 타입별 개수
  } = options;

  console.log('추천 데이터 로드 시작:', options);
  
  const results = {};
  const promises = [];

  // 요청된 타입별로 API 호출
  if (types.includes('popular')) {
    promises.push(
      getPopularContent({ isMovie, isDrama, isAdult, limit })
        .then(data => ({ type: 'popular', data }))
        .catch(error => {
          console.error('인기 콘텐츠 로드 실패:', error);
          return { type: 'popular', data: [] };
        })
    );
  }

  if (types.includes('emotion')) {
    promises.push(
      getEmotionContent({ isMovie, isDrama, isAdult, limit })
        .then(data => ({ type: 'emotion', data }))
        .catch(error => {
          console.error('감정 기반 콘텐츠 로드 실패:', error);
          return { type: 'emotion', data: [] };
        })
    );
  }

  if (types.includes('recent')) {
    promises.push(
      getRecentContent({ isMovie, isDrama, isAdult, limit })
        .then(data => ({ type: 'recent', data }))
        .catch(error => {
          console.error('최신 콘텐츠 로드 실패:', error);
          return { type: 'recent', data: [] };
        })
    );
  }

  try {
    // 모든 API를 병렬로 호출
    const responses = await Promise.all(promises);
    
    // 결과를 객체로 변환
    responses.forEach(({ type, data }) => {
      results[type] = data;
    });

    console.log('추천 데이터 로드 완료:', results);
    return results;

  } catch (error) {
    console.error('추천 데이터 로드 실패:', error);
    return {};
  }
}

/**
 * 메인 페이지용 추천 데이터 (기존 호환성 유지)
 */
export const getMainPageRecommendations = () => 
  loadRecommendations({
    types: ['popular', 'emotion', 'recent'],
    isAdult: false,
    limit: 10
  });

/**
 * 드라마 페이지용 추천 데이터 (기존 호환성 유지)
 */
export const getDramaPageRecommendations = () => 
  loadRecommendations({
    types: ['popular', 'emotion', 'recent'],
    isDrama: true,
    isAdult: false,
    limit: 10
  });

/**
 * 영화 페이지용 추천 데이터 (기존 호환성 유지)
 */
export const getMoviePageRecommendations = () => 
  loadRecommendations({
    types: ['popular', 'emotion', 'recent'],
    isMovie: true,
    isAdult: false,
    limit: 10
  });

export default {
  loadRecommendations,
  getMainPageRecommendations,
  getDramaPageRecommendations,
  getMoviePageRecommendations
};
