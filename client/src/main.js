import { API_BASE_URL } from './api/config.js';
import { renderSlider } from './components/Slider.js';

/**
 * 현재 콘텐츠 ID에 대한 유사 콘텐츠 추천을 가져오는 함수
 * @param {string|number} contentId - 현재 콘텐츠의 ID (asset_idx)
 * @param {number} limit - 가져올 추천 항목 수
 * @returns {Promise<Array>} - 추천 항목 배열
 */
async function fetchSimilarContent(contentId, limit = 10) {
  try {
    const endpoint = `${API_BASE_URL}${ENDPOINTS.recommendations.similar}/${contentId}?top_n=${limit}`;
    console.log(`유사 콘텐츠 추천 요청: ${endpoint}`);
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      console.error(`유사 콘텐츠 추천 API 에러: ${response.status}`);
      throw new Error(`서버 에러: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('유사 콘텐츠 추천 데이터:', data);
    
    // API 응답 형식에 따라 items 또는 데이터 배열 자체를 반환
    return data.recommendations || data || [];
  } catch (error) {
    console.error('유사 콘텐츠 추천 로드 실패:', error);
    return [];
  }
}

/**
 * URL에서 콘텐츠 ID를 추출하는 함수
 * @returns {string|null} 콘텐츠 ID 또는 파라미터가 없을 경우 null
 */
function getContentIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

/**
 * 콘텐츠 상세 페이지 초기화 함수
 */
async function initContentDetail() {
  // 콘텐츠 페이지에서만 실행
  if (!window.location.pathname.includes('/contents')) {
    return;
  }
  
  const contentId = getContentIdFromUrl();
  if (!contentId) {
    console.error('URL에서 콘텐츠 ID를 찾을 수 없습니다.');
    return;
  }
    // 유사 콘텐츠 추천 로드 및 렌더링
  try {
    const similarContent = await fetchSimilarContent(contentId, 10);
    
    if (similarContent && similarContent.length > 0) {
      // 추천 콘텐츠를 API 응답 형식에 맞게 변환
      const formattedContent = similarContent.map(item => ({
        poster_path: item.poster_path || item.thumb_url,
        asset_nm: item.asset_nm || item.title || '',
        id: item.asset_idx // Slider.js의 createCard 함수는 id를 사용함
      }));
      
      // 유사 콘텐츠 슬라이더 렌더링
      const similarTrack = document.getElementById('similar-track');
      if (similarTrack) {
        renderSlider(similarTrack, formattedContent);
      }
    } else {
      console.log('유사 콘텐츠 추천 결과가 없습니다.');
      // 에러 메시지 표시 또는 대체 콘텐츠 표시 로직
    }
  } catch (error) {
    console.error('유사 콘텐츠 추천 처리 중 오류 발생:', error);
  }
}

// 페이지 로드 시 초기화 함수 실행
document.addEventListener('DOMContentLoaded', initContentDetail);
