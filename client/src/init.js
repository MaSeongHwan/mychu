import { loadHeader } from '/components/loadHeader.js';
import { initializeSearch } from './components/Search.js';
import { searchFiltered, searchAll } from './api/search.js';
import { initializeUserMenu, setupLogout } from './components/UserMenu.js';
import { initRecommendationsWithTest } from './api/recommendation_test.js';

const isAdultPage = location.pathname.includes('/adult');

loadHeader().then(() => {
  // ✅ 헤더가 로딩된 후 초기화
  initializeSearch(isAdultPage
    ? (q, l) => searchAll({ query: q, limit: l, is_adult: true })
    : searchFiltered
  );

  initializeUserMenu();
  setupLogout();

  // ✅ 추천 콘텐츠도 여기서 초기화
  initRecommendationsWithTest();

  console.log('헤더 + 검색 + 사용자메뉴 + 추천 초기화 완료');
});
