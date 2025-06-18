import { API_BASE_URL } from './config.js';
import { renderSlider } from '../components/Recommendations.js';

/**
 * API 응답 데이터에서 poster_path와 asset_idx만 남기고 나머지 필드들을 제거하는 함수
 * @param {Array} items - API에서 받은 콘텐츠 배열
 * @returns {Array} poster_path와 asset_idx만 포함된 배열
 */
function filterPosterPathOnly(items) {
  return items.map(item => ({
    poster_path: item.poster_path,
    asset_idx: item.asset_idx
  }));
}

/**
 * Hero 슬라이더용 영화 데이터를 가져오는 함수
 * @returns {Promise<Array>} Hero 슬라이더에 표시할 영화 데이터 배열
 */
export async function getHeroMovies() {
  try {
    console.log(`Hero 슬라이더용 영화 데이터 요청: ${API_BASE_URL}/recommendation/test?n=5&is_movie=true&is_main=true`);
    const response = await fetch(`${API_BASE_URL}/recommendation/test?n=5&is_movie=true&is_main=true`);
    
    if (!response.ok) {
      console.error(`Hero 슬라이더 API 에러: ${response.status}`);
      throw new Error(`서버 에러: ${response.status}`);
    }

    const data = await response.json();
    console.log('Hero 슬라이더 영화 데이터:', data);
    
    return data.items || [];
  } catch (error) {
    console.error('Hero 슬라이더 영화 데이터 로드 실패:', error);
    return [];
  }
}

/**
 * 테스트 추천 API를 사용하여 모든 슬라이더를 초기화하는 함수
 * 각 슬라이더마다 다른 파라미터로 API를 호출하여 서로 다른 콘텐츠를 표시
 * 영화 데이터만 가져오도록 is_movie=true 파라미터 추가
 */
export async function initRecommendationsWithTest() {
  console.log('테스트 추천 API로 슬라이더 초기화 시작 (영화 데이터만)');
    // 오늘의 인기작 슬라이더 초기화 - popular 엔드포인트 사용, 영화만
  try {
    console.log(`인기 영화 추천 엔드포인트 호출: ${API_BASE_URL}/recommendation/popular?n=10&is_adult=false&is_movie=true`);
    const topResponse = await fetch(`${API_BASE_URL}/recommendation/popular?n=10&is_adult=false&is_movie=true`);
    
    if (!topResponse.ok) {
      console.error(`인기 영화 추천 API 에러: ${topResponse.status}`);
      throw new Error(`서버 에러: ${topResponse.status}`);
    }

    const topData = await topResponse.json();
    console.log('인기 영화 추천 데이터:', topData);
    
    const topItems = topData.items || [];
    if (topItems.length > 0) {
      // poster_path만 필터링
      const filteredTopItems = filterPosterPathOnly(topItems);
      renderSlider(document.getElementById('top-slider'), filteredTopItems);
    } else {
      document.querySelector('#top-slider .error-message').style.display = 'block';
      document.querySelector('#top-slider .error-message').textContent = '추천 영화가 없습니다.';
    }
  } catch (error) {
    console.error('인기 영화 추천 데이터 로드 실패:', error);
    document.querySelector('#top-slider .error-message').style.display = 'block';
  }
    // 감정 기반 추천 슬라이더 초기화 - 코미디/힐링 장르로 필터링, 영화만
  try {
    console.log(`테스트 추천 엔드포인트 호출 - 감정 기반: ${API_BASE_URL}/recommendation/test?n=10&is_main=true&is_movie=true&genre=코미디`);
    const emoResponse = await fetch(`${API_BASE_URL}/recommendation/test?n=10&is_main=true&is_movie=true&genre=코미디`);
    
    if (!emoResponse.ok) {
      console.error(`감정 기반 추천 API 에러: ${emoResponse.status}`);
      throw new Error(`서버 에러: ${emoResponse.status}`);
    }

    const emoData = await emoResponse.json();
    console.log('감정 기반 추천 데이터:', emoData);
    
    const emoItems = emoData.items || [];
    if (emoItems.length > 0) {
      // poster_path만 필터링
      const filteredEmoItems = filterPosterPathOnly(emoItems);
      renderSlider(document.getElementById('emotion-slider'), filteredEmoItems);
    } else {
      document.querySelector('#emotion-slider .error-message').style.display = 'block';
      document.querySelector('#emotion-slider .error-message').textContent = '추천 콘텐츠가 없습니다.';
    }
  } catch (error) {
    console.error('감정 기반 추천 데이터 로드 실패:', error);
    document.querySelector('#emotion-slider .error-message').style.display = 'block';
  }
    // 최근 시청 콘텐츠 슬라이더 초기화 - 드라마 장르로 필터링, 영화만
  try {
    console.log(`테스트 추천 엔드포인트 호출 - 최근 시청: ${API_BASE_URL}/recommendation/test?n=8&is_movie=true&genre=드라마`);
    const recentResponse = await fetch(`${API_BASE_URL}/recommendation/test?n=8&is_movie=true&genre=드라마`);
    
    if (!recentResponse.ok) {
      console.error(`최근 시청 추천 API 에러: ${recentResponse.status}`);
      throw new Error(`서버 에러: ${recentResponse.status}`);
    }

    const recentData = await recentResponse.json();
    console.log('최근 시청 추천 데이터:', recentData);
    
    const recentItems = recentData.items || [];
    if (recentItems.length > 0) {
      // poster_path만 필터링
      const filteredRecentItems = filterPosterPathOnly(recentItems);
      renderSlider(document.getElementById('recent-slider'), filteredRecentItems);
    } else {
      document.querySelector('#recent-slider .error-message').style.display = 'block';
      document.querySelector('#recent-slider .error-message').textContent = '추천 콘텐츠가 없습니다.';
    }
  } catch (error) {
    console.error('최근 시청 추천 데이터 로드 실패:', error);
    document.querySelector('#recent-slider .error-message').style.display = 'block';
  }
  
  console.log('모든 슬라이더 초기화 완료 (영화 데이터만)');
}
