import { API_BASE_URL } from "./config.js";

// 이벤트 리스너 코드는 제거하고 검색 함수만 내보냅니다.
// 이 함수들은 search_page.js에서 사용됩니다.

/**
 * 일반 검색 (성인 제외)
 */
export async function searchFiltered(query, limit = 10) {
  const params = new URLSearchParams({ query, limit });
  const res = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
  if (!res.ok) throw new Error(`검색 실패: ${res.status}`);
  const { results } = await res.json();
  return results;
}

/**
 * 전체 검색 (성인 포함 옵션)
 */
export async function searchAll({ query, limit = 10, is_adult = false, user_id }) {
  const params = new URLSearchParams({ query, limit, is_adult, user_id });
  const res = await fetch(`${API_BASE_URL}/search/all?${params.toString()}`);
  if (!res.ok) throw new Error(`검색 실패: ${res.status}`);
  const { results } = await res.json();
  return results;
}

/**
 * 고급 검색 : 기본 검색에 추가로 여러 필터 옵션 넣어서 검색 가능함
 */
export async function searchAdvanced({ query, limit = 10, genre, release_year, is_adult, is_movie, user_id }) {
  const params = new URLSearchParams({ query, limit });
  if (genre) params.set("genre", genre);
  if (release_year) params.set("release_year", release_year);
  if (typeof is_adult !== "undefined") params.set("is_adult", is_adult);
  if (typeof is_movie !== "undefined") params.set("is_movie", is_movie);
  if (user_id) params.set("user_id", user_id);
  const res = await fetch(`${API_BASE_URL}/search/advanced?${params.toString()}`);
  if (!res.ok) throw new Error(`고급 검색 실패: ${res.status}`);
  const { results } = await res.json();
  return results;
}