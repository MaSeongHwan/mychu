import { API_BASE_URL, ENDPOINTS, API_CONFIG } from './config.js';

// API 요청 기본 함수
async function fetchAPI(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...API_CONFIG.headers,
            ...options.headers,
        },
    });

    if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

// 추천 콘텐츠 가져오기
export async function fetchRecommendations(type, limit = 10) {
    const endpoint = ENDPOINTS.recommendations[type];
    if (!endpoint) throw new Error(`Unknown recommendation type: ${type}`);    try {
        console.log(`Fetching recommendations: ${endpoint}`);
        const data = await fetchAPI(`${endpoint}?n=${limit}`);
        return data.items || [];
    } catch (error) {
        console.error(`Error fetching ${type} recommendations:`, error);
        return [];
        throw error;
    }
}

// 자산 목록 가져오기
export async function fetchAssets(limit = 10) {
    return fetchAPI(ENDPOINTS.assets);
}

// 검색 실행
export async function searchContent(query, options = {}) {
    if (!query || query.length < 2) return [];
    
    const params = new URLSearchParams({
        query: query,
        limit: options.limit || 10
    });
    
    // 추가 검색 파라미터 처리
    if (options.genre) params.append('genre', options.genre);
    if (options.release_year) params.append('release_year', options.release_year);
    if (options.is_adult) params.append('is_adult', options.is_adult);
    if (options.is_movie !== undefined) params.append('is_movie', options.is_movie);
    
    // 고급 검색 사용 여부
    const endpoint = options.advanced ? ENDPOINTS.advancedSearch : ENDPOINTS.search;
    
    return fetchAPI(`${endpoint}?${params.toString()}`);
}
