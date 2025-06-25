import { useState, useEffect } from 'react';
import Hero from '../../components/hero/Hero';
import ContentSection from '../../components/content/ContentSection';
import { recommendationAPI } from '../../services/api';
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
    }
  ];

  // 실패 시 샘플 데이터 사용
  const heroContent = heroData.length > 0 ? heroData[0] : {
    idx: '1',
    asset_nm: '히어로 샘플 콘텐츠',
    genre: '드라마',
    poster_path: 'https://via.placeholder.com/1200x600?text=Hero+Banner',
    backdrop_path: 'https://via.placeholder.com/1920x1080?text=Hero+Background',
    synopsis: '이것은 히어로 섹션에 표시될 샘플 콘텐츠입니다. API 연동 시 실제 데이터로 대체됩니다.'
  };

  return (
    <div className="home-page">
      {/* 히어로 섹션 */}
      <Hero 
        content={heroContent}
        isLoading={loading}
      />

      {/* 콘텐츠 섹션들 */}
      <div className="content-sections">
        {/* 인기 콘텐츠 */}
        <ContentSection 
          title="인기 콘텐츠"
          items={popularContent.length > 0 ? popularContent : sampleContentItems}
          isLoading={loading}
          error={error}
        />
        
        {/* 최신 콘텐츠 */}
        <ContentSection 
          title="최신 업데이트"
          items={recentContent.length > 0 ? recentContent : sampleContentItems}
          isLoading={loading}
          error={error}
        />
        
        {/* 장르별 콘텐츠 */}
        <ContentSection 
          title="액션 영화"
          items={genreContent.length > 0 ? genreContent : sampleContentItems}
          isLoading={loading}
          error={error}
        />
        
        {/* 사용자 추천 콘텐츠 */}
        <ContentSection 
          title={`${userName}님을 위한 추천`}
          items={userRecommendations.length > 0 ? userRecommendations : sampleContentItems}
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default HomePage;
