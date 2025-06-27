// 상수 정의
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  RECOMMENDATIONS: '/recommendation',
  SEARCH: '/search',
  ASSETS: '/assets',
  USERS: '/users',
  LOGS: '/logs'
};

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  MOVIE: '/movie',
  DRAMA: '/drama',
  MYLIST: '/mylist',
  ACCOUNT: '/account',
  CONTENT_DETAIL: '/content'
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  WATCH_HISTORY: 'watch_history',
  FAVORITES: 'favorites',
  THEME: 'theme'
};

export const CONTENT_TYPES = {
  MOVIE: 'movie',
  DRAMA: 'drama',
  DOCUMENTARY: 'documentary',
  VARIETY: 'variety'
};

export const GENRES = {
  ACTION: '액션',
  COMEDY: '코미디',
  DRAMA: '드라마',
  THRILLER: '스릴러',
  ROMANCE: '로맨스',
  HORROR: '호러',
  SF: 'SF',
  FANTASY: '판타지'
};

export const RATING_AGES = {
  ALL: '전체 관람가',
  TWELVE: '12세 관람가',
  FIFTEEN: '15세 관람가',
  ADULT: '청소년 관람불가'
};

export const PAGE_SIZES = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 50
};
