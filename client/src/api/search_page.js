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

    // 모든 필요한 필드 포함
    const filteredItems = items.map(item => ({
      idx: item.idx,
      poster_path: item.poster_path,
      super_asset_nm: item.super_asset_nm,
      genre: item.genre
    }));

    // 검색 결과 카드 생성 (이미지, 제목, 장르 포함)
    grid.innerHTML = filteredItems.map(item => `
      <div class="content-card" data-id="${item.idx || ''}" style="cursor: pointer;">
        <div class="card-image">
          <img src="${item.poster_path || 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${item.super_asset_nm || 'Poster'}" />
        </div>
        <div class="card-info">
          <h3 class="card-title">${item.super_asset_nm || ''}</h3>
          <span class="card-genre">${item.genre || ''}</span>
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