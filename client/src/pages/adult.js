import { initializeUserMenu, setupLogout } from '/src/components/UserMenu.js';
import { initializeSearch } from '/src/components/Search.js';
import { initDropdown } from '/src/components/Dropdown.js';

document.addEventListener('DOMContentLoaded', function() {
  console.log('성인관 페이지 DOM 로드 완료, 초기화 시작');
  
  // 향상된 검색 기능 초기화 - 자동완성 포함
  initializeSearch();
  console.log('검색 초기화 완료');

  // 사용자 메뉴 초기화
  initializeUserMenu();
  setupLogout();

  // 드롭다운 초기화
  initDropdown();
  console.log('드롭다운 초기화 완료');

  // 성인관 페이지 전용 기능들
  initAdultPageFeatures();
  console.log('성인관 페이지 기능 초기화 완료');
});

function initAdultPageFeatures() {
  // 슬라이더 초기화 함수
  function initSlider(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const slider = section.querySelector('.slider');
    const prevBtn = section.querySelector('.prev-btn');
    const nextBtn = section.querySelector('.next-btn');
    
    if (!slider || !prevBtn || !nextBtn) return;

    let currentPosition = 0;
    const cardWidth = 200; // 카드 기본 너비
    const cardGap = 16; // 카드 간격
    const cardsPerView = Math.floor(window.innerWidth / (cardWidth + cardGap));
    
    // 제공된 이미지 링크들
    const imageUrls = [
      'https://postfiles.pstatic.net/MjAyNTA2MThfODQg/MDAxNzUwMjE2MjQ5ODA0.-PxedGvLKzmDaTYGYx61lEpIFJ5N6wINuO3FCopjtIIg.eusuqu161SSZioPOpAwtNHLKh9r_ZsFBZgZXbxi36EIg.PNG/180.png?type=w773',
      'https://postfiles.pstatic.net/MjAyNTA2MThfOTIg/MDAxNzUwMjE2MjQ5NzQx.uMZ7SZaof0QEtnQ_f27rwrEC9agWbuWBtrjwICpmHIMg.kvvgDxGaBgimAicX5UkFl2zqD_pREvUteYClYBhf4_cg.PNG/190.png?type=w773',
      'https://postfiles.pstatic.net/MjAyNTA2MThfMjc5/MDAxNzUwMjE2MjQ5NzIz.U4zTW_VWUKcBzHiIdVcxKVWcIsZg04JadVrlxbB-aqkg._Sa7J8N-1-cD8G4kWBSl2sYiAxWV0vxEmDN05GqITTAg.PNG/200.png?type=w773'
    ];
    
    // 더미 데이터 생성 (이미지 링크 포함)
    const dummyData = [
      { title: '나는 성인물', year: '2024', country: '한국', rank: 1, image: imageUrls[0] },
      { title: '나는 성인물2', year: '2024', country: '한국', rank: 2, image: imageUrls[1] },
      { title: '나는 성인물3', year: '2024', country: '한국', rank: 3, image: imageUrls[2] },
      { title: '나는 성인물4', year: '2024', country: '한국', rank: 4, image: imageUrls[0] },
      { title: '나는 성인물5', year: '2024', country: '한국', rank: 5, image: imageUrls[1] },
      { title: '나는 성인물6', year: '2024', country: '한국', rank: 6, image: imageUrls[2] },
      { title: '나는 성인물7', year: '2024', country: '한국', rank: 7, image: imageUrls[0] },
      { title: '나는 성인물8', year: '2024', country: '한국', rank: 8, image: imageUrls[1] },
      { title: '나는 성인물9', year: '2024', country: '한국', rank: 9, image: imageUrls[2] },
      { title: '나는 성인물10', year: '2024', country: '한국', rank: 10, image: imageUrls[0] }
    ];

    // 카드 컨테이너 생성
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    
    // 카드들 생성
    dummyData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      
      const rankBadge = sectionId === 'top10-section' ? `<div class="rank-badge">${item.rank}</div>` : '';
      
      card.innerHTML = `
        ${rankBadge}
        <img src="${item.image}" alt="${item.title}" class="card-image">
        <div class="card-info">
          <h3 class="card-title">${item.title}</h3>
          <div class="card-meta">
            <span class="card-year">${item.year}</span>
            <span class="card-country">${item.country}</span>
          </div>
        </div>
      `;
      
      cardContainer.appendChild(card);
    });
    
    // 에러 메시지 제거하고 카드 컨테이너 추가
    const errorMessage = slider.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
    slider.appendChild(cardContainer);

    // 슬라이더 컨트롤 기능
    const maxPosition = -(dummyData.length - cardsPerView) * (cardWidth + cardGap);

    function updateSliderPosition() {
      cardContainer.style.transform = `translateX(${currentPosition}px)`;
    }

    prevBtn.addEventListener('click', () => {
      currentPosition = Math.min(currentPosition + (cardWidth + cardGap), 0);
      updateSliderPosition();
    });

    nextBtn.addEventListener('click', () => {
      currentPosition = Math.max(currentPosition - (cardWidth + cardGap), maxPosition);
      updateSliderPosition();
    });

    // 반응형 대응
    window.addEventListener('resize', () => {
      const newCardsPerView = Math.floor(window.innerWidth / (cardWidth + cardGap));
      const newMaxPosition = -(dummyData.length - newCardsPerView) * (cardWidth + cardGap);
      
      currentPosition = Math.max(currentPosition, newMaxPosition);
      updateSliderPosition();
    });
  }

  // 슬라이더들 초기화
  initSlider('top10-section');
  initSlider('latest-section');

  // 무한 스크롤 구현
  let page = 1;
  const itemsPerPage = 8;
  let isLoading = false;
  const loadingIndicator = document.getElementById('loading-indicator');
  const contentGrid = document.getElementById('content-grid');
  
  // 제공된 이미지 링크들
  const imageUrls = [
    'https://postfiles.pstatic.net/MjAyNTA2MThfODQg/MDAxNzUwMjE2MjQ5ODA0.-PxedGvLKzmDaTYGYx61lEpIFJ5N6wINuO3FCopjtIIg.eusuqu161SSZioPOpAwtNHLKh9r_ZsFBZgZXbxi36EIg.PNG/180.png?type=w773',
    'https://postfiles.pstatic.net/MjAyNTA2MThfOTIg/MDAxNzUwMjE2MjQ5NzQx.uMZ7SZaof0QEtnQ_f27rwrEC9agWbuWBtrjwICpmHIMg.kvvgDxGaBgimAicX5UkFl2zqD_pREvUteYClYBhf4_cg.PNG/190.png?type=w773',
    'https://postfiles.pstatic.net/MjAyNTA2MThfMjc5/MDAxNzUwMjE2MjQ5NzIz.U4zTW_VWUKcBzHiIdVcxKVWcIsZg04JadVrlxbB-aqkg._Sa7J8N-1-cD8G4kWBSl2sYiAxWV0vxEmDN05GqITTAg.PNG/200.png?type=w773'
  ];
  
  function generateContentItems(count) {
    const items = [];
    const titles = [
      '나는 성인물', '나는 성인물2', '나는 성인물3', '나는 성인물4', 
      '나는 성인물5', '나는 성인물6', '나는 성인물7', '나는 성인물8',
      '나는 성인물9', '나는 성인물10', '나는 성인물11', '나는 성인물12',
      '나는 성인물13', '나는 성인물14', '나는 성인물15', '나는 성인물16'
    ];
    
    for (let i = 0; i < count; i++) {
      const item = document.createElement('div');
      item.className = 'content-item';
      const titleIndex = ((page - 1) * count + i) % titles.length;
      const title = titles[titleIndex];
      const year = 2018 + Math.floor(Math.random() * 6);
      const imageIndex = i % imageUrls.length; // 이미지를 순환하여 사용
      
      item.innerHTML = `
        <div class="item-poster">
          <img src="${imageUrls[imageIndex]}" alt="${title}" class="poster-image">
          <div class="item-overlay">
            <button class="play-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
            <button class="wishlist-btn" title="찜하기">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="item-info">
          <h3 class="item-title">${title}</h3>
          <div class="item-meta">
            <span class="item-year">${year}</span>
            <span class="item-country">한국</span>
          </div>
        </div>
      `;
      items.push(item);
    }
    return items;
  }

  // 초기 콘텐츠 로드
  if (contentGrid) {
    const initialItems = generateContentItems(itemsPerPage);
    initialItems.forEach(item => contentGrid.appendChild(item));

    // 스크롤 이벤트 처리
    window.addEventListener('scroll', function() {
      if (isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        isLoading = true;
        if (loadingIndicator) {
          loadingIndicator.style.display = 'flex';
        }
        
        // 새로운 콘텐츠 로드 시뮬레이션
        setTimeout(() => {
          page++;
          const newItems = generateContentItems(itemsPerPage);
          newItems.forEach(item => contentGrid.appendChild(item));
          
          isLoading = false;
          if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
          }
        }, 1000);
      }
    });

    // 콘텐츠 아이템 클릭 이벤트
    document.addEventListener('click', function(e) {
      if (e.target.closest('.content-item') && !e.target.closest('.play-btn') && !e.target.closest('.wishlist-btn')) {
        const title = e.target.closest('.content-item').querySelector('.item-title').textContent;
        alert(`${title} 상세페이지로 이동합니다.`);
      }
      
      if (e.target.closest('.play-btn')) {
        e.stopPropagation();
        const title = e.target.closest('.content-item').querySelector('.item-title').textContent;
        alert(`${title} 재생을 시작합니다.`);
      }
      
      if (e.target.closest('.wishlist-btn')) {
        e.stopPropagation();
        const btn = e.target.closest('.wishlist-btn');
        const title = btn.closest('.content-item').querySelector('.item-title').textContent;
        const svg = btn.querySelector('svg');
        
        if (svg.getAttribute('fill') === 'currentColor') {
          svg.setAttribute('fill', 'none');
          btn.style.color = '';
          alert(`${title}을(를) 찜 목록에서 제거했습니다.`);
        } else {
          svg.setAttribute('fill', 'currentColor');
          btn.style.color = '#10b981';
          alert(`${title}을(를) 찜 목록에 추가했습니다.`);
        }
      }
    });
  }

  // 뷰 토글 기능
  const viewBtns = document.querySelectorAll('.view-btn');
  if (contentGrid) {
    viewBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        viewBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const view = this.getAttribute('data-view');
        if (view === 'list') {
          contentGrid.classList.add('list-view');
        } else {
          contentGrid.classList.remove('list-view');
        }
      });
    });
  }

  // 필터 변경 이벤트
  const filterSelects = document.querySelectorAll('.filter-select');
  filterSelects.forEach(select => {
    select.addEventListener('change', function() {
      console.log(`${this.previousElementSibling.textContent}: ${this.value}`);
      // 여기에 필터링 로직 구현
    });
  });
} 