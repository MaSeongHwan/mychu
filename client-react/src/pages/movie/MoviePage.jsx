import { useState, useEffect } from 'react';
import Hero from '../../components/hero/Hero';
import ContentSection from '../../components/content/ContentSection';
import './MoviePage.css';

/**
 * 영화 전용 페이지 컴포넌트 - 메인 페이지와 동일한 UI 구조
 */
const MoviePage = () => {
  const [heroData, setHeroData] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('사용자');

  // 영화 데이터 로드
  useEffect(() => {
    const loadMovieData = async () => {
      setLoading(true);
      try {
        // 영화 전용 샘플 데이터
        const sampleMovieData = [
          {
            idx: '1',
            asset_nm: '탑건: 매버릭',
            genre: '액션',
            poster_path: 'https://placehold.co/300x450?text=탑건+매버릭',
            release_year: '2022',
            rating: '4.8',
            description: '전설적인 파일럿 매버릭이 돌아온다'
          },
          {
            idx: '2',
            asset_nm: '어벤져스: 엔드게임',
            genre: '액션',
            poster_path: 'https://placehold.co/300x450?text=어벤져스+엔드게임',
            release_year: '2019',
            rating: '4.9',
            description: '마블 시네마틱 유니버스의 대서사시'
          },
          {
            idx: '3',
            asset_nm: '기생충',
            genre: '스릴러',
            poster_path: 'https://placehold.co/300x450?text=기생충',
            release_year: '2019',
            rating: '4.7',
            description: '계급 사회의 모순을 그린 작품'
          },
          {
            idx: '4',
            asset_nm: '아바타: 물의 길',
            genre: 'SF',
            poster_path: 'https://placehold.co/300x450?text=아바타+물의+길',
            release_year: '2022',
            rating: '4.6',
            description: '판도라에서 펼쳐지는 새로운 모험'
          },
          {
            idx: '5',
            asset_nm: '인터스텔라',
            genre: 'SF',
            poster_path: 'https://placehold.co/300x450?text=인터스텔라',
            release_year: '2014',
            rating: '4.8',
            description: '우주를 향한 인류의 마지막 희망'
          }
        ];
        
        setHeroData(sampleMovieData.slice(0, 5));
        setPopularMovies(sampleMovieData);
        setRecentMovies(sampleMovieData);
        setGenreMovies(sampleMovieData);
        setUserRecommendations(sampleMovieData);
        
        setLoading(false);
      } catch (err) {
        console.error('영화 데이터 로드 오류:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadMovieData();
  }, []);

  if (loading) {
    return (
      <div className="movie-page">
        <div className="loading-container">
          <h2>영화를 불러오는 중...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-page">
        <div className="error-container">
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-page">
      {/* 히어로 섹션 */}
      {heroData && heroData.length > 0 && (
        <Hero items={heroData} />
      )}
      
      {/* 콘텐츠 섹션들 */}
      <div className="content-sections">
        <ContentSection
          title={`${userName}님을 위한 영화 추천`}
          items={userRecommendations}
          id="user-movie-recommendations"
        />
        
        <ContentSection
          title="오늘의 인기 영화"
          items={popularMovies}
          id="popular-movies"
        />
        
        <ContentSection
          title="최신 영화"
          items={recentMovies}
          id="recent-movies"
        />
        
        <ContentSection
          title="액션 영화"
          items={genreMovies}
          id="action-movies"
        />
      </div>
    </div>
  );
};

export default MoviePage;
