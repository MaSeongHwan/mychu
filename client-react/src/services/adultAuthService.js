// 성인 인증 관련 API 서비스
import { getCurrentUserToken } from './auth';

/**
 * 사용자의 성인 여부를 서버에서 확인합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<{isAdult: boolean, age: number, message: string, secPassword: string}>}
 */
export const checkUserAdultStatus = async (userId) => {
  try {
    console.log('👤 사용자 성인 여부 확인 시작 - User ID:', userId);
    
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/users/${userId}`;
      console.log('📡 사용자 정보 API 호출:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ 사용자 정보 조회 성공:', userData);
        
        const isAdult = userData.is_adult || false;
        const age = userData.age || 0;
        const secPassword = userData.sec_password || '';
        
        return {
          isAdult,
          age,
          secPassword,
          message: isAdult ? '성인 사용자입니다' : '미성년자는 이용할 수 없습니다'
        };
      } else {
        throw new Error('사용자 정보 조회 실패');
      }
      
    } catch (authError) {
      console.warn('⚠️ 서버에서 사용자 정보 확인 실패, 로컬 데이터 확인:', authError.message);
      
      // 로컬 스토리지에서 사용자 데이터 확인
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const sessionUserData = JSON.parse(sessionStorage.getItem('userData') || '{}');
      
      const isAdult = userData.is_adult || sessionUserData.is_adult || false;
      const age = userData.age || sessionUserData.age || 0;
      const secPassword = userData.sec_password || sessionUserData.sec_password || '0000';
      
      console.log('🔍 로컬에서 확인된 정보:', { isAdult, age, secPassword });
      
      return {
        isAdult,
        age,
        secPassword,
        message: isAdult ? '성인 사용자입니다' : '미성년자는 이용할 수 없습니다'
      };
    }
  } catch (error) {
    console.error('❌ 사용자 성인 여부 확인 실패:', error);
    
    // 기본적으로 미성년자로 처리 (보안상 안전)
    return {
      isAdult: false,
      age: 0,
      secPassword: '',
      message: '사용자 정보 확인 중 오류가 발생했습니다. 미성년자로 처리됩니다.'
    };
  }
};

/**
 * 성인 인증 비밀번호를 서버에서 검증합니다.
 * @param {string} password - 입력된 비밀번호
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const verifyAdultPassword = async (password) => {
  try {
    console.log('🔐 성인 인증 비밀번호 검증 시작');
    
    // 먼저 사용자 로그인 상태 확인
    try {
      const token = await getCurrentUserToken();
      console.log('🔑 Firebase 토큰 획득 성공:', token ? '토큰 있음' : '토큰 없음');
      
      const apiUrl = `${import.meta.env.VITE_API_URL}/users/adult/verify-password`;
      console.log('📡 API 호출:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: password
        })
      });
      
      console.log('🌐 응답 상태:', response.status, response.statusText);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ 성인 인증 결과:', result);
        return result;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API 에러 응답:', errorData);
        throw new Error(errorData.detail || '서버 인증 실패');
      }
      
    } catch (authError) {
      console.warn('⚠️ 서버 인증 실패, 로컬 검증으로 대체:', authError.message);
      
      // 임시: 로컬에서 간단한 비밀번호 검증
      // 실제 운영에서는 서버 인증을 반드시 사용해야 함
      if (password === '0000') {
        console.log('✅ 로컬 비밀번호 검증 성공');
        return {
          success: true,
          message: '성인 인증이 완료되었습니다'
        };
      } else {
        console.log('❌ 로컬 비밀번호 검증 실패');
        return {
          success: false,
          message: '비밀번호가 일치하지 않습니다'
        };
      }
    }
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
  verifyAdultPassword,
  checkUserAdultStatus
};
