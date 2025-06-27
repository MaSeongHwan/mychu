import { useState, useEffect } from 'react';
import { tryApiWithMockFallback, mockApi } from '../services/mockApi';

/**
 * 콘텐츠 데이터를 가져오는 커스텀 훅
 * @param {Object} options - 훅 옵션
 * @param {string} options.endpoint - API 엔드포인트
 * @param {Function} options.mockFunction - 실패 시 사용할 Mock 함수
 * @param {Array} options.mockArgs - Mock 함수에 전달할 인자
 * @param {Array} options.initialData - 초기 데이터 (선택적)
 * @param {Array} options.dependencies - useEffect 의존성 배열 (기본값: [])
 */
export const useContentData = ({
  endpoint,
  mockFunction,
  mockArgs = [],
  initialData = [],
  dependencies = []
}) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(`데이터 가져오기 시작: ${endpoint}`);
        
        // API 호출 또는 Mock 데이터로 폴백
        const result = await tryApiWithMockFallback(
          endpoint, 
          mockFunction,
          mockArgs
        );
        
        console.log('데이터 수신 성공:', result);
        setData(result);
        setError(null);
      } catch (err) {
        console.error('데이터 로드 중 오류:', err);
        setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error };
};

/**
 * 특정 장르의 콘텐츠 목록을 가져오는 훅
 * @param {string} contentType - 콘텐츠 타입 ('movies' 또는 'dramas')
 * @param {string} genreId - 장르 ID
 */
export const useGenreContent = (contentType, genreId) => {
  return useContentData({
    endpoint: `/api/${contentType}/genre/${genreId}?limit=10`,
    mockFunction: contentType === 'dramas' ? mockApi.getDramasByGenre : mockApi.getMoviesByGenre,
    mockArgs: [genreId],
    dependencies: [contentType, genreId]
  });
};

/**
 * 콘텐츠 장르 목록을 가져오는 훅
 * @param {string} contentType - 콘텐츠 타입 ('movies' 또는 'dramas')
 */
export const useContentGenres = (contentType) => {
  return useContentData({
    endpoint: `/api/${contentType}/genres`,
    mockFunction: contentType === 'dramas' ? mockApi.getDramaGenres : mockApi.getMovieGenres,
    dependencies: [contentType]
  });
};

export default { useContentData, useGenreContent, useContentGenres };
