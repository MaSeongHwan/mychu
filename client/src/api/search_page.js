import { searchFiltered } from './search.js';
import { renderSearchResults } from '../components/Search.js';

// URL에서 q 파라 읽기
const params = new URLSearchParams(location.search);
const q = params.get('q') || '';

const input = document.getElementById('q');
const grid  = document.getElementById('results-grid');
const sectionTitle = document.querySelector('#search-results .section-header h2');

input.value = q;

async function doSearch(keyword) {
  // 검색어 표시
  sectionTitle.textContent = `"${keyword}" 검색 결과`;
  
  // 로딩 표시
  grid.innerHTML = '<div class="loading-indicator"><p>검색 중…</p></div>';
  
  try {
    console.log('검색 페이지에서 검색 시작:', keyword);
    const items = await searchFiltered(keyword, 20);
    console.log('검색 결과 수신:', items?.length || 0);

    if (!items || !items.length) {
      grid.innerHTML = '<div class="no-results"><p>검색 결과가 없습니다. 다른 키워드로 검색해 보세요.</p></div>';
      return;
    }

    // 통합된 검색 결과 렌더링 함수 사용
    renderSearchResults(items, grid);
    
  } catch (err) {
    console.error('검색 오류:', err);
    grid.innerHTML = '<div class="error-message"><p>검색 중 오류가 발생했습니다. 다시 시도해 주세요.</p></div>';
  }
}

input.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const keyword = input.value.trim();
    if (!keyword) return;
    location.search = `?q=${encodeURIComponent(keyword)}`;
  }
});

// 페이지 로드 시 바로 검색
if (q) {
  doSearch(q);
} else {
  sectionTitle.textContent = '검색';
  grid.innerHTML = '<div class="search-prompt"><p>위 검색창에 키워드를 입력하세요.</p></div>';
}