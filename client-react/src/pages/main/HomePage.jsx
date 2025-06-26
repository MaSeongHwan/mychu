import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../../components/hero/Hero';
import Slider from '../../components/slider/Slider';
import GenreDropdown from '../../components/dropdown/GenreDropdown';
import { initRecommendationsForMain, initRecommendationsForDrama } from '../../services/recommendationHelpers';
import { getHeroContent } from '../../services/recommendationService';
import './HomePage.css';

/**
 * 메인 홈페이지 컴포넌트
 */
const HomePage = () => {
  const location = useLocation();
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
  const [allContent, setAllContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('사용자');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // 병렬로 데이터 로드
        const [heroContent, movieData, dramaData] = await Promise.all([
          getHeroContent(),
          initRecommendationsForMain(),
          initRecommendationsForDrama()
        ]);

        console.log('Hero Content:', heroContent);
        console.log('Movie Data:', movieData);
        console.log('Drama Data:', dramaData);

        setHeroData(heroContent);
        setMovieRecommendations(movieData);
        setDramaRecommendations(dramaData);
        
        // 전체 콘텐츠 합치기 (필터링용)
        const allItems = [
          ...movieData.topItems,
          ...movieData.emoItems,
          ...movieData.recentItems,
          ...dramaData.topItems,
          ...dramaData.emoItems,
          ...dramaData.recentItems
        ];
        setAllContent(allItems);
        setFilteredContent(allItems);

      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // URL에서 장르 파라미터 읽기 및 필터링
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const genre = urlParams.get('genre') || '';
    setSelectedGenre(genre);
    
    // 장르가 선택되었을 때 필터링
    if (genre) {
      const filtered = allContent.filter(item => 
        item.genre && item.genre.toLowerCase().includes(genre.toLowerCase())
      );
      setFilteredContent(filtered);
    } else {
      // 장르가 선택되지 않았을 때는 모든 콘텐츠 표시
      setFilteredContent(allContent);
    }
  }, [location.search, allContent]);

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
      {/* 장르 드롭다운 */}
      <div className="genre-filter-section">
        <GenreDropdown />
      </div>

      {/* 히어로 섹션 */}
      {heroData && heroData.length > 0 && (
        <Hero items={heroData} />
      )}

      {/* 추천 콘텐츠 섹션 - 원본 main.html 구조 재현 */}
      <main className="main-content">
        <div className="container">
          
          {selectedGenre ? (
            // 장르가 선택되었을 때: 필터된 결과만 표시
            <section className="section" id="filtered-section">
              <div className="section-header">
                <h2>{selectedGenre} 콘텐츠</h2>
                <div className="section-controls">
                  <button className="control-btn prev-btn">
                    <span className="icon icon-arrow-left"></span>
                  </button>
                  <button className="control-btn next-btn">
                    <span className="icon icon-arrow-right"></span>
                  </button>
                </div>
              </div>
              <div className="slider">
                <Slider 
                  items={filteredContent}
                  title={`${selectedGenre} 추천`}
                  showTitle={false}
                />
              </div>
            </section>
          ) : (
            // 장르가 선택되지 않았을 때: 원본 HTML 구조와 동일한 3개 섹션 표시
            <>
              {/* 1. 인기 콘텐츠 */}
              <section className="section" id="top-section">
                <div className="section-header">
                  <h2>오늘의 인기 콘텐츠</h2>
                  <div className="section-controls">
                    <button className="control-btn prev-btn">
                      <span className="icon icon-arrow-left"></span>
                    </button>
                    <button className="control-btn next-btn">
                      <span className="icon icon-arrow-right"></span>
                    </button>
                  </div>
                </div>
                <div className="slider" id="popular-main-slider">
                  <Slider 
                    items={movieRecommendations.topItems.concat(dramaRecommendations.topItems)}
                    title="오늘의 인기 콘텐츠"
                    showTitle={false}
                  />
                </div>
              </section>

              {/* 2. 감정 기반 or 장르 기반 추천 */}
              <section className="section" id="genre-section">
                <div className="section-header">
                  <h2 id="genre-main-heading">{userName}님, 오늘은 기분 전환이 필요해 보여요</h2>
                  <div className="section-controls">
                    <button className="control-btn prev-btn">
                      <span className="icon icon-arrow-left"></span>
                    </button>
                    <button className="control-btn next-btn">
                      <span className="icon icon-arrow-right"></span>
                    </button>
                  </div>
                </div>
                <div className="slider" id="genre-main-slider">
                  <Slider 
                    items={movieRecommendations.emoItems.concat(dramaRecommendations.emoItems)}
                    title="감정 기반 추천"
                    showTitle={false}
                  />
                </div>
              </section>

              {/* 3. 최신 콘텐츠 슬라이더 섹션 */}
              <section className="section" id="recent-section">
                <div className="section-header">
                  <h2>따끈따끈한 신작, 지금 만나보세요</h2>
                  <div className="section-controls">
                    <button className="control-btn prev-btn">
                      <span className="icon icon-arrow-left"></span>
                    </button>
                    <button className="control-btn next-btn">
                      <span className="icon icon-arrow-right"></span>
                    </button>
                  </div>
                </div>
                <div className="slider" id="recent-main-slider">
                  <Slider 
                    items={movieRecommendations.recentItems.concat(dramaRecommendations.recentItems)}
                    title="최신 콘텐츠"
                    showTitle={false}
                  />
                </div>
              </section>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default HomePage;
