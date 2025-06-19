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
    
    // 드롭다운은 main, movie, drama 페이지에만 표시
    const showDropdownPages = ['main', 'movie', 'drama'];
    if (showDropdownPages.includes(pathWithoutSlash)) {
      // 기존 드롭다운 제거 (HTML에 하드코딩된 경우 대비)
      const existingDropdown = document.querySelector('.dropdown-container');
      if (existingDropdown) {
        existingDropdown.remove();
      }
      
      // 드롭다운 JS로 초기화
      initDropdown();
      console.log(`${pathWithoutSlash} 페이지에 드롭다운 초기화 완료`);
    }

    console.log('헤더 + 검색 + 사용자메뉴 초기화 완료');
  });
}