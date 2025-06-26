import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import simpleLogo from '../../assets/images/logos/simple_logo.png';
import topLogo from '../../assets/images/logos/welllist_backno.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartWatching = () => {
    navigate('/account');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="landing-page">
      {/* 왼쪽 상단 로고 */}
      <div className="top-left-logo" onClick={handleGoHome}>
        <img src={topLogo} alt="WellList 홈 로고" />
      </div>

      {/* 배경 이미지 슬라이드 */}
      <div className="background-slide"></div>

      {/* 메인 콘텐츠 */}
      <div className="landing-content">
        {/* 브랜드 로고 이미지 */}
        <img
          src={simpleLogo}
          alt="WellList 로고"
          className="logo-image-centered"
        />

        {/* 액션 버튼 */}
        <div className="action-section">
          <button className="start-button" onClick={handleStartWatching}>
            지금 보러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
