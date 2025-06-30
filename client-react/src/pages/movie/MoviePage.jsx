import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../../components/hero/Hero';
import ContentSection from '../../components/content/ContentSection';
import GenreDropdown from '../../components/dropdown/GenreDropdown';
import './MoviePage.css';

/**
 * 영화 전용 페이지 컴포넌트 - 메인 페이지와 동일한 UI 구조
 */
const MoviePage = () => {
  const location = useLocation();
  const [heroData, setHeroData] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('사용자');
  const [selectedGenre, setSelectedGenre] = useState('');

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
            genre: '공포/스릴러',
            poster_path: 'https://placehold.co/300x450?text=기생충',
            release_year: '2019',
            rating: '4.7',
            description: '계급 사회의 모순을 그린 작품'
          },
          {
            idx: '4',
            asset_nm: '아바타: 물의 길',
            genre: 'SF/판타지',
            poster_path: 'https://placehold.co/300x450?text=아바타+물의+길',
            release_year: '2022',
            rating: '4.6',
            description: '판도라에서 펼쳐지는 새로운 모험'
          },
          {
            idx: '5',
            asset_nm: '인터스텔라',
            genre: 'SF/판타지',
            poster_path: 'https://placehold.co/300x450?text=인터스텔라',
            release_year: '2014',
            rating: '4.8',
            description: '우주를 향한 인류의 마지막 희망'
          },
          {
            idx: '6',
            asset_nm: '라라랜드',
            genre: '로맨스',
            poster_path: 'https://placehold.co/300x450?text=라라랜드',
            release_year: '2016',
            rating: '4.5',
            description: '꿈을 향한 두 연인의 로맨틱한 뮤지컬'
          },
          {
            idx: '7',
            asset_nm: '조커',
            genre: '공포/스릴러',
            poster_path: 'https://placehold.co/300x450?text=조커',
            release_year: '2019',
            rating: '4.4',
            description: '광대에서 악역으로 변해가는 한 남자의 이야기'
          },
          {
            idx: '8',
            asset_nm: '토이 스토리 4',
            genre: '애니메이션',
            poster_path: 'https://placehold.co/300x450?text=토이+스토리+4',
            release_year: '2019',
            rating: '4.6',
            description: '장난감들의 마지막 모험'
          },
          {
            idx: '9',
            asset_nm: '극한직업',
            genre: '코미디',
            poster_path: 'https://placehold.co/300x450?text=극한직업',
            release_year: '2019',
            rating: '4.7',
            description: '치킨집을 차린 형사들의 코믹 수사극'
          },
          {
            idx: '10',
            asset_nm: '알라딘',
            genre: 'SF/판타지',
            poster_path: 'https://placehold.co/300x450?text=알라딘',
            release_year: '2019',
            rating: '4.3',
            description: '마법 양탄자를 타고 떠나는 모험'
          }
        ];
        
        setHeroData(sampleMovieData.slice(0, 5));
        setPopularMovies(sampleMovieData);
        setRecentMovies(sampleMovieData);
        setGenreMovies(sampleMovieData);
        setUserRecommendations(sampleMovieData);
        setFilteredMovies(sampleMovieData);
        
        setLoading(false);
      } catch (err) {
        console.error('영화 데이터 로드 오류:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadMovieData();
  }, []);

  // URL에서 장르 파라미터 읽기 및 필터링
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const genre = urlParams.get('genre') || '';
    setSelectedGenre(genre);
    
    // 장르가 선택되었을 때 필터링
    if (genre) {
      const filtered = popularMovies.filter(movie => 
        movie.genre.toLowerCase().includes(genre.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      // 장르가 선택되지 않았을 때는 모든 영화 표시
      setFilteredMovies(popularMovies);
    }
  }, [location.search, popularMovies]);

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
      {/* 장르 드롭다운 */}
      <div className="genre-filter-section">
        <GenreDropdown />
      </div>

      {/* 히어로 섹션 */}
      {heroData && heroData.length > 0 && (
        <Hero items={heroData} />
      )}
      
      {/* 콘텐츠 섹션들 */}
      <div className="content-sections">
        {selectedGenre ? (
          // 장르가 선택되었을 때: 필터된 결과만 표시
          <ContentSection
            title={`${selectedGenre} 영화`}
            items={filteredMovies}
            id="filtered-movies"
          />
        ) : (
          // 장르가 선택되지 않았을 때: 모든 섹션 표시
          <>
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
              title="장르별 추천 영화"
              items={genreMovies}
              id="genre-movies"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
