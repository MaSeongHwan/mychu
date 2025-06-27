/**
 * 오늘의 추천 API 서비스
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * 개인화된 오늘의 추천 데이터를 가져옵니다
 * @param {number} userId - 사용자 ID
 * @param {number} count - 가져올 아이템 개수 (기본값: 10)
 * @returns {Promise<Array>} 추천 데이터 배열
 */
export const getTodayRecommendations = async (userId = 1, count = 10) => {
  try {
    console.log(`API 호출 시작: ${API_BASE_URL}/recommendation/today/personalized/${userId}?n=${count}`);
    
    // 네트워크 상태 확인
    if (!navigator.onLine) {
      throw new Error('NETWORK_OFFLINE');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초로 타임아웃 연장

    const response = await fetch(
      `${API_BASE_URL}/recommendation/today/personalized/${userId}?n=${count}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit', // 쿠키 등 인증 정보 제외
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
    console.log('API 응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`API_ERROR_${response.status}`);
    }

    const data = await response.json();
    console.log('API 응답 데이터:', data);
    
    // API 응답 구조에 맞게 데이터 변환
    if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
      const transformedData = data.items.map(item => ({
        idx: item.idx,
        asset_nm: item.asset_nm || item.super_asset_nm || '제목 없음',
        genre: item.genre || '기타',
        poster_path: item.poster_path || 'https://placehold.co/300x450?text=No+Image',
        release_year: item.rlse_year ? String(item.rlse_year).slice(0, 4) : new Date().getFullYear().toString(),
        description: item.smry || item.smry_shrt || '흥미진진한 스토리와 뛰어난 연출로 많은 사랑을 받고 있는 작품입니다.'
      }));
      
      console.log('변환된 데이터:', transformedData);
      return transformedData;
    }

    // API 응답은 성공했지만 데이터가 없는 경우
    console.log('API 응답 성공하지만 데이터가 비어있음 - 샘플 데이터 사용');
    throw new Error('NO_DATA');

  } catch (error) {
    console.error('오늘의 추천 데이터 로드 실패:', error);
    
    // 에러 타입별 로깅
    if (error.name === 'AbortError') {
      console.error('API 요청 타임아웃');
    } else if (error.message === 'NETWORK_OFFLINE') {
      console.error('네트워크 연결 없음');
    } else if (error.message.startsWith('API_ERROR_')) {
      console.error('API 서버 에러:', error.message);
    } else if (error.message === 'NO_DATA') {
      console.error('API에서 데이터를 반환하지 않음');
    } else {
      console.error('알 수 없는 에러:', error.message);
    }
    
    console.log('Fallback 샘플 데이터 사용');
    
    // API 실패 시 fallback 샘플 데이터 반환
    return [
      {
        idx: '1',
        asset_nm: '위험한 관계',
        genre: '드라마',
        poster_path: 'https://image.tmdb.org/t/p/w500/7d8bGBp1CWXfPXmXSbgYHvxsJUs.jpg',
        release_year: '2022',
        description: '욕망과 진실한 사랑의 위험한 관계를 만나보세요'
      },
      {
        idx: '2',
        asset_nm: '스파이더맨: 노 웨이 홈',
        genre: '액션',
        poster_path: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        release_year: '2021',
        description: '멀티버스가 열리면서 벌어지는 스파이더맨의 대모험'
      },
      {
        idx: '3',
        asset_nm: '인터스텔라',
        genre: 'SF',
        poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        release_year: '2014',
        description: '우주를 여행하며 인류의 미래를 구하는 감동적인 이야기'
      },
      {
        idx: '4',
        asset_nm: '조커',
        genre: '스릴러',
        poster_path: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
        release_year: '2019',
        description: '광기와 현실 사이에서 벌어지는 충격적인 변화'
      },
      {
        idx: '5',
        asset_nm: '어벤져스: 엔드게임',
        genre: '액션',
        poster_path: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        release_year: '2019',
        description: '지구를 구하기 위한 어벤져스의 마지막 전투'
      },
      {
        idx: '6',
        asset_nm: '기생충',
        genre: '스릴러',
        poster_path: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        release_year: '2019',
        description: '계급 사회의 모순을 그린 블랙 코미디 스릴러'
      },
      {
        idx: '7',
        asset_nm: '올드보이',
        genre: '스릴러',
        poster_path: 'https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg',
        release_year: '2003',
        description: '복수와 진실을 찾아가는 강렬한 스릴러'
      },
      {
        idx: '8',
        asset_nm: '아가씨',
        genre: '로맨스',
        poster_path: 'https://image.tmdb.org/t/p/w500/e7gOJcSFzYcxUJCfrYvCFbJhJJ7.jpg',
        release_year: '2016',
        description: '탐욕과 배신, 그리고 사랑의 복잡한 관계'
      },
      {
        idx: '9',
        asset_nm: '건축학개론',
        genre: '로맨스',
        poster_path: 'https://image.tmdb.org/t/p/w500/q72xD6Hb8l1qs7oYDnlPHZmEKXe.jpg',
        release_year: '2012',
        description: '첫사랑의 아련한 추억을 그린 로맨스'
      },
      {
        idx: '10',
        asset_nm: '밀양',
        genre: '드라마',
        poster_path: 'https://image.tmdb.org/t/p/w500/xDzxK8nSdlnqfK2nEiuFRzb1RD3.jpg',
        release_year: '2007',
        description: '인간 내면의 깊은 고통과 구원을 그린 작품'
      }
    ];
  }
};

export default { getTodayRecommendations };
