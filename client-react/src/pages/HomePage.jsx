import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ContentSection from '../components/content/ContentSection';
import './HomePage.css';

/**
 * 메인 홈페이지 컴포넌트
 * 웹사이트 홈페이지의 전체 레이아웃과 콘텐츠 섹션 구성
 */
const HomePage = () => {
  const [heroData, setHeroData] = useState([]);
  const [popularContent, setPopularContent] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [genreContent, setGenreContent] = useState([]);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  // 사용자 정보 및 기타 데이터 로드
  useEffect(() => {
    // 사용자 이름 가져오기 (추후 실제 인증 시스템과 연동)
    setUserName('소금');
    
    // 모든 데이터 로드
    const loadAllData = async () => {
      setLoading(true);
      try {
        // 병렬로 여러 API 엔드포인트 호출
        const [heroResponse, popularResponse, recentResponse, genreResponse, userRecResponse] = await Promise.all([
          fetch('/api/recommendation/hero'),
          fetch('/api/recommendation/popular?limit=10'),
          fetch('/api/recommendation/recent?limit=10'),
          fetch('/api/recommendation/genre?genre=액션&limit=10'),
          fetch('/recommendation/test?n=10') // 테스트 API 활용
        ]);
        
        // 응답 처리
        const heroData = await heroResponse.json();
        const popularData = await popularResponse.json();
        const recentData = await recentResponse.json();
        const genreData = await genreResponse.json();
        const userRecData = await userRecResponse.json();
        
        // 상태 업데이트
        setHeroData(heroData.result || []);
        setPopularContent(popularData.result || []);
        setRecentContent(recentData.result || []);
        setGenreContent(genreData.result || []);
        setUserRecommendations(userRecData.result || []);
        
      } catch (err) {
        console.error('데이터 로드 중 오류:', err);
        setError('콘텐츠를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, []);

  // 샘플 데이터 (API 실패 시 대체용)
  const sampleContentItems = [
    {
      idx: '1',
      asset_nm: '샘플 영화 1',
      genre: '액션',
      poster_path: 'https://via.placeholder.com/300x450?text=Movie+1',
      rlse_year: '2023'
    },
    {
      idx: '2',
      asset_nm: '샘플 영화 2',
      genre: '드라마',
      poster_path: 'https://via.placeholder.com/300x450?text=Movie+2',
      rlse_year: '2022'
    },
    {
      idx: '3',
      asset_nm: '샘플 영화 3',
      genre: '코미디',
      poster_path: 'https://via.placeholder.com/300x450?text=Movie+3',
      rlse_year: '2021'
    },
    {
      idx: '4',
      asset_nm: '샘플 영화 4',
      genre: '스릴러',
      poster_path: 'https://via.placeholder.com/300x450?text=Movie+4',
      rlse_year: '2023'
    },
    {
      idx: '5',
      asset_nm: '샘플 영화 5',
      genre: 'SF',
      poster_path: 'https://via.placeholder.com/300x450?text=Movie+5',
      rlse_year: '2022'
    },
    {
      idx: '6',
      asset_nm: '샘플 영화 6',
      genre: '판타지',
      poster_path: 'https://via.placeholder.com/300x450?text=Movie+6',
      rlse_year: '2020'
    }
  ];

  return (
    <div className="app">
      {/* 헤더 */}
      <Header />
      
      {/* 히어로 섹션 */}
      <Hero slides={heroData.length > 0 ? heroData : undefined} />
      
      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <div className="container">
          {/* 인기 콘텐츠 */}
          <ContentSection 
            title="오늘의 인기 콘텐츠" 
            endpoint="/api/recommendation/popular?limit=10"
            id="popular-content"
            items={popularContent.length > 0 ? popularContent : (loading ? [] : sampleContentItems)}
          />
          
          {/* 감정 기반 추천 */}
          <ContentSection 
            title={`${userName}님, 오늘은 기분 전환이 필요해 보여요`}
            endpoint="/api/recommendation/genre?genre=코미디&limit=10"
            id="genre-content"
            items={genreContent.length > 0 ? genreContent : (loading ? [] : sampleContentItems)}
          />
          
          {/* 최신 콘텐츠 */}
          <ContentSection 
            title="따끈따끈한 신작, 지금 만나보세요"
            endpoint="/api/recommendation/recent?limit=10"
            id="recent-content"
            items={recentContent.length > 0 ? recentContent : (loading ? [] : sampleContentItems)}
          />
          
          {/* 테스트용 API 기반 추천 */}
          <ContentSection 
            title="테스트 API 기반 추천 슬라이더 (10개)"
            endpoint="/recommendation/test?n=10"
            id="test-recommendation"
            items={userRecommendations.length > 0 ? userRecommendations : []}
          />
        </div>
      </main>
      
      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default HomePage;
