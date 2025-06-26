import React, { useState, useEffect } from 'react';
import MinorBlockModal from './MinorBlockModal';
import PasswordModal from './PasswordModal';
import { checkUserAdultStatus } from '../../services/adultAuthService';

/**
 * 성인 콘텐츠 접근 제어 컴포넌트
 * 1. 미성년자: 접근 차단
 * 2. 성인: 비밀번호 인증
 */
const AdultContentGate = ({ onSuccess, onCancel }) => {
  const [gateState, setGateState] = useState('loading'); // 'loading', 'blocked', 'password', 'success'
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserAccess();
  }, []);

  const getCurrentUserId = () => {
    try {
      // 방법 1: localStorage에서 사용자 정보 확인
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.user_idx) {
        return userData.user_idx;
      }
      
      // 방법 2: sessionStorage에서 확인
      const sessionUserData = JSON.parse(sessionStorage.getItem('userData') || '{}');
      if (sessionUserData.user_idx) {
        return sessionUserData.user_idx;
      }
      
      // 방법 3: 기본값 (테스트용)
      return 541;
    } catch (error) {
      console.error('사용자 ID 가져오기 실패:', error);
      return 541;
    }
  };

  const checkUserAccess = async () => {
    try {
      setGateState('loading');
      
      const userId = getCurrentUserId();
      console.log('🚪 성인 콘텐츠 접근 제어 시작 - User ID:', userId);
      
      const result = await checkUserAdultStatus(userId);
      console.log('👤 사용자 정보 확인 결과:', result);
      
      setUserInfo(result);
      
      if (!result.isAdult) {
        // 미성년자: 접근 차단
        console.log('🚫 미성년자 접근 차단');
        setGateState('blocked');
      } else {
        // 성인: 비밀번호 인증 단계로
        console.log('🔐 성인 사용자 - 비밀번호 인증 필요');
        setGateState('password');
      }
      
    } catch (err) {
      console.error('❌ 사용자 접근 제어 확인 실패:', err);
      setError(err.message);
      // 오류 발생 시 안전하게 차단
      setGateState('blocked');
    }
  };

  const handlePasswordSuccess = () => {
    console.log('✅ 성인 인증 완료');
    setGateState('success');
    onSuccess();
  };

  const handleGoBack = () => {
    console.log('🔙 이전 페이지로 이동');
    onCancel();
  };

  // 로딩 중
  if (gateState === 'loading') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        color: 'white',
        fontSize: '1.2rem'
      }}>
        사용자 정보 확인 중...
      </div>
    );
  }

  // 미성년자 차단
  if (gateState === 'blocked') {
    return <MinorBlockModal onGoBack={handleGoBack} />;
  }

  // 성인 비밀번호 인증
  if (gateState === 'password') {
    return (
      <PasswordModal 
        onSuccess={handlePasswordSuccess}
        onCancel={handleGoBack}
      />
    );
  }

  // 인증 완료 (이 컴포넌트는 더 이상 렌더링되지 않음)
  return null;
};

export default AdultContentGate;
