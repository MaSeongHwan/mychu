/**
 * 드라마 페이지 전용 스크립트
 * - 드라마 페이지 슬라이더 및 추천 초기화
 * - 헤더는 init.js에서 이미 로드됨
 */

import { renderSlider } from '../components/Recommendations.js';
import { API_BASE_URL } from '../api/config.js';

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  console.log('드라마 페이지 초기화 시작');
  
  // 드라마 전용 추천 API 호출 및 슬라이더 초기화
  initDramaPageSliders();

  // 메인 슬라이더 초기화
  initHeroSlider();
  
  // 드라마 장르별 필터링 이벤트 처리
  initDramaGenreFilters();
  
  console.log('드라마 페이지 초기화 완료');
});

/**
 * 드라마 장르 필터 초기화
 */
function initDramaGenreFilters() {
  const genreLinks = document.querySelectorAll('.dropdown-content a');
  
  genreLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const genre = this.textContent.trim();
      console.log(`드라마 장르 필터 선택: ${genre}`);
      
      // 장르 필터링된 페이지로 이동 또는 현재 페이지에서 필터링
      window.location.href = `/drama?genre=${encodeURIComponent(genre)}`;
    });
  });
}

/**
 * 드라마 페이지 슬라이더 초기화
 */
async function initDramaPageSliders() {
  try {
    console.log('드라마 페이지 슬라이더 초기화 시작');
    
    // URL에서 장르 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const genreFilter = urlParams.get('genre');
    
    // 각 슬라이더 섹션 초기화 (인기 드라마, 장르별 드라마, 최신 드라마)
    
    // 1. 인기 드라마 슬라이더
    await fetchAndRenderSlider('popular-drama-slider', '/recommendation/popular', {
      n: 10, 
      is_adult: false,
      is_drama: true,
      is_main: true,
      genre: genreFilter
    });
      // 2. 감정 기반/장르별 드라마 슬라이더 (항상 표시)
    if (genreFilter) {
      document.querySelector('#genre-drama-heading').textContent = `${genreFilter} 장르 드라마`;
    } else {
      document.querySelector('#genre-drama-heading').textContent = `소금님, 오늘은 따듯한 힐링 드라마가 어울려요`;
    }
    
    await fetchAndRenderSlider('genre-drama-slider', '/recommendation/test', {
      n: 10, 
      is_adult: false,
      is_drama: true,
      is_main: true,
      genre: genreFilter || '코미디' // 장르 필터가 없으면 기본적으로 코미디 장르 표시
    });
    
    // 3. 최신 드라마 슬라이더
    await fetchAndRenderSlider('recent-drama-slider', '/recommendation/recent', {
      n: 10,
      is_adult: false,
      is_drama: true,      
      is_main: true
    });
    
    console.log('드라마 페이지 슬라이더 초기화 완료');
    
  } catch (error) {
    console.error('드라마 페이지 슬라이더 초기화 오류:', error);
    
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
        asset_idx: item.idx
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

// 검색 핸들러
async function handleSearch(query) {
  try {
    const results = await searchContent(query);
    const searchResultsContainer = document.querySelector('.search-results');
    if (searchResultsContainer) {
      renderSearchResults(results, searchResultsContainer);
    }
  } catch (error) {
    console.error('검색 오류:', error);
  }
}

function updateUIWithUserData(userData) {
    // 사용자 정보로 UI 업데이트
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userData.nickname;
    }

    // 데이터셋 정보가 있으면 추천 슬라이더 업데이트
    if (userData.dataset) {
        updateRecommendations(userData.dataset);
    }
}

function handleLoggedOutState() {
    // 로그아웃 상태 UI 처리
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = '게스트';
    }
}
