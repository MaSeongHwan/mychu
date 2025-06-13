// API 설정
export const API_BASE_URL = 'http://127.0.0.1:8000';

// 추천 시스템 엔드포인트 설정
export const ENDPOINTS = {
    recommendations: {
        top: '/recommendation/top',
        emotion: '/recommendation/emotion',
        recent: '/recommendation/recent'
    },
    assets: '/assets',
    search: '/search',
    advancedSearch: '/search/advanced'
};

// API 설정값
export const API_CONFIG = {
    defaultLimit: 10,
    searchDebounceTime: 300,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};
