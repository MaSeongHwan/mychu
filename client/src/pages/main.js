/**
 * 메인 페이지 전용 스크립트
 * - 메인 페이지 슬라이더 및 추천 초기화
 * - 헤더는 init.js에서 이미 로드됨
 */

import { renderSlider } from '../components/Recommendations.js';
import { API_BASE_URL } from '../api/config.js';
import { initHeroSlider } from '../components/HeroSlider.js';

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  console.log('메인 페이지 초기화 시작');
  
  // 성능 측정 시작
  console.time('main-page-initialization');
  
  // 메인 슬라이더 초기화
  initHeroSlider();
  
  // 메인 페이지 추천 슬라이더 초기화
  initMainPageSliders();
  
  // 장르 필터링 이벤트 처리
  // 드롭다운은 init.js에서 초기화됩니다
  initGenreFilters();
  
  console.timeEnd('main-page-initialization');
  console.log('메인 페이지 초기화 완료');
});

/**
 * 메인 페이지 장르 필터링 이벤트 설정
 */
function initGenreFilters() {
  const genreLinks = document.querySelectorAll('.dropdown-content a');
  
  genreLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const genre = this.textContent.trim();
      console.log(`메인: 장르 필터 선택: ${genre}`);
      
      // 영화 페이지로 장르 필터링과 함께 이동
      window.location.href = `/movie?genre=${encodeURIComponent(genre)}`;
    });
  });
}

/**
 * 메인 페이지 슬라이더 초기화
 */
async function initMainPageSliders() {
  try {
    console.log('메인 페이지 슬라이더 초기화 시작');
    
    // URL에서 장르 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const genreFilter = urlParams.get('genre');
    
    // 1. 인기 콘텐츠 슬라이더
    await fetchAndRenderSlider('top-slider', '/recommendation/popular', {
      n: 10, 
      is_adult: false,
      is_main: true
    });
    
    // 2. 감정 기반 추천 슬라이더
    await fetchAndRenderSlider('emotion-slider', '/recommendation/test', {
      n: 10, 
      is_adult: false,
      genre: '코미디',
      is_main: true
    });
    
    // 3. 최근 시청 콘텐츠 슬라이더
    await fetchAndRenderSlider('recent-slider', '/recommendation/recent', {
      n: 10,
      is_adult: false,
      is_main: true
    });
    
    console.log('메인 페이지 슬라이더 초기화 완료');
    
  } catch (error) {
    console.error('메인 페이지 슬라이더 초기화 오류:', error);
    
    // 오류 표시
    document.querySelectorAll('.error-message').forEach(el => {
      el.style.display = 'block';
      el.textContent = '콘텐츠를 불러오는데 실패했습니다.';
    });
  }
}

/**
 * API 호출 및 슬라이더 렌더링 헬퍼 함수
 */
async function fetchAndRenderSlider(elementId, endpoint, params = {}) {
  try {
    // 파라미터 문자열 생성
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    }
    
    // API 호출
    const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;
    console.log(`슬라이더 데이터 요청: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }
    
    const data = await response.json();
    const items = data.items || [];
    
    if (items.length > 0) {
      // 데이터 가공 (필요한 필드만 추출)
      const processedItems = items.map(item => ({
        poster_path: item.poster_path,
        asset_idx: item.idx || item.asset_idx // 두 가지 가능한 필드명을 모두 처리
      }));
      
      // 슬라이더 렌더링
      const sliderElement = document.getElementById(elementId);
      if (sliderElement) {
        renderSlider(sliderElement, processedItems);
        console.log(`${elementId} 슬라이더 렌더링 완료:`, processedItems.length);
      } else {
        console.error(`${elementId} 슬라이더 요소를 찾을 수 없음`);
      }
    } else {
      // 데이터가 없는 경우
      const sliderElement = document.getElementById(elementId);
      if (sliderElement) {
        const errorMsg = sliderElement.querySelector('.error-message') || document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = '추천 콘텐츠가 없습니다.';
        errorMsg.style.display = 'block';
        
        if (!sliderElement.contains(errorMsg)) {
          sliderElement.appendChild(errorMsg);
        }
      }
    }
    
  } catch (error) {
    console.error(`${elementId} 슬라이더 데이터 로드 실패:`, error);
    const sliderElement = document.getElementById(elementId);
    if (sliderElement) {
      const errorMsg = sliderElement.querySelector('.error-message') || document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.textContent = '콘텐츠를 불러오는데 실패했습니다.';
      errorMsg.style.display = 'block';
      
      if (!sliderElement.contains(errorMsg)) {
        sliderElement.appendChild(errorMsg);
      }
    }
  }
}
