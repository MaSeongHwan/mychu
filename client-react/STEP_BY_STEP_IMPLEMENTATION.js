/**
 * HomePage 3개 슬라이더 구현 단계별 가이드
 */

// ===== STEP 1: 기존 복잡한 구조 제거 =====

/*
제거할 코드들:
- initRecommendationsForMain()
- initRecommendationsForDrama() 
- 복잡한 movieRecommendations/dramaRecommendations 구조
- 장르 필터링 로직 (일단 단순화)
*/

// ===== STEP 2: 새로운 HomePage.jsx 구조 =====

import React, { useState, useEffect } from 'react';
import Hero from '../../components/hero/Hero';
import Slider from '../../components/slider/Slider';
import { getTodayRecommendations } from '../../services/todayRecommendationService';
import { getPopularContent, getEmotionContent, getRecentContent } from '../../services/recommendationService';
import './HomePage.css';

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

  useEffect(() => {
    loadMainPageData();
  }, []);

  const loadMainPageData = async () => {
    try {
      setLoading(true);
      
      // 모든 데이터를 병렬로 로드
      const [heroResult, popularResult, emotionResult, recentResult] = await Promise.all([
        getTodayRecommendations(541, 5), // 하드코딩된 사용자 ID
        getPopularContent({ limit: 10, isAdult: false }),
        getEmotionContent({ limit: 10, isAdult: false }),
        getRecentContent({ limit: 10, isAdult: false })
      ]);

      setHeroData(heroResult);
      setSlidersData({
        popular: popularResult,
        emotion: emotionResult,
        recent: recentResult
      });
      
    } catch (err) {
      console.error('메인 페이지 데이터 로드 실패:', err);
      setError('데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>콘텐츠를 불러오는 중...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>오류가 발생했습니다</h2>
        <p>{error}</p>
        <button onClick={loadMainPageData}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero 섹션 */}
      <Hero items={heroData} />
      
      {/* 메인 콘텐츠 */}
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

// ===== STEP 3: 재사용 가능한 SliderSection 컴포넌트 =====

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
        <Slider 
          items={items}
          title={title}
          sliderId={id}
          showTitle={false}
        />
      </div>
    </section>
  );
};

export default HomePage;

// ===== STEP 4: 개선 포인트 체크리스트 =====

/*
✅ Hero 섹션 유지
✅ 3개의 명확한 슬라이더 구조
✅ 각 슬라이더별 고유 스타일링
✅ 단순화된 데이터 로딩
✅ 에러 처리 및 로딩 상태
✅ 재사용 가능한 컴포넌트
✅ 접근성 개선 (aria-label)
✅ 반응형 디자인 고려

🔄 추후 개선 사항:
- 사용자별 개인화 강화
- 장르 필터링 재추가 (선택사항)
- 무한 스크롤 또는 페이지네이션
- 슬라이더 자동 재생 기능
- 키보드 네비게이션 지원
*/
