// 성인 인증 관련 API 서비스
import { getCurrentUserToken } from './auth';

/**
 * 성인 인증 비밀번호를 서버에서 검증합니다.
 * @param {string} password - 입력된 비밀번호
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const verifyAdultPassword = async (password) => {
  try {
    // 현재 사용자의 Firebase 토큰 가져오기
    const token = await getCurrentUserToken();
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/adult/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        password: password
      })
    });
    
    if (!response.ok) {
      // 에러 상태별 처리
      const errorData = await response.json().catch(() => ({}));
      
      switch (response.status) {
        case 401:
          throw new Error('로그인이 필요합니다');
        case 403:
          throw new Error('성인 인증이 필요한 서비스입니다');
        case 404:
          throw new Error('사용자 정보를 찾을 수 없습니다');
        default:
          throw new Error(errorData.detail || '인증 중 오류가 발생했습니다');
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('성인 인증 비밀번호 검증 실패:', error);
    
    // Firebase 인증 관련 에러 처리
    if (error.message === '로그인이 필요합니다') {
      throw error;
    }
    
    // 네트워크 오류 처리
    if (!error.response && error.message.includes('fetch')) {
      throw new Error('서버 연결에 실패했습니다');
    }
    
    throw error;
  }
};

export default {
  verifyAdultPassword
};
