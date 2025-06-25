import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

/**
 * WellList 랜딩 페이지
 * 메인 진입점 - 하트 로고와 "지금 보러가기" 버튼
 */
const LandingPage = () => {
  const navigate = useNavigate();

  // 디버깅용 로그
  console.log('🎯 LandingPage 컴포넌트가 렌더링되었습니다!');

  const handleStartWatching = () => {
    // 계정 선택 페이지로 이동
    navigate('/account');
  };

  return (
    <div className="landing-page">
      {/* 배경 콘텐츠 격자 */}
      <div className="background-grid">
        {/* 배경 이미지들을 여기에 추가할 수 있습니다 */}
        <div className="grid-overlay"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="landing-content">
        {/* 브랜드 섹션 */}
        <div className="brand-section">
          <div className="brand-logo">
            <svg className="heart-logo" viewBox="0 0 24 24" fill="none">
              <path 
                d="M21 9c0-2.8-2.2-5-5-5-1.4 0-2.6.6-3.5 1.5L12 6l-.5-.5C10.6 4.6 9.4 4 8 4 5.2 4 3 6.2 3 9c0 1.3.5 2.5 1.3 3.4L12 20l7.7-7.6c.8-.9 1.3-2.1 1.3-3.4z" 
                fill="url(#heartGradient)"
              />
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e6f72a" />
                  <stop offset="100%" stopColor="#4ecdc4" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="brand-name">WellList</h1>
          </div>
        </div>

        {/* 메인 액션 버튼 */}
        <div className="action-section">
          <div className="action-badge">지금</div>
          <button 
            className="start-button"
            onClick={handleStartWatching}
          >
            지금 보러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
