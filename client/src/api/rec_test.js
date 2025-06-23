import {
  fetchTopRecs,
  fetchEmotionRecs,
  fetchRecentRecs,
  renderSlider
} from '../components/Recommendations.js';

/**
 * 추천 슬라이더 초기화 함수
 * HTML에서 정의된 제목과 함께 슬라이더 컨텐츠를 채웁니다.
 */
export async function initRecommendations() {
  // 오늘의 인기작
  try {
    const topItems = await fetchTopRecs(10);
    renderSlider(document.getElementById('top-slider'), topItems);
  } catch {
    document.querySelector('#top-slider .error-message').style.display = 'block';
  }

  // 개인화된 힐링 추천
  try {
    const emoItems = await fetchEmotionRecs(10);
    renderSlider(document.getElementById('emotion-slider'), emoItems);
  } catch {
    document.querySelector('#emotion-slider .error-message').style.display = 'block';
  }

  // 최근 시청 콘텐츠
  try {
    const recentItems = await fetchRecentRecs(10);
    renderSlider(document.getElementById('recent-slider'), recentItems);
  } catch {
    document.querySelector('#recent-slider .error-message').style.display = 'block';
  }
}