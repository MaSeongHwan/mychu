import { useState } from 'react';
import './PasswordModal.css';
import { verifyAdultPassword } from '../../services/adultAuthService';

/**
 * 성인 인증 비밀번호 모달 컴포넌트
 */
const PasswordModal = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('비밀번호를 입력하세요');
      setShowError(true);
      return;
    }

    setIsLoading(true);
    setShowError(false);
    console.log('🔐 성인 인증 시도 - 입력된 비밀번호:', password);

    try {
      const result = await verifyAdultPassword(password);
      console.log('🔐 성인 인증 응답:', result);
      
      if (result.success) {
        console.log('✅ 성인 인증 성공');
        onSuccess();
      } else {
        console.log('❌ 성인 인증 실패:', result.message);
        setError(result.message || '비밀번호가 일치하지 않습니다.');
        setShowError(true);
        setPassword('');
      }
    } catch (err) {
      console.error('💥 성인 인증 에러:', err);
      setError(err.message || '인증 중 오류가 발생했습니다.');
      setShowError(true);
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (showError) {
      setShowError(false);
      setError('');
    }
  };

  return (
    <div className="password-modal active">
      <div className="password-container">
        <h2 className="password-title">성인 인증</h2>
        <input
          type="password"
          className="password-input"
          value={password}
          onChange={handlePasswordChange}
          onKeyPress={handleKeyPress}
          placeholder="비밀번호를 입력하세요"
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus
        />
        <button 
          className="password-submit" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? '확인 중...' : '확인'}
        </button>
        {showError && (
          <p className={`password-error ${!password.trim() ? 'empty' : ''}`}>
            {error}
          </p>
        )}
        <button className="back-button" onClick={onCancel}>
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default PasswordModal;
