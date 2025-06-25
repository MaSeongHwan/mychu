/**
 * API 설정 통합 파일
 * HTML 프로젝트의 config.js를 React 프로젝트로 통합
 */

// API 기본 URL 설정 (환경에 따라 동적으로 설정)
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://fastapi:8000'  // Docker 환경에서는 service name 사용
  : 'http://127.0.0.1:8000';  // 로컬 개발 환경

// 추천 시스템 엔드포인트 설정
export const ENDPOINTS = {
  recommendations: {
    top: '/recommendation/top',
    emotion: '/recommendation/emotion',
    recent: '/recommendation/recent',
    similar: '/recommendation/similar',
    test: '/recommendation/test'
  },
  assets: '/assets',
  search: {
    basic: '/search',
    all: '/search/all',
    advanced: '/search/advanced',
    autocomplete: '/search/autocomplete'
  }
};

// API 설정값
export const API_CONFIG = {
  defaultLimit: 10,
  searchDebounceTime: 300,
  cacheTimeout: 60000, // 1분
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// 환경별 설정
export const ENV_CONFIG = {
  development: {
    enableLogging: true,
    enableCache: true,
    enableDebug: true
  },
  production: {
    enableLogging: false,
    enableCache: true,
    enableDebug: false
  }
};

// 현재 환경 설정
export const CURRENT_ENV = ENV_CONFIG[process.env.NODE_ENV] || ENV_CONFIG.development;
