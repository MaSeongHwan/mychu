/**
 * 추천 서비스 (통합 API 사용)
 * 일반 추천 API 통합 관리
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
      const results = await recommendationAPI.fetchRecommendations('popular', options.limit || 10, {
        is_movie: options.isMovie,
        is_adult: options.isAdult
      });
      return results;
    }, API_CONFIG.cacheTimeout);
    
    return normalizeItems(data);
  } catch (error) {
    console.error('인기 콘텐츠 가져오기 실패:', error);
    console.log('Fallback: 인기 콘텐츠 샘플 데이터 사용');
    
    // 백엔드 연결 실패 시 샘플 데이터 반환
    return [
      { idx: 'pop1', asset_nm: '어벤져스: 엔드게임', poster_path: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', genre: '액션', release_year: '2019' },
      { idx: 'pop2', asset_nm: '기생충', poster_path: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', genre: '스릴러', release_year: '2019' },
      { idx: 'pop3', asset_nm: '조커', poster_path: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', genre: '스릴러', release_year: '2019' },
      { idx: 'pop4', asset_nm: '스파이더맨: 노 웨이 홈', poster_path: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', genre: '액션', release_year: '2021' },
      { idx: 'pop5', asset_nm: '인터스텔라', poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', genre: 'SF', release_year: '2014' },
      { idx: 'pop6', asset_nm: '위험한 관계', poster_path: 'https://image.tmdb.org/t/p/w500/7d8bGBp1CWXfPXmXSbgYHvxsJUs.jpg', genre: '드라마', release_year: '2022' },
      { idx: 'pop7', asset_nm: '올드보이', poster_path: 'https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg', genre: '스릴러', release_year: '2003' },
      { idx: 'pop8', asset_nm: '건축학개론', poster_path: 'https://image.tmdb.org/t/p/w500/q72xD6Hb8l1qs7oYDnlPHZmEKXe.jpg', genre: '로맨스', release_year: '2012' },
      { idx: 'pop9', asset_nm: '아가씨', poster_path: 'https://image.tmdb.org/t/p/w500/e7gOJcSFzYcxUJCfrYvCFbJhJJ7.jpg', genre: '로맨스', release_year: '2016' },
      { idx: 'pop10', asset_nm: '밀양', poster_path: 'https://image.tmdb.org/t/p/w500/xDzxK8nSdlnqfK2nEiuFRzb1RD3.jpg', genre: '드라마', release_year: '2007' }
    ];
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
    console.log('Fallback: 최신 콘텐츠 샘플 데이터 사용');
    
    // 백엔드 연결 실패 시 샘플 데이터 반환
    return [
      { idx: 'rec1', asset_nm: '탑건: 매버릭', poster_path: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', genre: '액션', release_year: '2022' },
      { idx: 'rec2', asset_nm: '엘비스', poster_path: 'https://image.tmdb.org/t/p/w500/qBOKWqAFbveZ4ryjJJwbie6tXkG.jpg', genre: '드라마', release_year: '2022' },
      { idx: 'rec3', asset_nm: '미니언즈: 라이징 구루', poster_path: 'https://image.tmdb.org/t/p/w500/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg', genre: '애니메이션', release_year: '2022' },
      { idx: 'rec4', asset_nm: '토르: 러브 앤 썬더', poster_path: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', genre: '액션', release_year: '2022' },
      { idx: 'rec5', asset_nm: '닥터 스트레인지 2', poster_path: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', genre: '액션', release_year: '2022' },
      { idx: 'rec6', asset_nm: '쥬라기 월드: 도미니언', poster_path: 'https://image.tmdb.org/t/p/w500/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg', genre: '액션', release_year: '2022' },
      { idx: 'rec7', asset_nm: '빛나는 만담', poster_path: 'https://image.tmdb.org/t/p/w500/7d8bGBp1CWXfPXmXSbgYHvxsJUs.jpg', genre: '코미디', release_year: '2022' },
      { idx: 'rec8', asset_nm: '헤어질 결심', poster_path: 'https://image.tmdb.org/t/p/w500/yPuMnkqb5cWOcvntW6kWoT7XnWW.jpg', genre: '로맨스', release_year: '2022' },
      { idx: 'rec9', asset_nm: '브로커', poster_path: 'https://image.tmdb.org/t/p/w500/cuAq3zBgYtClsWJFpQ5NJdCIyX3.jpg', genre: '드라마', release_year: '2022' },
      { idx: 'rec10', asset_nm: '한산: 용의 출현', poster_path: 'https://image.tmdb.org/t/p/w500/7kFhLFGlJBCqRDgBdLnJNsQUlQK.jpg', genre: '액션', release_year: '2022' }
    ];
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
    console.log('Fallback: 감정 기반 콘텐츠 샘플 데이터 사용');
    
    // 백엔드 연결 실패 시 감정 기반 샘플 데이터 반환
    return [
      { idx: 'emo1', asset_nm: '어바웃 타임', poster_path: 'https://image.tmdb.org/t/p/w500/cD3bsNzJuKqczUBrfMsIJcTgHEj.jpg', genre: '로맨스', release_year: '2013' },
      { idx: 'emo2', asset_nm: '라라랜드', poster_path: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', genre: '로맨스', release_year: '2016' },
      { idx: 'emo3', asset_nm: '러브액츄얼리', poster_path: 'https://image.tmdb.org/t/p/w500/1ODdWLpyOnIVl0l67GrdaFDlJGf.jpg', genre: '로맨스', release_year: '2003' },
      { idx: 'emo4', asset_nm: '포레스트 검프', poster_path: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg', genre: '드라마', release_year: '1994' },
      { idx: 'emo5', asset_nm: '업', poster_path: 'https://image.tmdb.org/t/p/w500/BaWg43qgkTxT4zJmS8qOdFCjKm.jpg', genre: '애니메이션', release_year: '2009' },
      { idx: 'emo6', asset_nm: '리틀 포레스트', poster_path: 'https://image.tmdb.org/t/p/w500/8D5RudJVE1cJSPqJMYQ9n7YrSJW.jpg', genre: '드라마', release_year: '2018' },
      { idx: 'emo7', asset_nm: '천공의 성 라퓨타', poster_path: 'https://image.tmdb.org/t/p/w500/npTzVQPELVGHEQIG4hHxKqOoEbT.jpg', genre: '애니메이션', release_year: '1986' },
      { idx: 'emo8', asset_nm: '미드나이트 인 파리', poster_path: 'https://image.tmdb.org/t/p/w500/4EXPM1a27NdJH8BLKUkE9CZnqM7.jpg', genre: '코미디', release_year: '2011' },
      { idx: 'emo9', asset_nm: '지브리 영화들', poster_path: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', genre: '애니메이션', release_year: '2001' },
      { idx: 'emo10', asset_nm: '캐스트 어웨이', poster_path: 'https://image.tmdb.org/t/p/w500/8nBNqAESsLOV0nW7LKEcF2QBFF4.jpg', genre: '드라마', release_year: '2000' }
    ];
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
