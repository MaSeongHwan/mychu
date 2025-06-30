/**
 * 로컬 스토리지 관련 유틸리티 함수
 */

/**
 * 로컬 스토리지에 항목 저장
 * @param {string} key - 저장할 키
 * @param {any} value - 저장할 값
 */
export const setItem = (key, value) => {
  try {
    const serializedValue = typeof value === 'object' 
      ? JSON.stringify(value) 
      : String(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`로컬 스토리지 저장 오류 (${key}):`, error);
  }
};

/**
 * 로컬 스토리지에서 항목 가져오기
 * @param {string} key - 가져올 키
 * @param {any} defaultValue - 기본값
 * @returns {any} 저장된 값 또는 기본값
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    
    // JSON 형태로 파싱 시도
    try {
      return JSON.parse(value);
    } catch {
      // 파싱 실패 시 원래 값 반환
      return value;
    }
  } catch (error) {
    console.error(`로컬 스토리지 읽기 오류 (${key}):`, error);
    return defaultValue;
  }
};

/**
 * 로컬 스토리지에서 항목 제거
 * @param {string} key - 제거할 키
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`로컬 스토리지 항목 제거 오류 (${key}):`, error);
  }
};

/**
 * 로컬 스토리지 비우기
 */
export const clear = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('로컬 스토리지 비우기 오류:', error);
  }
};

/**
 * 세션 스토리지에 항목 저장
 * @param {string} key - 저장할 키
 * @param {any} value - 저장할 값
 */
export const setSessionItem = (key, value) => {
  try {
    const serializedValue = typeof value === 'object' 
      ? JSON.stringify(value) 
      : String(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`세션 스토리지 저장 오류 (${key}):`, error);
  }
};

/**
 * 세션 스토리지에서 항목 가져오기
 * @param {string} key - 가져올 키
 * @param {any} defaultValue - 기본값
 * @returns {any} 저장된 값 또는 기본값
 */
export const getSessionItem = (key, defaultValue = null) => {
  try {
    const value = sessionStorage.getItem(key);
    if (value === null) return defaultValue;
    
    // JSON 형태로 파싱 시도
    try {
      return JSON.parse(value);
    } catch {
      // 파싱 실패 시 원래 값 반환
      return value;
    }
  } catch (error) {
    console.error(`세션 스토리지 읽기 오류 (${key}):`, error);
    return defaultValue;
  }
};

export default {
  setItem,
  getItem,
  removeItem,
  clear,
  setSessionItem,
  getSessionItem
};
