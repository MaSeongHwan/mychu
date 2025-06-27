import { useState } from 'react';
import AdultContentGate from '../pages/adult/AdultContentGate';

/**
 * 성인 콘텐츠 접근 제어를 위한 커스텀 훅
 * @param {Function} onAccessDenied - 접근 거부 시 호출할 함수
 * @returns {Object} { isAdultVerified, AdultGateComponent }
 */
export const useAdultContentGate = (onAccessDenied = () => {}) => {
  const [isAdultVerified, setIsAdultVerified] = useState(false);
  const [showGate, setShowGate] = useState(true);

  const handleSuccess = () => {
    console.log('✅ 성인 인증 성공 - 콘텐츠 접근 허용');
    setIsAdultVerified(true);
    setShowGate(false);
  };

  const handleCancel = () => {
    console.log('🚫 성인 인증 취소 - 이전 페이지로 이동');
    setIsAdultVerified(false);
    setShowGate(false);
    onAccessDenied();
  };

  const AdultGateComponent = showGate ? (
    <AdultContentGate 
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  ) : null;

  return {
    isAdultVerified,
    AdultGateComponent,
    showAdultGate: showGate
  };
};

export default useAdultContentGate;
