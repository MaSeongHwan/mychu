import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ContentSection from '../components/content/ContentSection';
import './Home.css';

/**
 * 홈페이지 (메인 화면) 컴포넌트
 * 히어로 슬라이더와 여러 콘텐츠 섹션으로 구성됨
 */
const HomePage = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 히어로 슬라이더 데이터 불러오기 (선택 사항)
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/recommendation/hero');
        if (response.ok) {
          const data = await response.json();
          if (data.result && data.result.length > 0) {
            setHeroData(data.result);
          }
        }
      } catch (error) {
        console.error('히어로 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <div className="home-page">
      <Header />
      
      {/* 히어로 슬라이더 */}
      <Hero slides={heroData} />
      
      <main className="main-content">
        <div className="container">
          {/* 인기 콘텐츠 섹션 */}
          <ContentSection 
            title="오늘의 인기 콘텐츠" 
            endpoint="/recommendation/top?n=10" 
            id="top-section"
          />
          
          {/* 감정/장르 기반 추천 섹션 */}
          <ContentSection 
            title="소금님, 오늘은 기분 전환이 필요해 보여요" 
            endpoint="/recommendation/mood?user_id=123&mood=happy" 
            id="genre-section"
          />
          
          {/* 최신 콘텐츠 섹션 */}
          <ContentSection 
            title="따끈따끈한 신작, 지금 만나보세요" 
            endpoint="/recommendation/new?n=10" 
            id="recent-section"
          />
          
          {/* 테스트 API 섹션 */}
          <ContentSection 
            title="테스트 API 기반 추천 슬라이더" 
            endpoint="/recommendation/test" 
            id="test-section"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
