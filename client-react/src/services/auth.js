/**
 * 인증 관련 서비스 함수
 */

// 사용자 세션 스토리지 키
const USER_SESSION_KEY = 'welllist_user_session';

/**
 * 로컬 스토리지에서 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보 객체 또는 null
 */
const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem(USER_SESSION_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('사용자 정보 로드 실패:', error);
    return null;
  }
};

/**
 * 사용자 로그인 처리
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} 로그인 결과
 */
const login = async (email, password) => {
  try {
    // 실제 로그인 API 호출
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '로그인 실패');
    }
    
    // 로컬 스토리지에 사용자 정보 저장
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 사용자 로그아웃 처리
 * @returns {Promise<void>}
 */
const logout = async () => {
  try {
    // 실제 로그아웃 API 호출 (세션 무효화 등)
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    
    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem(USER_SESSION_KEY);
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    // 에러가 발생해도 로컬에서는 로그아웃 처리
    localStorage.removeItem(USER_SESSION_KEY);
    throw error;
  }
};

/**
 * 인증 상태 확인
 * @returns {boolean} 인증 여부
 */
const isAuthenticated = () => {
  return !!getCurrentUser();
};

/**
 * 사용자 등록 처리
 * @param {Object} userData - 사용자 등록 데이터
 * @returns {Promise<Object>} 등록 결과
 */
const register = async (userData) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '회원 가입 실패');
    }
    
    return data;
  } catch (error) {
    console.error('회원 가입 중 오류 발생:', error);
    throw error;
  }
};

export default {
  getCurrentUser,
  login,
  logout,
  isAuthenticated,
  register
};
