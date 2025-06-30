import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../../components/hero/Hero';
import ContentSection from '../../components/content/ContentSection';
// import { useAdultContentGate } from '../../hooks/useAdultContentGate';
import './AdultPage.css';

/**
 * 성인관 페이지 컴포넌트 - 임시로 간단화
 */
const AdultPage = () => {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState([]);
  const [top10Content, setTop10Content] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 임시로 인증 없이 바로 접근 허용
  const isAdultVerified = true;

  // 인증 성공 시 데이터 로드
  useEffect(() => {
    if (isAdultVerified) {
      loadAdultContent();
    }
  }, [isAdultVerified]);

  const loadAdultContent = async () => {
    setLoading(true);
    try {
      // 간단한 샘플 데이터
      const sampleData = [
        {
          idx: '1',
          asset_nm: '테스트 콘텐츠 1',
          genre: '드라마',
          poster_path: 'https://via.placeholder.com/300x450?text=Content+1',
          release_year: '2023',
          description: '테스트 콘텐츠입니다'
        },
        {
          idx: '2',
          asset_nm: '테스트 콘텐츠 2',
          genre: '영화',
          poster_path: 'https://via.placeholder.com/300x450?text=Content+2',
          release_year: '2023',
          description: '테스트 콘텐츠입니다'
        }
      ];

      setHeroData(sampleData);
      setTop10Content(sampleData);
      setLoading(false);
    } catch (err) {
      console.error('콘텐츠 로드 오류:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="adult-page">
        <div className="loading-container">
          <h2>콘텐츠를 불러오는 중...</h2>
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
            <span className="notice-text">🚧 테스트 모드 - Adult 페이지</span>
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
          title="테스트 콘텐츠"
          items={top10Content}
          id="test-section"
        />
      </div>
    </div>
  );
};

export default AdultPage;
