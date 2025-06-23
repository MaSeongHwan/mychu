import { loadHeader } from '/components/loadHeader.js';
import { initializeSearch } from './components/Search.js';
import { searchFiltered, searchAll } from './api/search.js';
import { initializeUserMenu, setupLogout } from './components/UserMenu.js';
import { initDropdown } from './components/Dropdown.js';

const isAdultPage = location.pathname.includes('/adult');
const path = location.pathname;
const pathWithoutSlash = path.replace(/^\/|\/$/g, '');

// 헤더는 /login, /index만 제외한 모든 경로에서 삽입 (슬래시 유무 모두 허용)
if (!/^\/(login|index)\/?$/.test(path)) {
  loadHeader().then(() => {
    // 헤더가 로딩된 후 초기화

    // 로고 클릭 시 홈으로 이동
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
      logoLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/main';
      });
    }

    initializeSearch(isAdultPage
      ? (q, l) => searchAll({ query: q, limit: l, is_adult: true })
      : searchFiltered
    );

    initializeUserMenu();
    setupLogout();
      // 드롭다운 처리
    const showDropdownPages = ['main', 'movie', 'drama', 'search']; // search 페이지도 추가
    
    // 전역 객체에 드롭다운 상태 추적 - 중요: 싱글톤 패턴
    if (!window.dropdownInitialized) {
      window.dropdownInitialized = {
        instance: null,
        listeners: []
      };
    }
    
    if (showDropdownPages.includes(pathWithoutSlash)) {
      // 모든 전역 클릭 이벤트 리스너 제거 - 중요: 이벤트 충돌 방지
      if (window.dropdownInitialized.listeners.length > 0) {
        window.dropdownInitialized.listeners.forEach(listener => {
          document.removeEventListener('click', listener);
        });
        window.dropdownInitialized.listeners = [];
        console.log('기존 드롭다운 이벤트 리스너 정리됨');
      }
      
      // 기존 드롭다운 인스턴스가 있다면 제거 (클린업)
      const existingDropdowns = document.querySelectorAll('.dropdown-container');
      existingDropdowns.forEach(dropdown => {
        dropdown.remove();
      });
        // 새 장르 선택기 초기화 - 매우 단순화된 방식
      try {
        // 초기화 직접 실행 (지연 없음)
        const genreInstance = initDropdown();
        
        // 로그 출력
        console.log(`${pathWithoutSlash} 페이지에 장르 선택기 초기화 완료`);
      } catch (err) {
        console.error('장르 선택기 초기화 실패:', err);
      }
    } else {
      console.log(`${pathWithoutSlash} 페이지는 드롭다운이 필요하지 않음`);
    }

    console.log('헤더 + 검색 + 사용자메뉴 초기화 완료');
  });
}