import { useState, useEffect } from 'react';
import Hero from '../../components/hero/Hero';
import ContentSection from '../../components/content/ContentSection';
import GenreDropdown from '../../components/dropdown/GenreDropdown';
import './DramaPage.css';

/**
 * 드라마 전용 페이지 컴포넌트 - 메인 페이지와 동일한 UI 구조
 */
const DramaPage = () => {
  const [heroData, setHeroData] = useState([]);
  const [popularDramas, setPopularDramas] = useState([]);
  const [recentDramas, setRecentDramas] = useState([]);
  const [genreDramas, setGenreDramas] = useState([]);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [allDramas, setAllDramas] = useState([]); // 전체 드라마 데이터 저장
  const [selectedGenre, setSelectedGenre] = useState('전체'); // 선택된 장르
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('사용자');

  // 드라마 데이터 로드
  useEffect(() => {
    const loadDramaData = async () => {
      setLoading(true);
      try {
        // 드라마 전용 샘플 데이터
        const sampleDramaData = [
          {
            idx: '1',
            asset_nm: '사랑의 불시착',
            genre: '로맨스',
            poster_path: 'https://placehold.co/300x450?text=사랑의+불시착',
            release_year: '2019',
            rating: '4.9',
            description: '북한에 불시착한 재벌 상속녀와 특급 장교의 로맨스'
          },
          {
            idx: '2',
            asset_nm: '오징어 게임',
            genre: '스릴러',
            poster_path: 'https://placehold.co/300x450?text=오징어+게임',
            release_year: '2021',
            rating: '4.8',
            description: '456억의 상금을 걸고 목숨을 건 서바이벌 게임'
          },
          {
            idx: '3',
            asset_nm: '킹덤',
            genre: '사극',
            poster_path: 'https://placehold.co/300x450?text=킹덤',
            release_year: '2019',
            rating: '4.7',
            description: '조선시대 좀비 아포칼립스를 그린 작품'
          },
          {
            idx: '4',
            asset_nm: '이태원 클라쓰',
            genre: '드라마',
            poster_path: 'https://placehold.co/300x450?text=이태원+클라쓰',
            release_year: '2020',
            rating: '4.6',
            description: '젊은이들의 꿈과 도전을 그린 청춘 드라마'
          },
          {
            idx: '5',
            asset_nm: '더 글로리',
            genre: '복수극',
            poster_path: 'https://placehold.co/300x450?text=더+글로리',
            release_year: '2022',
            rating: '4.8',
            description: '학교폭력 피해자의 치밀한 복수 이야기'
          }
        ];
        
        setHeroData(sampleDramaData.slice(0, 5));
        setPopularDramas(sampleDramaData);
        setRecentDramas(sampleDramaData);
        setGenreDramas(sampleDramaData);
        setUserRecommendations(sampleDramaData);
        
        setLoading(false);
      } catch (err) {
        console.error('드라마 데이터 로드 오류:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadDramaData();
  }, []);

  if (loading) {
    return (
      <div className="drama-page">
        <div className="loading-container">
          <h2>드라마를 불러오는 중...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="drama-page">
        <div className="error-container">
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drama-page">
      {/* 히어로 섹션 */}
      {heroData && heroData.length > 0 && (
        <Hero items={heroData} />
      )}
      
      {/* 콘텐츠 섹션들 */}
      <div className="content-sections">
        <ContentSection
          title={`${userName}님을 위한 드라마 추천`}
          items={userRecommendations}
          id="user-drama-recommendations"
        />
        
        <ContentSection
          title="오늘의 인기 드라마"
          items={popularDramas}
          id="popular-dramas"
        />
        
        <ContentSection
          title="최신 드라마"
          items={recentDramas}
          id="recent-dramas"
        />
        
        <ContentSection
          title="로맨스 드라마"
          items={genreDramas}
          id="romance-dramas"
        />
      </div>
    </div>
  );
};

export default DramaPage;
