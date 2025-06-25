import { useNavigate } from 'react-router-dom';
import './AccountSelectPage.css';

/**
 * 계정 선택 페이지 컴포넌트 - HTML/CSS를 React로 구현
 */
const AccountSelectPage = () => {
  const navigate = useNavigate();

  // 이메일 로그인 처리
  const handleEmailLogin = () => {
    navigate('/login');
  };

  // 네이버 로그인 처리
  const handleNaverLogin = () => {
    // 네이버 로그인 로직 구현
    console.log('네이버 로그인 클릭');
    // TODO: 네이버 OAuth 로그인 구현
  };

  // 카카오 로그인 처리
  const handleKakaoLogin = () => {
    // 카카오 로그인 로직 구현
    console.log('카카오 로그인 클릭');
    // TODO: 카카오 OAuth 로그인 구현
  };

  // 회원가입 페이지로 이동
  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="account-select-page">
      {/* 상단 좌측 로고 */}
      <header className="account-header">
        <img 
          src="/images/welllist_backno.png" 
          alt="WellList 로고" 
          className="account-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </header>

      {/* 계정 선택 본문 */}
      <main className="account-container">
        <h1 className="account-title">
          반가워요!<br />
          계정을 선택해주세요.
        </h1>

        <div className="account-buttons">
          <button className="account-btn welllist" onClick={handleEmailLogin}>
            <img src="/images/simple_logo.png" alt="이메일" className="logo-icon" />
            이메일로 시작하기
          </button>
          
          <button className="account-btn naver" onClick={handleNaverLogin}>
            <img src="/images/naver_logo.png" alt="네이버" className="logo-icon" />
            네이버로 시작하기
          </button>
          
          <button className="account-btn kakao" onClick={handleKakaoLogin}>
            <img src="/images/kakao_logo.png" alt="카카오" className="logo-icon" />
            카카오로 시작하기
          </button>
        </div>

        <div className="account-footer">
          아직 계정이 없으신가요?{' '}
          <button onClick={handleSignup} className="signup-link">
            회원가입
          </button>
        </div>
      </main>
    </div>
  );
};

export default AccountSelectPage;
