import { searchFiltered } from '../api/search.js';
import { API_BASE_URL } from '../api/config.js';

/**
 * 디바운스 함수 - 연속적인 이벤트 처리를 제한하는 유틸리티
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * 검색창 초기화 - 자동완성 포함
 * 텍스트 중심의 깔끔한 검색 결과를 보여줌
 */
export function initializeSearch() {
  console.log('검색 기능 초기화 시작');
  
  const searchInput = document.querySelector('.search-input');
  const suggestionsContainer = document.getElementById('search-suggestions');
  
  // 필수 요소 확인
  if (!searchInput || !suggestionsContainer) {
    console.warn('검색 요소를 찾을 수 없습니다:', { 
      searchInput: searchInput ? '있음' : '없음', 
      suggestionsContainer: suggestionsContainer ? '있음' : '없음' 
    });
    return;
  }

  console.log('검색 요소 찾음');
  
  // 디바운스된 입력 이벤트 핸들러
  const handleSearchInput = debounce(async (e) => {
    const query = e.target.value.trim();
    
    // 입력이 비어있으면 제안 숨기기
    if (!query) {
      suggestionsContainer.innerHTML = '';
      suggestionsContainer.classList.remove('show');
      return;
    }
    
    // 최소 2글자 이상일 때만 검색
    if (query.length >= 2) {
      try {
        console.log('검색 시작:', query);
        
        // 검색 진행 중 표시
        suggestionsContainer.classList.add('show');
        suggestionsContainer.innerHTML = '<div class="suggestion-item">검색 중...</div>';
        
        // API 호출 제한시간 설정
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // 검색 API 호출
        const res = await fetch(`${API_BASE_URL}/search/?query=${encodeURIComponent(query)}&limit=10`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          console.error('검색 API 오류:', res.status, res.statusText);
          suggestionsContainer.innerHTML = '<div class="suggestion-item">검색 결과를 불러올 수 없습니다.</div>';
          return;
        }
        
        // 응답 데이터 처리
        const data = await res.json();
        console.log('검색 응답 데이터:', data);
        
        // API 응답 구조에 따라 결과 추출
        let results = data;
        if (data.results) {
          results = data.results;
        }
        
        // 결과 검증
        if (!Array.isArray(results) || results.length === 0) {
          suggestionsContainer.innerHTML = '<div class="suggestion-item">검색 결과가 없습니다.</div>';
          return;
        }
        
        // 텍스트 중심의 결과 렌더링
        renderTextSuggestions(results, suggestionsContainer);
        
      } catch (error) {
        console.error('검색 자동완성 오류:', error);
        
        if (error.name === 'AbortError') {
          suggestionsContainer.innerHTML = '<div class="suggestion-item">검색 시간이 초과되었습니다.</div>';
        } else {
          suggestionsContainer.innerHTML = '<div class="suggestion-item">검색 오류가 발생했습니다.</div>';
        }
      }
    } else {
      suggestionsContainer.classList.remove('show');
    }
  }, 300);

  // 이벤트 리스너 등록
  searchInput.addEventListener('input', handleSearchInput);
  
  // 검색창 외부 클릭 시 자동완성 닫기
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.classList.remove('show');
    }
  });
  
  // 엔터 키 이벤트 처리
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        // 검색 페이지로 이동 (q 파라미터 사용)
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
      }
    }
  });
}

/**
 * 텍스트 중심의 검색 결과 렌더링 함수
 */
function renderTextSuggestions(results, container) {
  container.innerHTML = '';
  console.log('렌더링할 결과:', results);
  
  results.forEach(item => {
    // 백엔드 API 응답에서 필요한 데이터 추출
    const title = item.super_asset_nm || item.asset_nm || item.title || '제목 없음';
    const genre = item.genre || '';
    const year = item.release_year ? ` · ${item.release_year}` : '';
    const id = item.idx || item.asset_idx || item.id || '';
    
    console.log(`처리 중인 아이템 - ID: ${id}, 제목: ${title}`);
    
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.dataset.id = id;
    
    // 텍스트만 표시하는 깔끔한 형태로 렌더링
    suggestionItem.innerHTML = `
      <div class="item-info">
        <div class="item-title">${title}</div>
        <div class="item-meta">${genre}${year}</div>
      </div>
    `;
    
    // 클릭 이벤트 추가
    suggestionItem.addEventListener('click', () => {
      if (id) {
        console.log(`클릭된 아이템 ID: ${id}`);
        // 성인 컨텐츠 조건 확인
        if (item.is_adult === 'Y' || item.genre?.includes('성인')) {
          window.location.href = `/adult?id=${id}`;
        } else {
          window.location.href = `/contents?id=${id}`;
        }
      } else {
        console.error('ID가 없습니다:', item);
      }
    });
    
    container.appendChild(suggestionItem);
  });
  
  console.log('검색 결과 렌더링 완료');
}

/**
 * 검색 결과 페이지에서 사용하는 결과 렌더링 함수
 */
export function renderSearchResults(results, container) {
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!results || results.length === 0) {
    container.innerHTML = '<div class="no-results">검색 결과가 없습니다.</div>';
    return;
  }
  
  results.forEach(item => {
    // 외부 이미지 URL에서 발생하는 HTTP2 오류 방지를 위해 URL 검사
    const posterURL = (item.poster_path && !item.poster_path.includes('thumbnews.nateimg.co')) 
      ? item.poster_path 
      : 'https://via.placeholder.com/300x450?text=No+Image';
    
    const title = item.super_asset_nm || item.asset_nm || item.title || '제목 없음';
    const genre = item.genre || '';
    const id = item.idx || item.asset_idx || item.id || '';
    
    const card = document.createElement('div');
    card.className = 'content-card';
    card.dataset.id = id;
    card.style.cursor = 'pointer';
    
    card.innerHTML = `
      <div class="card-image">
        <img src="${posterURL}" alt="${title}" 
             onerror="this.onerror=null; this.src='https://via.placeholder.com/300x450?text=No+Image';" />
      </div>
      <div class="card-info">
        <h3 class="card-title">${title}</h3>
        <span class="card-genre">${genre}</span>
      </div>
    `;
    
    // 클릭 이벤트 추가
    card.addEventListener('click', () => {
      if (id) {
        if (item.is_adult === 'Y' || item.genre?.includes('성인')) {
          window.location.href = `/adult?id=${id}`;
        } else {
          window.location.href = `/contents?id=${id}`;
        }
      }
    });
    
    container.appendChild(card);
  });
}
