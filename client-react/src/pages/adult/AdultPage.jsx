import { useState, useEffect } from 'react';
import Hero from '../../components/hero/Hero';
import ContentSection from '../../components/content/ContentSection';
import PasswordModal from './PasswordModal';
import './AdultPage.css';

/**
 * 성인관 페이지 컴포넌트 - HTML/CSS를 React로 구현
 * 비밀번호 인증 + 메인 페이지와 동일한 UI 구조
 */
const AdultPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [heroData, setHeroData] = useState([]);
  const [top10Content, setTop10Content] = useState([]);
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [latestContent, setLatestContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 인증 성공 시 데이터 로드
  useEffect(() => {
    if (isAuthenticated) {
      loadAdultContent();
    }
  }, [isAuthenticated]);

  const loadAdultContent = async () => {
    setLoading(true);
    try {
      // 성인 콘텐츠 샘플 데이터
      const sampleAdultData = [
        {
          idx: '1',
          asset_nm: 'Top1 성인물',
          genre: '19+',
          poster_path: 'https://postfiles.pstatic.net/MjAyNTA2MThfODQg/MDAxNzUwMjE2MjQ5ODA0.-PxedGvLKzmDaTYGYx61lEpIFJ5N6wINuO3FCopjtIIg.eusuqu161SSZioPOpAwtNHLKh9r_ZsFBZgZXbxi36EIg.PNG/180.png?type=w773',
          release_year: '2023',
          rating: '4.8',
          description: '성인 전용 콘텐츠입니다'
        },
        {
          idx: '2',
          asset_nm: 'Top2 성인물',
          genre: '19+',
          poster_path: 'https://postfiles.pstatic.net/MjAyNTA2MThfOTIg/MDAxNzUwMjE2MjQ5NzQx.uMZ7SZaof0QEtnQ_f27rwrEC9agWbuWBtrjwICpmHIMg.kvvgDxGaBgimAicX5UkFl2zqD_pREvUteYClYBhf4_cg.PNG/190.png?type=w773',
          release_year: '2023',
          rating: '4.7',
          description: '성인 전용 콘텐츠입니다'
        },
        {
          idx: '3',
          asset_nm: 'Top3 성인물',
          genre: '19+',
          poster_path: 'https://postfiles.pstatic.net/MjAyNTA2MThfMjc5/MDAxNzUwMjE2MjQ5NzIz.U4zTW_VWUKcBzHiIdVcxKVWcIsZg04JadVrlxbB-aqkg._Sa7J8N-1-cD8G4kWBSl2zqD_pREvUteYClYBhf4_cg.PNG/200.png?type=w773',
          release_year: '2023',
          rating: '4.6',
          description: '성인 전용 콘텐츠입니다'
        },
        {
          idx: '4',
          asset_nm: '추천 성인물1',
          genre: '19+',
          poster_path: 'https://postfiles.pstatic.net/MjAyNTA2MThfODQg/MDAxNzUwMjE2MjQ5ODA0.-PxedGvLKzmDaTYGYx61lEpIFJ5N6wINuO3FCopjtIIg.eusuqu161SSZioPOpAwtNHLKh9r_ZsFBZgZXbxi36EIg.PNG/180.png?type=w773',
          release_year: '2022',
          rating: '4.5',
          description: '성인 전용 콘텐츠입니다'
        },
        {
          idx: '5',
          asset_nm: '최신 성인물1',
          genre: '19+',
          poster_path: 'https://postfiles.pstatic.net/MjAyNTA2MThfOTIg/MDAxNzUwMjE2MjQ5NzQx.uMZ7SZaof0QEtnQ_f27rwrEC9agWbuWBtrjwICpmHIMg.kvvgDxGaBgimAicX5UkFl2zqD_pREvUteYClYBhf4_cg.PNG/190.png?type=w773',
          release_year: '2024',
          rating: '4.4',
          description: '성인 전용 콘텐츠입니다'
        }
      ];

      setHeroData(sampleAdultData.slice(0, 3));
      setTop10Content(sampleAdultData);
      setRecommendedContent(sampleAdultData);
      setLatestContent(sampleAdultData);
      
      setLoading(false);
    } catch (err) {
      console.error('성인 콘텐츠 로드 오류:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    setShowPasswordModal(false);
  };

  const handlePasswordCancel = () => {
    // 메인 페이지로 리다이렉트
    window.location.href = '/main';
  };

  if (showPasswordModal) {
    return (
      <PasswordModal
        onSuccess={handlePasswordSuccess}
        onCancel={handlePasswordCancel}
      />
    );
  }

  if (loading) {
    return (
      <div className="adult-page">
        <div className="loading-container">
          <h2>성인 콘텐츠를 불러오는 중...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adult-page">
        <div className="error-container">
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adult-page">
      {/* 성인관 안내 문구 */}
      <div className="adult-notice">
        <div className="container">
          <div className="notice-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="notice-icon">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span className="notice-text">성인관에 입장하셨습니다. 19세 이상만 이용 가능한 콘텐츠입니다.</span>
          </div>
        </div>
      </div>

      {/* 히어로 섹션 */}
      {heroData && heroData.length > 0 && (
        <Hero items={heroData} />
      )}
      
      {/* 콘텐츠 섹션들 */}
      <div className="content-sections">
        <ContentSection
          title="Top10 인기작"
          items={top10Content}
          id="top10-section"
        />
        
        <ContentSection
          title="추천 콘텐츠"
          items={recommendedContent}
          id="recommended-section"
        />
        
        <ContentSection
          title="최신 작품"
          items={latestContent}
          id="latest-section"
        />
      </div>
    </div>
  );
};

export default AdultPage;
