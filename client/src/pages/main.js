// 📁 client/src/pages/main.js

import { renderSlider } from '../components/Recommendations.js';
import { API_BASE_URL } from '../api/config.js';
import { initHeroSlider } from '../components/HeroSlider.js';
import { initMainPageWithLoadingIndicators } from '../components/MainPageLoader.js';

// 슬라이더 초기화를 위한 함수
async function fetchRecommendationsForMainPage() {
  console.log('메인 페이지용 추천 데이터 요청 시작');
  
  // 기본 옵션 설정
  const options = {
    n: 10,
    is_adult: false
  };
  
  try {
    // 세 가지 요청을 병렬로 실행
    const [popularPromise, emotionPromise, recentPromise] = await Promise.all([
      // 인기 콘텐츠
      fetch(`${API_BASE_URL}/recommendation/popular?n=${options.n}&is_adult=${options.is_adult}`)
        .then(res => res.ok ? res.json() : { items: [] })
        .then(data => data.items || []),
      
      // 감정 기반 (코미디 장르로 필터링)
      fetch(`${API_BASE_URL}/recommendation/test?n=${options.n}&is_main=true&genre=코미디`)
        .then(res => res.ok ? res.json() : { items: [] })
        .then(data => data.items || []),
      
      // 최근 시청
      fetch(`${API_BASE_URL}/recommendation/recent?n=${options.n}`)
        .then(res => res.ok ? res.json() : { items: [] })
        .then(data => data.items || [])
    ]);
    
    return {
      popular: popularPromise,
      emotion: emotionPromise,
      recent: recentPromise
    };
    
  } catch (error) {
    console.error('추천 데이터 요청 중 오류:', error);
    return {
      popular: [],
      emotion: [],
      recent: []
    };
  }
}

// ✅ 이벤트 위임 방식 장르 필터링 함수 (전역 위치에 선언)
function initGenreFilters() {
  document.body.addEventListener('click', function (e) {
    const genreLink = e.target.closest('.dropdown-content a');
    if (genreLink) {
      e.preventDefault();
      const genre = genreLink.textContent.trim();
      console.log(`메인: 장르 필터 선택: ${genre}`);
      window.location.href = `/movie?genre=${encodeURIComponent(genre)}`;
    }
  });
}

// 슬라이더 초기화 함수 정의 (이전에 누락되었던 함수)
function initMainPageSliders() {
  console.log('메인 페이지 슬라이더 초기화 시작');
  
  try {
    // MainPageLoader의 초기화 함수 호출
    initMainPageWithLoadingIndicators();
  } catch (error) {
    console.error('슬라이더 초기화 중 오류 발생:', error);
    
    // 오류 발생 시 기본 로딩 메시지 표시
    const sliders = ['#popular-main-slider', '#genre-main-slider', '#recent-main-slider'];
    sliders.forEach(selector => {
      const sliderEl = document.querySelector(selector);
      if (sliderEl) {
        sliderEl.innerHTML = '<div class="error-message">콘텐츠를 불러오는데 실패했습니다. 새로고침을 시도해보세요.</div>';
      }
    });
    
    // 백업 직접 호출 방식 시도
    console.log('직접 추천 데이터 로드 시도...');
    fetchRecommendationsForMainPage().then(data => {
      console.log('직접 추천 데이터 로드 완료:', data);
      
      // 각 슬라이더에 데이터 적용
      if (data.popular && data.popular.length > 0) {
        renderSlider(document.getElementById('popular-main-slider'), data.popular);
      }
      
      if (data.emotion && data.emotion.length > 0) {
        renderSlider(document.getElementById('genre-main-slider'), data.emotion);
      }
      
      if (data.recent && data.recent.length > 0) {
        renderSlider(document.getElementById('recent-main-slider'), data.recent);
      }
    });
  }
  
  console.log('메인 페이지 슬라이더 초기화 완료');
}

// ✅ 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  console.log('메인 페이지 초기화 시작');

  // Hero 슬라이더 초기화
  initHeroSlider();
  
  // 모든 콘텐츠 슬라이더 초기화
  initMainPageSliders();

  // 장르 필터 초기화
  initGenreFilters();

  console.log('메인 페이지 초기화 완료');
});
