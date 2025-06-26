import { useState, useEffect } from 'react';
import Hero from '../../components/hero/Hero';
import Slider from '../../components/slider/Slider';
import { getTodayRecommendations } from '../../services/todayRecommendationService';
import { getPopularContent, getEmotionContent, getRecentContent } from '../../services/recommendationService';
import { getCurrentUser } from '../../services/auth';
import './HomePage.css';

/**
 * 재사용 가능한 SliderSection 컴포넌트
 */
const SliderSection = ({ id, title, items }) => {
  return (
    <section className="slider-section" id={`${id}-section`}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="section-controls">
          <button className="control-btn prev-btn" aria-label="이전">
            <span className="icon icon-arrow-left"></span>
          </button>
          <button className="control-btn next-btn" aria-label="다음">
            <span className="icon icon-arrow-right"></span>
          </button>
        </div>
      </div>
      <div className="slider-container">
        {items && items.length > 0 ? (
          <Slider 
            items={items}
            title={title}
            sliderId={id}
            showTitle={false}
          />
        ) : (
          <div className="no-content">
            <p>콘텐츠를 불러오는 중입니다...</p>
          </div>
        )}
      </div>
    </section>
  );
};

/**
 * 현재 로그인된 사용자의 ID를 가져오는 함수
 */
const getCurrentUserId = () => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.user_idx) {
        return userData.user_idx;
      }
    }
    
    const sessionUserData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    if (sessionUserData.user_idx) {
      return sessionUserData.user_idx;
    }
    
    return 541; // 기본값
  } catch (error) {
    console.error('사용자 ID 가져오기 실패:', error);
    return 541;
  }
};

/**
 * 메인 홈페이지 컴포넌트 - 단순화된 3개 슬라이더 구조
 */
const HomePage = () => {
  // 상태 단순화
  const [heroData, setHeroData] = useState([]);
  const [slidersData, setSlidersData] = useState({
    popular: [],
    emotion: [],
    recent: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroError, setHeroError] = useState(null);

  useEffect(() => {
    loadMainPageData();
  }, []); // 빈 의존성 배열로 한 번만 실행

  const loadMainPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      setHeroError(null);
      
      const userId = getCurrentUserId();
      console.log('메인 페이지 데이터 로드 시작 - 사용자 ID:', userId);
      
      // Hero 데이터 로드 (개별 에러 처리)
      console.log('Hero 데이터 로드 중...');
      let heroResult = [];
      try {
        heroResult = await getTodayRecommendations(userId, 5);
        console.log('Hero 데이터 로드 성공:', heroResult?.length || 0, '개');
      } catch (err) {
        console.error('Hero 데이터 로드 실패:', err);
        setHeroError('Hero 콘텐츠를 불러올 수 없습니다.');
        heroResult = []; // 실패 시 빈 배열
      }
      
      console.log('슬라이더 데이터 로드 중...');
      const [popularResult, emotionResult, recentResult] = await Promise.all([
        getPopularContent({ limit: 10, isAdult: false }).catch(err => {
          console.error('인기 콘텐츠 로드 실패:', err);
          return [];
        }),
        getEmotionContent({ limit: 10, isAdult: false }).catch(err => {
          console.error('감정 콘텐츠 로드 실패:', err);
          return [];
        }),
        getRecentContent({ limit: 10, isAdult: false }).catch(err => {
          console.error('최신 콘텐츠 로드 실패:', err);
          return [];
        })
      ]);

      console.log('데이터 로드 완료:', {
        hero: heroResult?.length || 0,
        popular: popularResult?.length || 0,
        emotion: emotionResult?.length || 0,
        recent: recentResult?.length || 0
      });

      // Hero 데이터 설정
      if (heroResult && heroResult.length > 0) {
        setHeroData(heroResult);
        setHeroError(null);
      } else {
        setHeroError('추천 데이터가 없습니다.');
        console.warn('Hero 데이터가 없습니다. Fallback 데이터를 사용합니다.');
      }

      // 슬라이더 데이터 설정
      setSlidersData({
        popular: popularResult || [],
        emotion: emotionResult || [],
        recent: recentResult || []
      });
      
    } catch (err) {
      console.error('메인 페이지 데이터 로드 실패:', err);
      setError('데이터를 불러오는 중 문제가 발생했습니다.');
      setHeroError('추천 콘텐츠를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <h2>콘텐츠를 불러오는 중...</h2>
          <p>잠시만 기다려주세요.</p>
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
          <button onClick={loadMainPageData}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero 섹션 */}
      <Hero 
        items={heroData}
        loading={false}
        error={heroError}
      />
      
      {/* 메인 콘텐츠 - 3개의 슬라이더 */}
      <main className="main-content">
        <div className="container">
          
          {/* 1. Top 10 인기 콘텐츠 슬라이더 */}
          <SliderSection
            id="top10-slider"
            title="Top 10 인기 콘텐츠"
            items={slidersData.popular}
          />
          
          {/* 2. 감정 슬라이더 */}
          <SliderSection
            id="emotion-slider"
            title="감정 슬라이더"
            items={slidersData.emotion}
          />
          
          {/* 3. 최신 콘텐츠 슬라이더 */}
          <SliderSection
            id="recent-slider"
            title="최신 콘텐츠 슬라이더"
            items={slidersData.recent}
          />
          
        </div>
      </main>
    </div>
  );
};

export default HomePage;
