import { searchFiltered } from '../api/search.js';
import { debounce } from './utils.js';

// 검색창 초기화 - 자동완성 포함
export function initializeSearch() {
  const searchInput = document.querySelector('.search-input');
  const suggestionsContainer = document.getElementById('search-suggestions');
  
  if (!searchInput || !suggestionsContainer) {
    console.warn('검색 요소를 찾을 수 없습니다:', { searchInput, suggestionsContainer });
    return;
  }

  console.log('검색 초기화 완료:', { searchInput, suggestionsContainer });
  
  // 디바운스된 입력 이벤트 핸들러
  const handleSearchInput = debounce(async (e) => {
    const query = e.target.value.trim();
    
    // 입력이 비어있으면 제안 숨기기
    if (!query) {
      suggestionsContainer.innerHTML = '';
      suggestionsContainer.style.display = 'none';
      return;
    }
    
    if (query.length >= 2) {
      try {
        console.log('검색 시작:', query);
        // 자동완성을 위한 검색 결과 가져오기 (최대 10개)
        const results = await searchFiltered(query, 10);
        console.log('검색 결과:', results);
        
        if (results && results.length > 0) {
          // 자동완성 결과 표시
          renderSuggestions(results, suggestionsContainer, query);
          suggestionsContainer.style.display = 'block';
        } else {
          suggestionsContainer.innerHTML = '<div class="suggestion-item">검색 결과가 없습니다</div>';
          suggestionsContainer.style.display = 'block';
        }
      } catch (error) {
        console.error('검색 자동완성 오류:', error);
        suggestionsContainer.innerHTML = '<div class="suggestion-item error">오류가 발생했습니다</div>';
        suggestionsContainer.style.display = 'block';
      }
    }
  }, 300);

  // 이벤트 리스너 등록
  searchInput.addEventListener('input', handleSearchInput);
  
  // 검색창 포커스 이벤트
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim() && suggestionsContainer.children.length > 0) {
      suggestionsContainer.style.display = 'block';
    }
  });
  
  // 검색창 외부 클릭 시 자동완성 닫기
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.style.display = 'none';
    }
  });
  
  // 엔터 키 이벤트 처리
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const keyword = searchInput.value.trim();
      if (!keyword) return;
      
      // 검색 페이지로 이동
      window.location.href = `/search?q=${encodeURIComponent(keyword)}`;
    }
  });
  
  // 제안 항목 클릭 이벤트 위임 처리
  suggestionsContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    
    const id = item.dataset.id;
    if (id) {
      // 콘텐츠 상세 페이지로 이동
      window.location.href = `/contents?id=${id}`;
    } else {
      // 텍스트만 클릭한 경우 - 검색창에 해당 텍스트 채우기
      const titleEl = item.querySelector('.item-title');
      if (titleEl) {
        searchInput.value = titleEl.textContent;
        suggestionsContainer.style.display = 'none';
      }
    }
  });
}

// 자동완성 결과 렌더링 함수
function renderSuggestions(results, container, query) {
  container.innerHTML = '';
  
  // 각 결과에 대한 HTML 생성
  results.forEach(item => {
    // 썸네일 이미지 또는 기본 이미지
    const thumbnail = item.poster_path || 'https://via.placeholder.com/40x60?text=No+Image';
    
    // 결과 강조 표시를 위한 제목 하이라이트
    const title = highlightMatch(item.asset_nm || item.super_asset_nm || '제목 없음', query);
    
    // 항목 HTML 생성
    const html = `
      <div class="suggestion-item" data-id="${item.asset_idx || ''}">
        <img src="${thumbnail}" alt="${item.asset_nm || ''}" />
        <div class="item-info">
          <div class="item-title">${title}</div>
          <div class="item-meta">${item.genre || ''} ${item.release_year ? `· ${item.release_year}` : ''}</div>
        </div>
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
  });
}

// 검색어와 일치하는 부분 강조 표시
function highlightMatch(text, query) {
  if (!query || !text) return text || '';
  
  try {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  } catch (e) {
    console.error('하이라이트 오류:', e);
    return text;
  }
}
