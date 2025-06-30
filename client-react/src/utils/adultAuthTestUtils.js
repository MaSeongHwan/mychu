/**
 * 성인 인증 테스트를 위한 유틸리티 함수들
 * 개발/테스트 환경에서만 사용
 */

/**
 * 테스트용 성인 사용자 데이터 설정
 */
export const setTestAdultUser = () => {
  const adultUserData = {
    user_idx: 541,
    is_adult: true,
    age: 25,
    sec_password: '0000',
    nick_name: '성인테스트'
  };
  
  localStorage.setItem('userData', JSON.stringify(adultUserData));
  console.log('✅ 테스트용 성인 사용자 데이터 설정 완료');
};

/**
 * 테스트용 미성년자 사용자 데이터 설정
 */
export const setTestMinorUser = () => {
  const minorUserData = {
    user_idx: 999,
    is_adult: false,
    age: 17,
    sec_password: '',
    nick_name: '미성년자테스트'
  };
  
  localStorage.setItem('userData', JSON.stringify(minorUserData));
  console.log('✅ 테스트용 미성년자 사용자 데이터 설정 완료');
};

/**
 * 테스트 데이터 초기화
 */
export const clearTestData = () => {
  localStorage.removeItem('userData');
  sessionStorage.removeItem('userData');
  console.log('✅ 테스트 데이터 초기화 완료');
};

// 개발 환경에서만 전역에 함수 노출
if (import.meta.env.DEV) {
  window.setTestAdultUser = setTestAdultUser;
  window.setTestMinorUser = setTestMinorUser;
  window.clearTestData = clearTestData;
}
