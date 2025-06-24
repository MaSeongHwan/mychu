/**
 * MainPageLoader.js - 성능 최적화를 위한 메인 페이지 로드 관리자
 * - API 호출 병렬 처리
 * - 캐싱 메커니즘 구현
 * - 점진적 로딩 UI
 */

import { getHeroMovies, fetchMultipleRecommendations } from '../api/recommendation_test.js';
import { initHeroSlider } from './HeroSlider.js';
import { renderSlider } from './Recommendations.js';

// API 응답 캐시 (세션 지속, 새로고침 시 초기화)
const apiCache = new Map();

/**
 * 메인 페이지 컴포넌트 초기화 (로딩 인디케이터 포함)
 */
export async function initMainPageWithLoadingIndicators() {
  console.log('메인 페이지 콘텐츠 초기화 시작');
  console.time('all-content-loaded');

  // 각 섹션 로딩 표시기 활성화
  showSectionLoadingIndicators();
  
  try {
    // 병렬로 모든 API 호출 시작
    const [heroMoviesPromise, recommendationsPromise] = await Promise.allSettled([
      getCachedData('hero-movies', () => getHeroMovies()),
      getCachedData('all-recommendations', () => 
        fetchMultipleRecommendations(['popular', 'emotion', 'recent']))
    ]);
    
    // Hero 슬라이더 초기화 (최우선)
    if (heroMoviesPromise.status === 'fulfilled') {
      const heroMovies = heroMoviesPromise.value;
      console.log('Hero 슬라이더 데이터 로드 완료:', heroMovies.length);
      initHeroSlider(heroMovies);
    } else {
      console.error('Hero 슬라이더 데이터 로드 실패:', heroMoviesPromise.reason);
      // 오류 시 기본 데이터로 초기화
      initHeroSlider([]);
    }
      // 추천 슬라이더 초기화
    if (recommendationsPromise.status === 'fulfilled') {
      const allRecommendations = recommendationsPromise.value;
      console.log('모든 추천 데이터 로드 완료', allRecommendations);
      
      // 각 슬라이더별 데이터 적용
      if (allRecommendations.popular && allRecommendations.popular.length > 0) {
        console.log('인기 콘텐츠 샘플:', allRecommendations.popular[0]); // 디버깅용 로그
        renderSlider(document.getElementById('popular-main-slider'), allRecommendations.popular);
      } else {
        showSliderError('popular-main-slider', '인기 콘텐츠 데이터를 불러올 수 없습니다.');
      }
      
      if (allRecommendations.emotion && allRecommendations.emotion.length > 0) {
        console.log('감정 기반 콘텐츠 샘플:', allRecommendations.emotion[0]); // 디버깅용 로그
        renderSlider(document.getElementById('genre-main-slider'), allRecommendations.emotion);
      } else {
        showSliderError('genre-main-slider', '감정 기반 추천 데이터를 불러올 수 없습니다.');
      }
      
      if (allRecommendations.recent && allRecommendations.recent.length > 0) {
        console.log('최근 시청 콘텐츠 샘플:', allRecommendations.recent[0]); // 디버깅용 로그
        renderSlider(document.getElementById('recent-main-slider'), allRecommendations.recent);
      } else {
        showSliderError('recent-main-slider', '최근 시청 데이터를 불러올 수 없습니다.');
      }
      
    } else {
      console.error('추천 데이터 로드 실패:', recommendationsPromise.reason);
      // 각 슬라이더에 오류 메시지 표시
      ['popular-main-slider', 'genre-main-slider', 'recent-main-slider'].forEach(id => {
        showSliderError(id, '데이터를 불러올 수 없습니다.');
      });
    }

  } catch (error) {
    console.error('메인 페이지 초기화 중 예기치 않은 오류:', error);
  } finally {
    // 로딩 종료 측정
    console.timeEnd('all-content-loaded');
  }
}

/**
 * 데이터 로드 전 각 섹션에 로딩 인디케이터 표시
 */
function showSectionLoadingIndicators() {
  // Hero 섹션 로딩 표시
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const slides = heroSection.querySelectorAll('.hero-slide');
    slides.forEach(slide => {
      slide.classList.add('loading');
    });
  }
  
  // 각 슬라이더 로딩 표시
  ['popular-main-slider', 'genre-main-slider', 'recent-main-slider'].forEach(id => {
    const slider = document.getElementById(id);
    if (slider) {
      slider.innerHTML = `
        <div class="loading-indicator">
          <div class="loading-spinner"></div>
          <p>콘텐츠를 불러오는 중입니다...</p>
        </div>
      `;
    }
  });
}

/**
 * 슬라이더에 오류 메시지 표시
 */
function showSliderError(sliderId, message) {
  const slider = document.getElementById(sliderId);
  if (slider) {
    const errorMsg = slider.querySelector('.error-message') || document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    if (!slider.contains(errorMsg)) {
      slider.appendChild(errorMsg);
    }
  }
}

/**
 * 캐시를 활용한 데이터 로드 (선택적 새로고침)
 */
async function getCachedData(key, fetchFunction, forceRefresh = false) {
  // 캐시 유효 시간 (5분)
  const CACHE_TTL = 5 * 60 * 1000;
  
  // 캐시 확인
  const cachedItem = apiCache.get(key);
  const now = Date.now();
  
  // 캐시가 유효하고 강제 새로고침이 아닌 경우
  if (!forceRefresh && cachedItem && (now - cachedItem.timestamp < CACHE_TTL)) {
    console.log(`[캐시 사용] ${key} 데이터`);
    return cachedItem.data;
  }
  
  // 캐시가 없거나 만료된 경우 새로 가져옴
  try {
    console.log(`[API 호출] ${key} 데이터 요청`);
    const data = await fetchFunction();
    
    // 캐시 업데이트
    apiCache.set(key, {
      data,
      timestamp: now
    });
    
    return data;
  } catch (error) {
    console.error(`[API 오류] ${key} 데이터 로드 실패:`, error);
    throw error;
  }
}

