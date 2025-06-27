import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../../assets/images/logos/welllist_backno.png';
import bgImage from '../../assets/images/backgrounds/login_image3.png';
import { signInWithEmail } from '../../services/auth'; // Firebase 연동 함수

const LoginPage = () => {
  const [formData, setFormData] = useState({ contact: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 비밀번호 보이기/숨기기 토글
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 로그인 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.contact)) {
      newErrors.contact = '유효한 이메일 주소를 입력해주세요.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await signInWithEmail(formData.contact, formData.password);
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      alert('로그인 성공!');
      navigate('/main');
    } catch (err) {
      setErrors({ password: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      {/* 어두운 오버레이 */}
      <div className="background-overlay" />

      {/* 로고 */}
      <div className="login-logo" onClick={() => navigate('/')}>
        <img src={logo} alt="WellList 홈으로" />
      </div>

      {/* 로그인 폼 */}
      <form className="login-content" onSubmit={handleSubmit}>
        <h2 className="login-title">WellList ID 로그인</h2>

        {/* 이메일 입력 */}
        <input
          className="login-input"
          type="email"
          name="contact"
          placeholder="이메일"
          value={formData.contact}
          onChange={handleInputChange}
          required
        />
        {errors.contact && <p className="login-error">{errors.contact}</p>}

        {/* 비밀번호 입력 */}
        <div className="login-password-wrapper">
          <input
            className="login-input"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="toggle-visibility-btn"
            onClick={togglePasswordVisibility}
            aria-label="비밀번호 보기/숨기기"
          >
            {showPassword ? (
              // 눈 뜬 아이콘 (보이는 상태)
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              // 눈 가린 아이콘 (숨김 상태)
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.4 18.4 0 0 1 5.06-5.94M9.88 4.24A9.17 9.17 0 0 1 12 4c7 0 11 8 11 8a18.4 18.4 0 0 1-2.12 3.19M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="login-error">{errors.password}</p>}

        {/* 자동 로그인 */}
        <label className="login-checkbox">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
          />
          자동 로그인
        </label>

        {/* 로그인 버튼 */}
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인하기'}
        </button>

        {/* 회원가입 링크 */}
        <p className="signup-link">
          아직 계정이 없으신가요?{' '}
          <span onClick={() => navigate('/signup')}>회원가입</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
