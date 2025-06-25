import { useState } from 'react';
import './PasswordModal.css';

/**
 * 성인 인증 비밀번호 모달 컴포넌트
 */
const PasswordModal = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  // 성인 인증 비밀번호 (실제 서비스에서는 서버에서 검증)
  const ADULT_PASSWORD = '1234'; // 예시 비밀번호

  const handleSubmit = () => {
    if (!password.trim()) {
      setError('비밀번호를 입력하세요');
      setShowError(true);
      return;
    }

    if (password === ADULT_PASSWORD) {
      onSuccess();
    } else {
      setError('비밀번호가 일치하지 않습니다.');
      setShowError(true);
      setPassword('');
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
        <button className="password-submit" onClick={handleSubmit}>
          확인
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
