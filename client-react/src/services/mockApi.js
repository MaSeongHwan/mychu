/**
 * Mock API service for development and testing
 * This service provides mock data for when the real API endpoints are not available
 */

// 샘플 드라마 데이터
const sampleDramas = [
  {
    idx: '101',
    asset_nm: '빈센조',
    genre: '범죄',
    poster_path: 'https://via.placeholder.com/300x450?text=Vincenzo',
    rlse_year: '2023'
  },
  {
    idx: '102',
    asset_nm: '이상한 변호사 우영우',
    genre: '법정',
    poster_path: 'https://via.placeholder.com/300x450?text=WooYoungWoo',
    rlse_year: '2022'
  },
  {
    idx: '103',
    asset_nm: '오징어 게임',
    genre: '스릴러',
    poster_path: 'https://via.placeholder.com/300x450?text=SquidGame',
    rlse_year: '2021'
  },
  {
    idx: '104',
    asset_nm: '사랑의 불시착',
    genre: '로맨스',
    poster_path: 'https://via.placeholder.com/300x450?text=CrashLanding',
    rlse_year: '2020'
  },
  {
    idx: '105',
    asset_nm: '더 글로리',
    genre: '드라마',
    poster_path: 'https://via.placeholder.com/300x450?text=TheGlory',
    rlse_year: '2023'
  },
  {
    idx: '106',
    asset_nm: '슬기로운 의사생활',
    genre: '의학',
    poster_path: 'https://via.placeholder.com/300x450?text=HospitalPlaylist',
    rlse_year: '2020'
  }
];

// 샘플 영화 데이터
const sampleMovies = [
  {
    idx: '201',
    asset_nm: '기생충',
    genre: '스릴러',
    poster_path: 'https://via.placeholder.com/300x450?text=Parasite',
    rlse_year: '2019'
  },
  {
    idx: '202',
    asset_nm: '신세계',
    genre: '범죄',
    poster_path: 'https://via.placeholder.com/300x450?text=NewWorld',
    rlse_year: '2013'
  },
  {
    idx: '203',
    asset_nm: '아가씨',
    genre: '로맨스',
    poster_path: 'https://via.placeholder.com/300x450?text=TheHandmaiden',
    rlse_year: '2016'
  },
  {
    idx: '204',
    asset_nm: '7번방의 선물',
    genre: '드라마',
    poster_path: 'https://via.placeholder.com/300x450?text=Miracle',
    rlse_year: '2013'
  }
];

// 샘플 장르 목록
const sampleGenres = [
  { id: 'romance', name: '로맨스' },
  { id: 'thriller', name: '스릴러' },
  { id: 'comedy', name: '코미디' },
  { id: 'crime', name: '범죄' },
  { id: 'drama', name: '드라마' }
];

// Mock API 함수
export const mockApi = {
  /**
   * 드라마 장르 목록 가져오기
   */
  getDramaGenres: () => {
    return Promise.resolve({
      genres: sampleGenres,
      status: 'success'
    });
  },

  /**
   * 특정 장르의 드라마 가져오기
   * @param {string} genreId - 장르 ID
   */
  getDramasByGenre: (genreId) => {
    const filteredDramas = sampleDramas.filter(
      drama => drama.genre.toLowerCase() === genreId.toLowerCase()
    );

    return Promise.resolve({
      dramas: filteredDramas.length > 0 ? filteredDramas : sampleDramas,
      status: 'success'
    });
  },

  /**
   * 콘텐츠 상세 정보 가져오기
   * @param {string} contentId - 콘텐츠 ID
   */
  getContentDetails: (contentId) => {
    const allContent = [...sampleDramas, ...sampleMovies];
    const content = allContent.find(item => item.idx === contentId);

    if (!content) {
      return Promise.reject(new Error('콘텐츠를 찾을 수 없습니다.'));
    }

    return Promise.resolve({
      ...content,
      description: '이것은 해당 콘텐츠에 대한 샘플 설명입니다.',
      rating: 4.5,
      status: 'success'
    });
  }
};

/**
 * API 호출을 위한 래퍼 함수 - 실제 API가 실패하면 mock API로 대체
 * @param {string} endpoint - API 엔드포인트
 * @param {Function} mockFn - 실행할 mock 함수
 * @param {Array} mockArgs - mock 함수에 전달할 인자들
 */
export const tryApiWithMockFallback = async (endpoint, mockFn, mockArgs = []) => {
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`API 호출 실패, mock 데이터 사용: ${endpoint}`, error);
    return mockFn(...mockArgs);
  }
};

export default mockApi;
