import { useState, useEffect } from 'react';
import { cachedFetch, createCacheKey } from '../api/apiCache';

/**
 * API 데이터 로딩을 위한 커스텀 훅 (캐싱 기능 포함)
 * 
 * @param {string} baseUrl - API 기본 URL
 * @param {Object} params - API 요청 파라미터
 * @param {number} cacheTime - 캐시 유효 시간 (밀리초)
 * @param {boolean} skipFetch - API 호출 건너뛰기 여부
 * @returns {Object} { data, isLoading, error, refetch }
 */
export function useCachedFetch(baseUrl, params = {}, cacheTime = 60000, skipFetch = false) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 요청 URL 생성
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  
  // 캐시 키 생성
  const cacheKey = createCacheKey(baseUrl, params);
  
  // API 데이터 가져오기 함수
  const fetchData = async () => {
    if (skipFetch) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await cachedFetch(
        cacheKey,
        async () => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`API 에러: ${response.status}`);
          }
          return response.json();
        },
        cacheTime
      );
      
      setData(result);
    } catch (err) {
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('API 요청 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 마운트 시 및 의존성 변경 시 데이터 가져오기
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, JSON.stringify(params), skipFetch]);
  
  // 수동으로 다시 가져오기 위한 함수
  const refetch = () => {
    return fetchData();
  };
  
  return { data, isLoading, error, refetch };
}

/**
 * 추천 API를 위한 커스텀 훅
 * 
 * @param {string} recommendationType - 추천 유형 (popular, recent, test 등)
 * @param {Object} params - API 요청 파라미터
 * @param {number} cacheTime - 캐시 유효 시간 (밀리초)
 * @returns {Object} { items, isLoading, error, refetch }
 */
export function useRecommendation(recommendationType, params = {}, cacheTime = 60000) {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
  const baseUrl = `${API_BASE_URL}/recommendation/${recommendationType}`;
  
  const { data, isLoading, error, refetch } = useCachedFetch(baseUrl, params, cacheTime);
  
  // items 배열 추출 (API 응답 구조에 맞춤)
  const items = data?.items || [];
  
  return { items, isLoading, error, refetch };
}

export default {
  useCachedFetch,
  useRecommendation
};
