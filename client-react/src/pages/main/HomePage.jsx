import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../../components/hero/Hero';
import Slider from '../../components/slider/Slider';
import GenreDropdown from '../../components/dropdown/GenreDropdown';
import { initRecommendationsForMain, initRecommendationsForDrama } from '../../services/recommendationHelpers';
import { getTodayRecommendations } from '../../services/todayRecommendationService';
import { getCurrentUser } from '../../services/auth';
import './HomePage.css';

/**
 * 현재 로그인된 사용자의 ID를 가져오는 함수
 * 실제 로그인 시스템과 연동되어야 함
 */
const getCurrentUserId = () => {
  try {
    // 방법 1: Firebase Auth 사용자 정보에서 user_idx 추출
    const currentUser = getCurrentUser();
    if (currentUser) {
      // 사용자 데이터에서 user_idx를 찾기
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.user_idx) {
        console.log('localStorage에서 user_idx 발견:', userData.user_idx);
        return userData.user_idx;
      }
    }
    
    // 방법 2: 세션 스토리지 확인
    const sessionUserData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    if (sessionUserData.user_idx) {
      console.log('sessionStorage에서 user_idx 발견:', sessionUserData.user_idx);
      return sessionUserData.user_idx;
    }
    
    // 방법 3: 임시로 하드코딩된 값 사용 (로그인된 사용자 ID: 541)
    console.log('저장된 사용자 정보 없음, 하드코딩된 ID 사용: 541');
    return 541;
  } catch (error) {
    console.error('사용자 ID 가져오기 실패:', error);
    return 541; // 기본값
  }
};

/**
 * 메인 홈페이지 컴포넌트
 */
const HomePage = () => {
  const location = useLocation();
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
  const [heroItems, setHeroItems] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroError, setHeroError] = useState(null);
  const [userName, setUserName] = useState('사용자');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setHeroLoading(true);
      try {
        // 실제 로그인된 사용자 ID 가져오기
        const userId = getCurrentUserId(); // 로그인된 사용자 ID (541)
        console.log('HomePage - 현재 사용자 ID:', userId);
        
        // Hero 데이터와 다른 데이터 동시 로드
        const [heroData, movieData, dramaData] = await Promise.all([
          getTodayRecommendations(userId, 5),
          initRecommendationsForMain(),
          initRecommendationsForDrama()
        ]);

        console.log('Hero Data:', heroData);
        console.log('Movie Data:', movieData);
        console.log('Drama Data:', dramaData);

        // Hero 데이터 설정
        if (heroData && heroData.length > 0) {
          setHeroItems(heroData);
          setHeroError(null);
        } else {
          setHeroError('추천 데이터가 없습니다.');
        }

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
        setHeroError('추천 콘텐츠를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
        setHeroLoading(false);
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

      {/* 히어로 섹션 - 오늘의 추천 API 사용 */}
      <Hero 
        items={heroItems}
        loading={heroLoading}
        error={heroError}
      />

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
                  sliderId={`filtered-${selectedGenre}`}
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
                    sliderId="popular-main-slider"
                    showTitle={false}
                  />
                </div>
              </section>

              {/* 2. 감정 기반 or 장르 기반 추천 */}
              <section className="section" id="genre-section">
                <div className="section-header">
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
                    title="{userName}님, 오늘은 기분 전환이 필요해 보여요"
                    sliderId="genre-main-slider"
                    showTitle={false}
                  />
                </div>
              </section>

              {/* 3. 최신 콘텐츠 슬라이더 섹션 */}
              <section className="section" id="recent-section">
                <div className="section-header">
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
                    title="따끈따끈한 신작, 지금 만나보세요"
                    sliderId="recent-main-slider"
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
