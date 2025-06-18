import { fetchRecommendations, searchContent } from './api/requests.js';
import { API_CONFIG } from './api/config.js';
import { renderSlider } from './components/Slider.js';
import { initializeSearch, renderSearchResults } from './components/Search.js';
import { initializeUserMenu } from './components/UserMenu.js';
import { initAuthStateListener } from './firebase/auth.js';

// 추천 시스템 설정
const sliderConfigs = [
  { 
    selector: '오늘의 인기작 Top 10', 
    type: 'top'
  },
  { 
    selector: '소금님, 오늘은 따듯한 힐링 영화가 어울려요',
    type: 'emotion'
  },
  { 
    selector: '최근 시청 콘텐츠',
    type: 'recent'
  }
];

// 사용자 데이터 상태 관리
let currentUser = null;

// Auth 상태 변경 리스너 설정
const unsubscribe = initAuthStateListener((userData) => {
    if (userData.isLoggedIn) {
        currentUser = userData;
        console.log('User data updated:', userData);
        // 여기서 UI 업데이트 수행
        updateUIWithUserData(userData);
    } else {
        currentUser = null;
        // 로그아웃 상태 UI 처리
        handleLoggedOutState();
    }
});

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async () => {
  await initializeSliders();
  initializeSearch(handleSearch);
  initializeUserMenu();
});

// 슬라이더 초기화 및 데이터 로드
async function initializeSliders() {
  try {
    for (const cfg of sliderConfigs) {
      const section = Array.from(document.querySelectorAll('.section')).find(
        sec => sec.querySelector('h2')?.textContent.includes(cfg.selector)
      );
      const slider = section?.querySelector('.slider');
      if (!slider) {
        console.warn(`Slider not found for: ${cfg.selector}`);
        continue;
      }

      try {
        const items = await fetchRecommendations(cfg.type, API_CONFIG.defaultLimit);
        await renderSlider(slider, items);
      } catch (error) {
        console.error(`Error loading data for ${cfg.selector}:`, error);
        slider.innerHTML = `
          <div class="error-state">
            <p>컨텐츠를 불러오는데 실패했습니다.</p>
            <button onclick="location.reload()">다시 시도</button>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error('슬라이더 초기화 실패:', error);
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
