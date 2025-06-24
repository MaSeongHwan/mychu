import { API_BASE_URL } from './config.js';
import { renderSlider } from '../components/Recommendations.js';

/**
 * API 응답 데이터에서 필요한 필드만 추출하고 ID 필드를 통합하는 함수
 * @param {Array} items - API에서 받은 콘텐츠 배열
 * @returns {Array} 필수 필드를 포함한 배열
 */
function filterPosterPathOnly(items) {
  return items.map(item => {
    const contentId = item.idx || item.asset_idx || item.id || null;
    return {
      poster_path: item.poster_path || '',
      asset_idx: contentId,
      id: contentId,  // 상세 페이지 이동을 위한 id 필드 추가
      asset_nm: item.asset_nm || '' // 제목 정보도 유지
    };
  });
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
 * main.html용 전체 콘텐츠 추천 API를 사용하여 모든 슬라이더를 초기화하는 함수
 */
export async function initRecommendationsForMain() {
  console.log('main.html용 전체 콘텐츠 추천 API로 슬라이더 초기화 시작');
  
  // 오늘의 인기작 슬라이더 초기화 - popular 엔드포인트 사용
  try {
    console.log(`인기 콘텐츠 추천 엔드포인트 호출: ${API_BASE_URL}/recommendation/popular?n=10&is_adult=false`);
    const topResponse = await fetch(`${API_BASE_URL}/recommendation/popular?n=10&is_adult=false`);
    
    if (!topResponse.ok) {
      console.error(`인기 콘텐츠 추천 API 에러: ${topResponse.status}`);
      throw new Error(`서버 에러: ${topResponse.status}`);
    }

    const topData = await topResponse.json();
    console.log('인기 콘텐츠 추천 데이터:', topData);
    
    const topItems = topData.items || [];
    if (topItems.length > 0) {
      const filteredTopItems = filterPosterPathOnly(topItems);
      renderSlider(document.getElementById('top-slider'), filteredTopItems);
    } else {
      document.querySelector('#top-slider .error-message').style.display = 'block';
      document.querySelector('#top-slider .error-message').textContent = '추천 콘텐츠가 없습니다.';
    }
  } catch (error) {
    console.error('인기 콘텐츠 추천 데이터 로드 실패:', error);
    document.querySelector('#top-slider .error-message').style.display = 'block';
  }

  // 감정 기반 추천 슬라이더 초기화 - 코미디/힐링 장르로 필터링
  try {
    console.log(`감정 기반 추천 엔드포인트 호출: ${API_BASE_URL}/recommendation/test?n=10&is_main=true&genre=코미디`);
    const emoResponse = await fetch(`${API_BASE_URL}/recommendation/test?n=10&is_main=true&genre=코미디`);
    
    if (!emoResponse.ok) {
      console.error(`감정 기반 추천 API 에러: ${emoResponse.status}`);
      throw new Error(`서버 에러: ${emoResponse.status}`);
    }

    const emoData = await emoResponse.json();
    console.log('감정 기반 추천 데이터:', emoData);
    
    const emoItems = emoData.items || [];
    if (emoItems.length > 0) {
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

  // 최근 시청 콘텐츠 슬라이더 초기화 - recent 엔드포인트 사용
  try {
    console.log(`최근 시청 콘텐츠 엔드포인트 호출: ${API_BASE_URL}/recommendation/recent?n=8`);
    const recentResponse = await fetch(`${API_BASE_URL}/recommendation/recent?n=8`);
    
    if (!recentResponse.ok) {
      console.error(`최근 시청 콘텐츠 API 에러: ${recentResponse.status}`);
      throw new Error(`서버 에러: ${recentResponse.status}`);
    }

    const recentData = await recentResponse.json();
    console.log('최근 시청 콘텐츠 데이터:', recentData);
    
    const recentItems = recentData.items || [];
    if (recentItems.length > 0) {
      const filteredRecentItems = filterPosterPathOnly(recentItems);
      renderSlider(document.getElementById('recent-slider'), filteredRecentItems);
    } else {
      document.querySelector('#recent-slider .error-message').style.display = 'block';
      document.querySelector('#recent-slider .error-message').textContent = '추천 콘텐츠가 없습니다.';
    }
  } catch (error) {
    console.error('최근 시청 콘텐츠 데이터 로드 실패:', error);
    document.querySelector('#recent-slider .error-message').style.display = 'block';
  }
  
  console.log('main.html용 모든 슬라이더 초기화 완료');
}

/**
 * drama.html용 드라마 전용 추천 API를 사용하여 모든 슬라이더를 초기화하는 함수
 */
export async function initRecommendationsForDrama() {
  console.log('drama.html용 드라마 전용 추천 API로 슬라이더 초기화 시작');
  
  // 오늘의 인기 드라마 슬라이더 초기화 - popular 엔드포인트 사용
  try {
    console.log(`인기 드라마 추천 엔드포인트 호출: ${API_BASE_URL}/recommendation/popular?n=10&is_adult=false&is_movie=false&is_drama=true`);
    const topResponse = await fetch(`${API_BASE_URL}/recommendation/popular?n=10&is_adult=false&is_movie=false&is_drama=true`);
    
    if (!topResponse.ok) {
      console.error(`인기 드라마 추천 API 에러: ${topResponse.status}`);
      throw new Error(`서버 에러: ${topResponse.status}`);
    }

    const topData = await topResponse.json();
    console.log('인기 드라마 추천 데이터:', topData);
    
    const topItems = topData.items || [];
    if (topItems.length > 0) {
      const filteredTopItems = filterPosterPathOnly(topItems);
      renderSlider(document.getElementById('top-slider'), filteredTopItems);
    } else {
      document.querySelector('#top-slider .error-message').style.display = 'block';
      document.querySelector('#top-slider .error-message').textContent = '추천 드라마가 없습니다.';
    }
  } catch (error) {
    console.error('인기 드라마 추천 데이터 로드 실패:', error);
    document.querySelector('#top-slider .error-message').style.display = 'block';
  }

  // 감정 기반 추천 슬라이더 초기화 - 드라마 장르로 필터링
  try {
    console.log(`감정 기반 드라마 추천 엔드포인트 호출: ${API_BASE_URL}/recommendation/test?n=10&is_main=true&is_movie=false&is_drama=true&genre=로맨스`);
    const emoResponse = await fetch(`${API_BASE_URL}/recommendation/test?n=10&is_main=true&is_movie=false&is_drama=true&genre=로맨스`);
    
    if (!emoResponse.ok) {
      console.error(`감정 기반 드라마 추천 API 에러: ${emoResponse.status}`);
      throw new Error(`서버 에러: ${emoResponse.status}`);
    }

    const emoData = await emoResponse.json();
    console.log('감정 기반 드라마 추천 데이터:', emoData);
    
    const emoItems = emoData.items || [];
    if (emoItems.length > 0) {
      const filteredEmoItems = filterPosterPathOnly(emoItems);
      renderSlider(document.getElementById('emotion-slider'), filteredEmoItems);
    } else {
      document.querySelector('#emotion-slider .error-message').style.display = 'block';
      document.querySelector('#emotion-slider .error-message').textContent = '추천 드라마가 없습니다.';
    }
  } catch (error) {
    console.error('감정 기반 드라마 추천 데이터 로드 실패:', error);
    document.querySelector('#emotion-slider .error-message').style.display = 'block';
  }

  // 최근 시청 드라마 슬라이더 초기화 - recent 엔드포인트 사용
  try {
    console.log(`최근 시청 드라마 엔드포인트 호출: ${API_BASE_URL}/recommendation/recent?n=8&is_movie=false&is_drama=true`);
    const recentResponse = await fetch(`${API_BASE_URL}/recommendation/recent?n=8&is_movie=false&is_drama=true`);
    
    if (!recentResponse.ok) {
      console.error(`최근 시청 드라마 API 에러: ${recentResponse.status}`);
      throw new Error(`서버 에러: ${recentResponse.status}`);
    }

    const recentData = await recentResponse.json();
    console.log('최근 시청 드라마 데이터:', recentData);
    
    const recentItems = recentData.items || [];
    if (recentItems.length > 0) {
      const filteredRecentItems = filterPosterPathOnly(recentItems);
      renderSlider(document.getElementById('recent-slider'), filteredRecentItems);
    } else {
      document.querySelector('#recent-slider .error-message').style.display = 'block';
      document.querySelector('#recent-slider .error-message').textContent = '추천 드라마가 없습니다.';
    }
  } catch (error) {
    console.error('최근 시청 드라마 데이터 로드 실패:', error);
    document.querySelector('#recent-slider .error-message').style.display = 'block';
  }
  
  console.log('drama.html용 모든 슬라이더 초기화 완료');
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

/**
 * 여러 추천 엔드포인트를 병렬로 호출하는 최적화된 함수
 * @param {Array<string>} types - 호출할 추천 유형 배열 ('popular', 'emotion', 'recent', 'test' 등)
 * @param {Object} options - 각 호출에 대한 추가 옵션
 * @returns {Promise<Object>} - 각 유형별 결과가 담긴 객체
 */
export async function fetchMultipleRecommendations(types = ['popular', 'emotion', 'recent'], options = {}) {
  console.log(`병렬로 ${types.length}개의 추천 데이터 요청 시작`);
  console.time('parallel-recommendations');
  
  // 기본 옵션
  const defaultOptions = {
    n: 10,
    is_adult: false,
    is_main: true
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // 각 타입별 URL 생성
  function getUrlForType(type) {
    const baseUrl = `${API_BASE_URL}/recommendation/`;
    const params = new URLSearchParams();
    
    // 기본 파라미터 추가
    params.append('n', mergedOptions.n);
    
    // 타입별 경로 및 추가 파라미터 설정
    switch(type) {
      case 'popular':
        params.append('is_adult', mergedOptions.is_adult);
        return `${baseUrl}popular?${params.toString()}`;
      case 'emotion':
        params.append('is_main', mergedOptions.is_main);
        params.append('genre', '코미디');
        return `${baseUrl}test?${params.toString()}`;
      case 'recent':
        return `${baseUrl}recent?${params.toString()}`;
      case 'test':
        params.append('is_main', mergedOptions.is_main);
        return `${baseUrl}test?${params.toString()}`;
      default:
        return `${baseUrl}${type}?${params.toString()}`;
    }
  }
  
  try {
    // 모든 추천 요청을 병렬로 실행
    const fetchPromises = types.map(type => {
      return fetch(getUrlForType(type))
        .then(response => {
          if (!response.ok) {
            console.error(`${type} 추천 API 에러: ${response.status}`);
            return { error: `서버 에러: ${response.status}` };
          }
          return response.json();
        })        .then(data => {
          // 필요한 필드를 유지하며 처리
          const items = data.items || [];
          if (type === 'popular') {
            console.log('인기 콘텐츠 데이터 샘플:', items.length > 0 ? items[0] : '없음');
          }
          return filterPosterPathOnly(items);
        })
        .catch(error => {
          console.error(`${type} 추천 데이터 로드 중 오류:`, error);
          return [];
        });
    });
    
    // 병렬로 모든 요청 처리
    const results = await Promise.all(fetchPromises);
    
    // 결과를 유형별로 매핑
    const resultMap = {};
    types.forEach((type, index) => {
      resultMap[type] = results[index];
    });
    
    console.timeEnd('parallel-recommendations');
    console.log('병렬 추천 데이터 요청 완료:', resultMap);
    
    return resultMap;
  } catch (error) {
    console.error('병렬 추천 데이터 요청 중 오류 발생:', error);
    console.timeEnd('parallel-recommendations');
    throw error;
  }
}
