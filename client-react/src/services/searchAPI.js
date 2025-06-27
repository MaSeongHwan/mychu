/**
 * 검색 API 함수들 (통합 API 사용)
 * HTML 프로젝트의 search.js를 React로 포팅하고 새로운 통합 API 사용
 */

import { searchAPI as unifiedSearchAPI } from './api.js';

// 통합 API를 사용하는 래퍼 함수들 (기존 호환성 유지)

/**
 * 일반 검색 (성인 제외)
 */
export async function searchFiltered(query, limit = 10) {
  return await unifiedSearchAPI.searchFiltered(query, limit);
}

/**
 * 전체 검색 (성인 포함 옵션)
 */
export async function searchAll({ query, limit = 10, is_adult = false, user_id }) {
  return await unifiedSearchAPI.searchAll({ query, limit, is_adult, user_id });
}

/**
 * 고급 검색 : 기본 검색에 추가로 여러 필터 옵션 넣어서 검색 가능함
 */
export async function searchAdvanced({ query, limit = 10, genre, release_year, is_adult, is_movie, is_drama, user_id }) {
  return await unifiedSearchAPI.searchAdvanced({ 
    query, limit, genre, release_year, is_adult, is_movie, is_drama, user_id 
  });
}

/**
 * 자동완성 검색
 */
export async function searchAutocomplete(query, limit = 5) {
  return await unifiedSearchAPI.searchAutocomplete(query, limit);
}

// 기본 내보내기로 통합 API 제공
export default unifiedSearchAPI;
