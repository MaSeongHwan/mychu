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

    // poster_path와 asset_idx만 필터링
    const filteredItems = items.map(item => ({
      poster_path: item.poster_path,
      asset_idx: item.asset_idx
    }));

    // 검색 결과 카드 생성 (이미지만)
    grid.innerHTML = filteredItems.map(item => `
      <div class="content-card" data-id="${item.asset_idx || ''}" style="cursor: pointer;">
        <div class="card-image">
          <img src="${item.poster_path || 'https://via.placeholder.com/300x450?text=No+Image'}" alt="Poster" />
        </div>
      </div>
    `).join('');
    
    // 클릭 이벤트 추가
    const cards = grid.querySelectorAll('.content-card');
    cards.forEach(card => {
      const id = card.dataset.id;
      if (id) {
        card.addEventListener('click', () => {
          window.location.href = `/contents?id=${id}`;
        });
      }
    });
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