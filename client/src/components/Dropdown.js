// client/src/components/Dropdown.js

// 초기화 관련 정보를 저장할 객체
// 매우 단순화된 접근법으로 다시 작성
export function initDropdown() {
  console.log('드롭다운 초기화 시작 - 단순화된 접근법');
  
  // 이전 드롭다운 정리 (명확하게)
  document.querySelectorAll('.genre-dropdown-container').forEach(el => el.remove());
  
  // 이전 이벤트 리스너 제거 (window 객체 사용 방식 정리)
  if (window.oldGenreListeners) {
    window.oldGenreListeners.forEach(obj => {
      if (obj.element && obj.listener) {
        obj.element.removeEventListener(obj.type, obj.listener);
      }
    });
  }
  
  // 리스너 목록 초기화
  window.oldGenreListeners = [];
  // 이미 있는 드롭다운 모두 제거 (완전히 초기화)
  document.querySelectorAll('.dropdown-container').forEach(dropdown => {
    dropdown.remove();
  });
  
  // .show 클래스를 가진 모든 드롭다운 초기화
  document.querySelectorAll('.dropdown-content.show').forEach(content => {
    content.classList.remove('show');
  });
  
  console.log('드롭다운 초기화 시작 - 이벤트 리스너 및 기존 요소 정리 완료');  // 1. 폼 기반 컨테이너 생성 (드롭다운 대신 직접 폼으로 변환)
  const genreContainer = document.createElement('div');
  genreContainer.className = 'genre-dropdown-container';
  genreContainer.style.cssText = `
    display: inline-block;
    margin: 10px;
    position: relative;
  `;
    // 실제 폼 요소 생성
  const genreForm = document.createElement('form');
  genreForm.method = 'get';
  
  // 현재 경로에서 해시 제거 (중요: URL에 # 있으면 쿼리 파라미터가 무시됨)
  const currentPathClean = window.location.pathname.split('#')[0];
  genreForm.action = currentPathClean; // 해시 없는 현재 페이지 경로
  
  // 해시 정보 따로 저장 (나중에 필요하면 사용)
  const currentHash = window.location.hash;
  
  genreForm.style.cssText = `display: inline-block; margin: 0;`;
    // 셀렉트 박스 생성 (직접 URL 이동 방식으로 변경)
  const genreSelect = document.createElement('select');
  genreSelect.name = 'genre';
  genreSelect.className = 'genre-select direct-submit'; // 직접 이동 방식 표시
  genreSelect.style.cssText = `
    background-color: #333;
    color: white;
    padding: 10px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    appearance: none;
    -webkit-appearance: none;
    min-width: 150px;
    text-align: left;
    position: relative;
    z-index: 100;
  `;
  
  // 기본 옵션
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '장르 선택';
  defaultOption.selected = true;
  genreSelect.appendChild(defaultOption);  // 스타일 추가
  if (!document.getElementById('genre-select-styles')) {
    const style = document.createElement('style');
    style.id = 'genre-select-styles';
    style.textContent = `
      .genre-select {
        background-color: #333;
        color: white;
      }
      .genre-select:hover, .genre-select:focus {
        background-color: #444;
      }
      .genre-select option {
        background-color: #222;
        padding: 10px;
        font-size: 15px;
      }
      .genre-select option:hover {
        background-color: #444;
      }
      .genre-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: white;
      }
    `;
    document.head.appendChild(style);
  }
  
  // 화살표 아이콘 (select 박스 스타일링용)
  const genreIcon = document.createElement('span');
  genreIcon.className = 'genre-icon';
  genreIcon.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `;
  genreIcon.style.cssText = `
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: white;
  `;
    // 장르 옵션 추가
  const genres = [
    '드라마', '예능/오락', '키즈/어린이', '액션/무협', '애니메이션',
    '시사/교양', '로맨스', '공포/스릴러', '코미디', '다큐/교양',
    'SF/판타지', '스포츠', '건강/생활정보', '교육/학습', '음악/공연', '기타'
  ];
  
  // 현재 선택된 장르 확인
  const urlParams = new URLSearchParams(window.location.search);
  const currentGenre = urlParams.get('genre') || '';
  
  // 옵션 생성
  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    
    // 현재 선택된 장르면 선택 상태로 설정
    if (genre === currentGenre) {
      option.selected = true;
    }
    
    genreSelect.appendChild(option);
  });
    // 이벤트 리스너: 직접 URL 구성하여 이동
  const handleSelectChange = function() {
    if (genreSelect.value) {
      const selectedGenre = genreSelect.value;
      const currentPathClean = window.location.pathname.split('#')[0];
      
      // 완전한 URL 직접 구성 (해시 없음)
      const newUrl = `${currentPathClean}?genre=${encodeURIComponent(selectedGenre)}`;
      
      console.log(`장르 ${selectedGenre} 선택됨 - 직접 URL로 이동: ${newUrl}`);
      
      // 페이지 이동 (폼 제출 대신)
      window.location.href = newUrl;
    }
  };
  
  // 변경 이벤트에 리스너 연결
  genreSelect.addEventListener('change', handleSelectChange);
  
  // 리스너 추적 (나중에 정리할 수 있도록)
  window.oldGenreListeners.push({
    element: genreSelect,
    type: 'change',
    listener: handleSelectChange
  });
  // 4. 폼 조립
  genreForm.appendChild(genreSelect);
  genreContainer.appendChild(genreForm);
  genreContainer.appendChild(genreIcon);
  
  // 5. DOM에 삽입 (단순화된 방식)
  const header = document.querySelector('header');
  if (header) {
    // 헤더 다음에 삽입
    header.insertAdjacentElement('afterend', genreContainer);
    console.log('장르 선택기가 헤더 다음에 추가됨');
  } else {
    // 헤더가 없으면 body 시작 부분에 삽입
    document.body.insertBefore(genreContainer, document.body.firstChild);
    console.log('장르 선택기가 body 시작 부분에 추가됨');
  }  // 디버깅: 초기화 완료
  console.log('=== 장르 선택 초기화 완료 ===');
  console.log('- 총 장르 옵션 수:', genres.length);
  console.log('- 현재 선택된 장르:', currentGenre || '없음');
  console.log('- 현재 URL:', window.location.href);
  
  // 폼 동작 테스트 (디버깅용)
  console.log('폼 정보:', {
    'action': genreForm.action,
    'method': genreForm.method,
    'select name': genreSelect.name
  });
  
  // 폼 참조를 포함한 객체 반환 (필요시 외부에서 참조 가능)
  return {
    container: genreContainer,
    form: genreForm,
    select: genreSelect
  };
} 