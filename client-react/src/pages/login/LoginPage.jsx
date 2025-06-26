import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmail } from '../../services/auth';
import './LoginPage.css';

/**
 * 로그인 페이지 컴포넌트 - HTML/CSS를 React로 구현
 */
const LoginPage = () => {
  const [formData, setFormData] = useState({
    contact: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const navigate = useNavigate();

  // 이메일/전화번호 유효성 검사
  const validateContact = (contact) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    return emailRegex.test(contact) || phoneRegex.test(contact);
  };

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 비밀번호 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 로그인 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    const newErrors = {};
    
    if (!validateContact(formData.contact)) {
      newErrors.contact = '올바른 이메일 주소 또는 전화번호를 입력하세요';
    }

    if (formData.password.length < 1) {
      newErrors.password = '비밀번호를 입력하세요';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // 실제 Firebase 인증 사용
      console.log('로그인 시도:', formData.contact);
      
      const userData = await signInWithEmail(formData.contact, formData.password);
      console.log('로그인 성공:', userData);
      
      // 로그인 상태 저장 (signInWithEmail에서 이미 localStorage에 저장됨)
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      alert('로그인 성공! 메인 페이지로 이동합니다.');
      navigate('/main');
      
    } catch (error) {
      console.error('로그인 실패:', error);
      setErrors({ password: error.message || '로그인에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 찾기 모달 처리
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotModal(true);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (resetEmail) {
      alert(`${resetEmail}로 비밀번호 재설정 링크를 보냈습니다.`);
      setShowForgotModal(false);
      setResetEmail('');
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <Link to="/main" className="logo-link">
                <img src="/static/images/welllist_backno.png" alt="WellList" className="logo-image" />
              </Link>
            </div>
            <div className="header-right">
              <Link to="/account-select" className="account-select-link">다른 방법으로</Link>
              <Link to="/signup" className="signup-link">회원가입</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="login-container">
            <div className="login-card">
              <div className="login-header">
                <h1 className="login-title">로그인</h1>
                <p className="login-subtitle">WellList에서 무제한 콘텐츠를 즐겨보세요</p>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="contact" className="form-label">이메일 또는 전화번호</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    className="form-input"
                    placeholder="이메일 주소 또는 전화번호를 입력하세요"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                  />
                  {errors.contact && (
                    <div className="input-error" style={{ display: 'block' }}>
                      {errors.contact}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">비밀번호</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="form-input"
                      placeholder="비밀번호를 입력하세요"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="eye-icon"
                      >
                        {showPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <div className="input-error" style={{ display: 'block' }}>
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="form-options">
                  <label className="remember-label">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      className="checkbox-input"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">로그인 상태 유지</span>
                  </label>
                  <a href="#" className="forgot-password" onClick={handleForgotPassword}>
                    비밀번호를 잊으셨나요?
                  </a>
                </div>

                <button type="submit" className={`login-btn ${isLoading ? 'loading' : ''}`}>
                  <span className="btn-text">로그인</span>
                  {isLoading && (
                    <div className="btn-loading" style={{ display: 'block' }}>
                      <div className="spinner"></div>
                    </div>
                  )}
                </button>
              </form>

              <div className="login-footer">
                <p className="signup-prompt">
                  아직 계정이 없으신가요?{' '}
                  <Link to="/signup" className="signup-link-text">회원가입</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 비밀번호 찾기 모달 */}
      {showForgotModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">비밀번호 찾기</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowForgotModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
              </p>
              <form onSubmit={handleForgotSubmit}>
                <div className="form-group">
                  <label htmlFor="resetEmail" className="form-label">이메일 주소</label>
                  <input
                    type="email"
                    id="resetEmail"
                    name="resetEmail"
                    className="form-input"
                    placeholder="이메일 주소를 입력하세요"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="modal-btn">재설정 링크 보내기</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
