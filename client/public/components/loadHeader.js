// /src/components/loadHeader.js
// 올바른 경로로 Search.js의 initializeSearch 함수 import
import { initializeSearch } from '/src/components/Search.js';

export async function loadHeader() {
  try {
    console.log('헤더 로드 시작');
    const res = await fetch('/components/header.html');
    if (!res.ok) {
      console.error('헤더 로드 실패:', res.status);
      return false;
    }
    const html = await res.text();
    console.log('헤더 HTML 로드 완료');

    const temp = document.createElement('div');
    temp.innerHTML = html;

    // header 삽입
    const headerElement = temp.querySelector('header');
    if (headerElement) {
      document.body.insertBefore(headerElement, document.body.firstChild);
      console.log('헤더 요소 삽입 완료');
    } else {
      console.error('헤더 요소를 찾을 수 없습니다.');
      return false;
    }

    // CSS도 동적으로 로딩 (중복 방지)
    const cssPath = '/components/header.css';
    if (!document.querySelector(`link[href="${cssPath}"]`)) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = cssPath;
      document.head.appendChild(css);
      console.log('헤더 CSS 로드 완료');
    }

    // 검색 및 사용자 메뉴 기능 초기화
    initHeaderFunctions();
    console.log('헤더 기능 초기화 완료');
    return true;
  } catch (err) {
    console.error('헤더 로드 중 오류 발생:', err);
    return false;
  }
}

// 헤더 기능 초기화
function initHeaderFunctions() {
  // Search.js의 검색 기능 초기화
  try {
    initializeSearch();
    console.log('검색 기능 초기화 완료');
  } catch (err) {
    console.error('검색 기능 초기화 오류:', err);
  }
  
  // 사용자 메뉴 초기화
  initUserMenu();
}

// 사용자 메뉴 초기화
function initUserMenu() {
  const menuButton = document.querySelector('.user-menu-button');
  const dropdown = document.querySelector('.user-dropdown');

  if (!menuButton || !dropdown) {
    console.error('사용자 메뉴 요소를 찾을 수 없습니다.');
    return;
  }

  // 메뉴 버튼 클릭 시 드롭다운 토글
  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  // 외부 클릭 시 드롭다운 숨김
  document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
      console.log('Dropdown closed by outside click');
    }
  });
}