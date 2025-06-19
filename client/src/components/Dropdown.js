// client/src/components/Dropdown.js

export function initDropdown() {
  // 이미 있으면 중복 생성 방지
  if (document.querySelector('.dropdown-container')) return;

  // 1. 드롭다운 컨테이너 생성
  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'dropdown-container';

  // 2. 드롭다운 버튼 생성
  const dropdownBtn = document.createElement('button');
  dropdownBtn.className = 'dropdown-btn';
  dropdownBtn.innerHTML = `장르 
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>`;

  // 3. 드롭다운 콘텐츠 생성
  const dropdownContent = document.createElement('div');
  dropdownContent.className = 'dropdown-content';
  const genres = [
    '드라마', '예능/오락', '키즈/어린이', '액션/무협', '애니메이션',
    '시사/교양', '로맨스', '공포/스릴러', '코미디', '다큐/교양',
    'SF/판타지', '스포츠', '건강/생활정보', '교육/학습', '음악/공연', '기타'
  ];
  genres.forEach(genre => {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = genre;
    dropdownContent.appendChild(a);
  });

  // 4. 조립
  dropdownContainer.appendChild(dropdownBtn);
  dropdownContainer.appendChild(dropdownContent);

  // 5. DOM에 삽입 (헤더 아래, body 최상단 등 원하는 위치)
  const header = document.querySelector('header');
  if (header) {
    header.insertAdjacentElement('afterend', dropdownContainer);
  } else {
    document.body.insertBefore(dropdownContainer, document.body.firstChild);
  }

  // 6. 이벤트 등록
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownContent.classList.toggle('show');
  });

  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener('click', function(event) {
    if (!dropdownContainer.contains(event.target)) {
      dropdownContent.classList.remove('show');
    }
  });
} 