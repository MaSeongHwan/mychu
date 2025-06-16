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
 * 슬라이더에 콘텐츠를 렌더링하는 함수
 * @param {HTMLElement} container - 슬라이더 컨테이너 요소
 * @param {Array} items - 렌더링할 콘텐츠 항목 배열
 */
export function renderSlider(container, items) {
  if (!container) {
    console.error('슬라이더 컨테이너를 찾을 수 없습니다.');
    return;
  }

  // 기존 에러 메시지 숨기기
  const errorMessage = container.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.style.display = 'none';
  }

  // 항목이 없으면 에러 메시지 표시
  if (!items || items.length === 0) {
    if (errorMessage) {
      errorMessage.style.display = 'block';
      errorMessage.textContent = '추천 콘텐츠가 없습니다.';
    }
    return;
  }

  // 카드 컨테이너 생성
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';
  
  // 각 항목에 대해 카드 생성
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = item.asset_idx;

    // 이미지 추가
    const img = document.createElement('img');
    img.src = item.poster_path || 'https://via.placeholder.com/300x450?text=No+Image';
    img.alt = item.asset_nm || 'No title';
    img.loading = 'lazy';
    card.appendChild(img);

    // 카드 정보 추가
    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = item.asset_nm || 'Unknown';
    cardInfo.appendChild(title);

    // 추가 정보 (장르, 연도 등) 표시
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = [
      item.genre || '',
      item.release_year ? `${item.release_year}` : ''
    ].filter(Boolean).join(' · ');
    
    if (meta.textContent) {
      cardInfo.appendChild(meta);
    }

    card.appendChild(cardInfo);
    
    // 카드 클릭 이벤트
    card.addEventListener('click', () => {
      if (item.asset_idx) {
        window.location.href = `/contents?id=${item.asset_idx}`;
      }
    });

    cardContainer.appendChild(card);
  });

  // 컨테이너에 카드 추가
  container.innerHTML = '';
  container.appendChild(cardContainer);
  
  // 필요하다면 슬라이더 네비게이션 이벤트 등록
  setupSliderNavigation(container);
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
