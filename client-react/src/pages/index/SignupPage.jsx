import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

/**
 * 회원가입 페이지 컴포넌트 - HTML/CSS를 React로 구현
 */
const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contact: '',
    name: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
    agreeTerms: false,
    agreeMarketing: false
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 에러 메시지 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // 비밀번호 강도 체크
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  // 비밀번호 강도 체크
  const checkPasswordStrength = (password) => {
    let strength = 0;
    let strengthText = '';
    let strengthClass = '';

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    switch (strength) {
      case 0:
      case 1:
        strengthText = '매우 약함';
        strengthClass = 'very-weak';
        break;
      case 2:
        strengthText = '약함';
        strengthClass = 'weak';
        break;
      case 3:
        strengthText = '보통';
        strengthClass = 'medium';
        break;
      case 4:
        strengthText = '강함';
        strengthClass = 'strong';
        break;
      case 5:
        strengthText = '매우 강함';
        strengthClass = 'very-strong';
        break;
    }

    setPasswordStrength({
      text: password.length > 0 ? `비밀번호 강도: ${strengthText}` : '',
      class: strengthClass
    });
  };

  // 이메일 유효성 검사
  const validateContact = (contact) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    return emailRegex.test(contact) || phoneRegex.test(contact);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    // 연락처 검사
    if (!validateContact(formData.contact)) {
      newErrors.contact = '올바른 이메일 주소 또는 전화번호를 입력하세요';
    }

    // 닉네임 검사
    if (!formData.name.trim()) {
      newErrors.name = '닉네임을 입력하세요';
    }

    // 비밀번호 검사
    if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    // 비밀번호 확인 검사
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    // 생년월일 검사
    if (!formData.birthdate) {
      newErrors.birthdate = '생년월일을 입력하세요';
    }

    // 이용약관 동의 검사
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 여기에서 실제 회원가입 API 호출
      console.log('회원가입 데이터:', formData);
      
      // 임시로 2초 대기 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 회원가입 성공
      alert('회원가입이 완료되었습니다!');
      navigate('/main');
    } catch (error) {
      console.error('회원가입 실패:', error);
      setErrors({ submit: '회원가입에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 보기/숨기기 토글
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="signup-page">
      {/* 헤더 */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <button className="logo-link" onClick={() => navigate('/')}>
                <img src="/static/images/welllist_backno.png" alt="WellList" className="logo-image" />
              </button>
            </div>
            <div className="header-right">
              <button onClick={() => navigate('/account-select')} className="login-link">
                로그인
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <div className="container">
          <div className="signup-container">
            <div className="signup-card">
              <div className="signup-header">
                <h1 className="signup-title">WellList에 오신 것을 환영합니다</h1>
                <p className="signup-subtitle">무제한 영화, 드라마, 예능을 즐겨보세요</p>
              </div>

              <form className="signup-form" onSubmit={handleSubmit}>
                {/* 이메일 */}
                <div className="form-group">
                  <label htmlFor="contact" className="form-label">이메일</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    className="form-input"
                    placeholder="이메일 주소를 입력하세요"
                    value={formData.contact}
                    onChange={handleInputChange}
                    autoComplete="email"
                    required
                  />
                  {errors.contact && <div className="input-error">{errors.contact}</div>}
                </div>

                {/* 닉네임 */}
                <div className="form-group">
                  <label htmlFor="name" className="form-label">닉네임</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="닉네임을 입력하세요"
                    value={formData.name}
                    onChange={handleInputChange}
                    autoComplete="nickname"
                    required
                  />
                  {errors.name && <div className="input-error">{errors.name}</div>}
                </div>

                {/* 비밀번호 */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">비밀번호</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="form-input"
                      placeholder="비밀번호를 입력하세요 (8자 이상)"
                      value={formData.password}
                      onChange={handleInputChange}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('password')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
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
                  {passwordStrength.text && (
                    <div className={`password-strength ${passwordStrength.class}`}>
                      {passwordStrength.text}
                    </div>
                  )}
                  {errors.password && <div className="input-error">{errors.password}</div>}
                </div>

                {/* 비밀번호 확인 */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">비밀번호 확인</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input"
                      placeholder="비밀번호를 다시 입력하세요"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                        {showConfirmPassword ? (
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
                  {errors.confirmPassword && <div className="input-error">{errors.confirmPassword}</div>}
                </div>

                {/* 생년월일 */}
                <div className="form-group">
                  <label htmlFor="birthdate" className="form-label">생년월일</label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    className="form-input"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.birthdate && <div className="input-error">{errors.birthdate}</div>}
                </div>

                {/* 이용약관 동의 */}
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      className="checkbox-input"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      <a href="#" className="terms-link">이용약관</a> 및{' '}
                      <a href="#" className="terms-link">개인정보처리방침</a>에 동의합니다
                    </span>
                  </label>
                  {errors.agreeTerms && <div className="input-error">{errors.agreeTerms}</div>}
                </div>

                {/* 마케팅 정보 수신 동의 */}
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeMarketing"
                      className="checkbox-input"
                      checked={formData.agreeMarketing}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">마케팅 정보 수신에 동의합니다 (선택)</span>
                  </label>
                </div>

                {/* 회원가입 버튼 */}
                <button type="submit" className={`signup-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                  <span className="btn-text">회원가입</span>
                  {isLoading && (
                    <div className="btn-loading">
                      <div className="spinner"></div>
                    </div>
                  )}
                </button>

                {errors.submit && <div className="input-error">{errors.submit}</div>}
              </form>

              <div className="signup-footer">
                <p className="login-prompt">
                  이미 계정이 있으신가요?{' '}
                  <button onClick={() => navigate('/')} className="login-link-text">
                    로그인
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
