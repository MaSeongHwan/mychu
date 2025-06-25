import { useState, useEffect } from 'react';
import Hero from '../../components/hero/Hero';
import Slider from '../../components/slider/Slider';
import { initRecommendationsForMain, initRecommendationsForDrama } from '../../services/recommendationHelpers';
import { getHeroContent } from '../../services/recommendationService';
import './HomePage.css';

/**
 * 메인 홈페이지 컴포넌트
 * 영화와 드라마로 구분된 추천 섹션으로 구성
 */
const HomePage = () => {
  const [heroData, setHeroData] = useState([]);
  const [movieRecommendations, setMovieRecommendations] = useState({
    topItems: [],
    emoItems: [],
    recentItems: []
  });
  const [dramaRecommendations, setDramaRecommendations] = useState({
    topItems: [],
    emoItems: [],
    recentItems: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('사용자');

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // 병렬로 데이터 로드
        const [heroContent, movieData, dramaData] = await Promise.all([
          // 히어로 콘텐츠 (전체 콘텐츠)
          getHeroContent({ isMovie: null, limit: 5 }),
          
          // 영화 추천 데이터
          initRecommendationsForMain(),
          
          // 드라마 추천 데이터
          initRecommendationsForDrama()
        ]);

        setHeroData(heroContent);
        setMovieRecommendations(movieData);
        setDramaRecommendations(dramaData);

      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-container">
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* 히어로 섹션 */}
      {heroData && heroData.length > 0 && (
        <Hero items={heroData} />
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="main-content">
        
        {/* 영화 섹션 */}
        <section className="content-category">
          <div className="category-header">
            <h2 className="category-title">🎬 영화</h2>
            <p className="category-subtitle">최신 영화와 인기 영화를 만나보세요</p>
          </div>
          
          <div className="content-sections">
            {movieRecommendations.topItems.length > 0 && (
              <Slider
                items={movieRecommendations.topItems}
                title={`${userName}님을 위한 인기 영화 Top10`}
                sliderId="movie-top-slider"
              />
            )}

            {movieRecommendations.emoItems.length > 0 && (
              <Slider
                items={movieRecommendations.emoItems}
                title="감정 기반 영화 추천"
                sliderId="movie-emotion-slider"
              />
            )}

            {movieRecommendations.recentItems.length > 0 && (
              <Slider
                items={movieRecommendations.recentItems}
                title="최근 시청 기반 영화 추천"
                sliderId="movie-recent-slider"
              />
            )}
          </div>
        </section>

        {/* 드라마 섹션 */}
        <section className="content-category">
          <div className="category-header">
            <h2 className="category-title">📺 드라마</h2>
            <p className="category-subtitle">감동적인 드라마와 화제의 시리즈</p>
          </div>
          
          <div className="content-sections">
            {dramaRecommendations.topItems.length > 0 && (
              <Slider
                items={dramaRecommendations.topItems}
                title={`${userName}님을 위한 인기 드라마 Top10`}
                sliderId="drama-top-slider"
              />
            )}

            {dramaRecommendations.emoItems.length > 0 && (
              <Slider
                items={dramaRecommendations.emoItems}
                title="감정 기반 드라마 추천"
                sliderId="drama-emotion-slider"
              />
            )}

            {dramaRecommendations.recentItems.length > 0 && (
              <Slider
                items={dramaRecommendations.recentItems}
                title="최근 시청 기반 드라마 추천"
                sliderId="drama-recent-slider"
              />
            )}
          </div>
        </section>

        {/* 빈 상태 처리 */}
        {movieRecommendations.topItems.length === 0 && 
         dramaRecommendations.topItems.length === 0 && (
          <div className="empty-content">
            <h3>표시할 추천 콘텐츠가 없습니다</h3>
            <p>잠시 후 다시 시도해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
