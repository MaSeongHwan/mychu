import { searchFiltered } from './search.js';

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
    const items = await searchFiltered(keyword, 20);

    if (!items || !items.length) {
      grid.innerHTML = '<div class="no-results"><p>검색 결과가 없습니다. 다른 키워드로 검색해 보세요.</p></div>';
      return;
    }

    // 검색 결과 카드 생성
    grid.innerHTML = items.map(item => `
      <div class="content-card">
        <div class="card-image">
          <img src="${item.poster_path || 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${item.asset_nm}" />
          <div class="card-overlay">
            <div class="card-buttons">
              <button class="card-btn play-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
              <button class="card-btn add-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${item.asset_nm}</h3>
          <div class="card-meta">
            <span>${item.genre || '장르 정보 없음'}</span>
            ${item.release_year ? `<span>${item.release_year}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
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