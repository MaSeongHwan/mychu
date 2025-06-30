// 백엔드 직접 로그인 서비스 (Firebase 우회)
// Firebase 설정 문제 해결 전까지 사용

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * 백엔드 서버에 직접 로그인 요청 (Firebase 우회)
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} 사용자 정보
 */
export async function signInDirectly(email, password) {
  try {
    console.log('🔧 백엔드 직접 로그인 시도:', email);
    
    // 1. 이메일로 사용자 조회 (간단한 방법으로 구현)
    // 실제로는 백엔드에 로그인 API가 있어야 하지만, 
    // 현재는 사용자 ID를 알고 있다고 가정하고 진행
    
    // 테스트용 사용자 매핑 (실제로는 백엔드 로그인 API 사용)
    const testUsers = {
      'test0625@11.11': { user_id: 541, password: 'test123' },
      'user@example.com': { user_id: 542, password: 'password123' },
      'admin@test.com': { user_id: 543, password: 'admin123' }
    };
    
    const testUser = testUsers[email];
    if (!testUser) {
      throw new Error('등록되지 않은 이메일입니다.');
    }
    
    if (testUser.password !== password) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
    
    // 2. 백엔드에서 사용자 정보 조회
    const userResponse = await fetch(`${API_BASE_URL}/users/${testUser.user_id}`);
    
    if (!userResponse.ok) {
      throw new Error(`사용자 정보 조회 실패: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    console.log('🔧 백엔드 사용자 정보 조회 성공:', userData);
    
    // 3. 로그인 정보를 로컬 스토리지에 저장
    const loginData = {
      user_idx: userData.user_idx,
      email: userData.email,
      nickname: userData.nickname,
      is_adult: userData.is_adult,
      loginMethod: 'backend-direct',
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(loginData));
    localStorage.setItem('isLoggedIn', 'true');
    
    console.log('✅ 백엔드 직접 로그인 성공');
    return loginData;
    
  } catch (error) {
    console.error('❌ 백엔드 직접 로그인 실패:', error);
    throw error;
  }
}

/**
 * 현재 로그인된 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보 또는 null
 */
export function getCurrentUserDirect() {
  try {
    const userData = localStorage.getItem('userData');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (userData && isLoggedIn === 'true') {
      return JSON.parse(userData);
    }
    
    return null;
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    return null;
  }
}

/**
 * 로그아웃
 */
export function signOutDirect() {
  localStorage.removeItem('userData');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('rememberMe');
  console.log('🔧 백엔드 직접 로그아웃 완료');
}

export default {
  signInDirectly,
  getCurrentUserDirect,
  signOutDirect
};
