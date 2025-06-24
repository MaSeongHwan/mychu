import { API_BASE_URL, ENDPOINTS } from '../api/config.js';

/**
 * 오늘의 인기작 Top10 목록을 가져오는 함수
 * @param {number} limit - 가져올 항목 수
 * @returns {Promise<Array>} - 추천 항목 배열
 */
export async function fetchTopRecs(limit = 10) {
  try {
    console.log(`Fetching top recommendations: ${API_BASE_URL}${ENDPOINTS.recommendations.top}?n=${limit}`);
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.recommendations.top}?n=${limit}`);
    if (!response.ok) {
      console.error(`서버 에러 상태: ${response.status}, URL: ${API_BASE_URL}${ENDPOINTS.recommendations.top}?n=${limit}`);
      throw new Error(`서버 에러: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Top recommendations data:', data);
    return data.items || [];
  } catch (error) {
    console.error('인기 컨텐츠 로드 실패:', error);
    throw error;
  }
}

/**
 * 감정 기반 추천 목록을 가져오는 함수
 * @param {number} limit - 가져올 항목 수
 * @returns {Promise<Array>} - 추천 항목 배열
 */
export async function fetchEmotionRecs(limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.recommendations.emotion}?n=${limit}`);
    if (!response.ok) throw new Error(`서버 에러: ${response.status}`);
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('감정 기반 추천 로드 실패:', error);
    throw error;
  }
}

/**
 * 최근 시청한 콘텐츠 기반 추천 목록을 가져오는 함수
 * @param {number} limit - 가져올 항목 수
 * @returns {Promise<Array>} - 추천 항목 배열
 */
export async function fetchRecentRecs(limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.recommendations.recent}?n=${limit}`);
    if (!response.ok) throw new Error(`서버 에러: ${response.status}`);
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('최근 시청 컨텐츠 로드 실패:', error);
    throw error;
  }
}

/**
 * 추천 카드 슬라이더 컴포넌트 렌더링
 * @param {HTMLElement} container - 슬라이더를 렌더링할 컨테이너 요소
 * @param {Array} items - 추천 콘텐츠 아이템 배열
 */
export function renderSlider(container, items) {
  if (!container || !items || !items.length) {
    console.warn('렌더링을 위한 컨테이너나 데이터가 없습니다.');
    return;
  }
  
  console.log('슬라이더 렌더링 시작:', items.length, '개 항목');
  console.log('첫 번째 항목 상세 정보:', JSON.stringify(items[0]));

  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';
  cardContainer.style.display = 'flex';
  cardContainer.style.gap = '24px';
  cardContainer.style.transition = 'transform 0.3s ease';
  cardContainer.style.width = 'max-content';
    // 각 항목에 대해 카드 생성
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card product-card';
    card.style.minWidth = '200px';
    card.style.maxWidth = '200px';
    card.style.padding = '0';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.background = '#1f2937';
    card.style.border = '1px solid #374151';
    card.style.borderRadius = '1rem';
    card.style.overflow = 'hidden';
    card.style.boxSizing = 'border-box';
    card.style.cursor = 'pointer';  // 클릭 가능함을 나타내는 커서 스타일 추가
    card.style.position = 'relative'; // 링크 오버레이를 위한 포지션 설정
    
    // 고유 ID를 dataset에 추가 (상세 페이지 이동에 필요)
    const contentId = item.id || item.idx || item.asset_idx;
    if (contentId) {
      card.dataset.id = contentId;
    }

    // 이미지 컨테이너
    const imgDiv = document.createElement('div');
    imgDiv.className = 'product-image';
    imgDiv.style.width = '100%';
    imgDiv.style.height = '300px';
    imgDiv.style.aspectRatio = '2/3';

    // 이미지만 추가
    const img = document.createElement('img');
    img.src = item.poster_path || 'https://via.placeholder.com/300x450?text=No+Image';
    img.alt = 'Poster';
    img.loading = 'lazy';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
      imgDiv.appendChild(img);
    card.appendChild(imgDiv);
    
    // 필수 디버깅 정보
    console.log(`카드 생성: contentId=${contentId}, item.id=${item.id}, item.idx=${item.idx}, item.asset_idx=${item.asset_idx}`);
      // ===== 직접 <a> 태그 생성 및 추가 =====
    // 완전히 새로운 접근법: 순수 HTML 기반 태그 생성  
    const contentsLink = document.createElement('a');
    contentsLink.href = `/contents?id=${contentId}`;
    contentsLink.style.position = 'absolute';
    contentsLink.style.top = '0';
    contentsLink.style.left = '0'; 
    contentsLink.style.width = '100%';
    contentsLink.style.height = '100%';
    contentsLink.style.zIndex = '100';
    card.appendChild(contentsLink);
    
    // 디버그를 위한 클릭 이벤트 (링크가 실패할 경우를 대비)
    card.addEventListener('click', function(event) {
      const targetId = contentId || item.id || item.idx || item.asset_idx;
      console.log(`🔗 카드 클릭! 콘텐츠 ${targetId} 상세 페이지로 이동합니다.`);
      // 명시적으로 이동 (링크가 동작하지 않을 경우 백업)
      if (!targetId) {
        console.error('이동할 콘텐츠 ID가 없습니다!');
        return;
      }
      // 기본 링크 동작을 우선하되, 문제 시 직접 이동
      window.location = `/contents?id=${targetId}`;
    });

    cardContainer.appendChild(card);
  });

  // 컨테이너에 카드 추가
  container.innerHTML = '';
  container.appendChild(cardContainer);
  
  // 슬라이더 콘텐츠가 로드되었음을 알리는 커스텀 이벤트 발생
  document.dispatchEvent(new CustomEvent('sliderContentLoaded'));
}

/**
 * 슬라이더 탐색 기능 설정
 * @param {HTMLElement} sliderContainer - 슬라이더 컨테이너
 */
function setupSliderNavigation(sliderContainer) {
  const section = sliderContainer.closest('.section');
  if (!section) return;

  const prevBtn = section.querySelector('.prev-btn');
  const nextBtn = section.querySelector('.next-btn');
  const cardContainer = sliderContainer.querySelector('.card-container');
  
  if (!cardContainer || !prevBtn || !nextBtn) return;
  
  // 이전 버튼 클릭 이벤트
  prevBtn.addEventListener('click', () => {
    cardContainer.scrollBy({ left: -cardContainer.offsetWidth / 2, behavior: 'smooth' });
  });
  
  // 다음 버튼 클릭 이벤트
  nextBtn.addEventListener('click', () => {
    cardContainer.scrollBy({ left: cardContainer.offsetWidth / 2, behavior: 'smooth' });
  });
}