import { useState, useEffect } from 'react';
import ContentSection from '../../components/content/ContentSection';
import './MoviePage.css';

/**
 * 영화 전용 페이지 컴포넌트
 */
const MoviePage = () => {
  const [categories, setCategories] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        // 카테고리 및 장르 정보 가져오기
        const genresResponse = await fetch('/api/movies/genres');
        const genresData = await genresResponse.json();
        
        setCategories(genresData.genres || []);
        
        // 각 장르별 영화 가져오기
        const genrePromises = genresData.genres.map(async (genre) => {
          const response = await fetch(`/api/movies/genre/${genre.id}?limit=10`);
          const data = await response.json();
          return { genre: genre.name, movies: data.movies || [] };
        });
        
        const genreResults = await Promise.all(genrePromises);
        
        // 장르별 영화 객체 생성
        const genreMoviesObj = {};
        genreResults.forEach(result => {
          genreMoviesObj[result.genre] = result.movies;
        });
        
        setGenreMovies(genreMoviesObj);
      } catch (err) {
        console.error('영화 데이터 로드 중 오류:', err);
        setError('영화 콘텐츠를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieData();
  }, []);

  // 샘플 데이터 (API 실패 시 대체용)
  const sampleMovies = [
    {
      idx: '1',
      asset_nm: '샘플 영화 1',
      genre: '액션',
      poster_path: 'https://via.placeholder.com/300x450?text=Action+Movie+1',
      rlse_year: '2023'
    },
    {
      idx: '2',
      asset_nm: '샘플 영화 2',
      genre: '액션',
      poster_path: 'https://via.placeholder.com/300x450?text=Action+Movie+2',
      rlse_year: '2022'
    },
    {
      idx: '3',
      asset_nm: '샘플 영화 3',
      genre: '액션',
      poster_path: 'https://via.placeholder.com/300x450?text=Action+Movie+3',
      rlse_year: '2024'
    },
    {
      idx: '4',
      asset_nm: '샘플 영화 4',
      genre: '액션',
      poster_path: 'https://via.placeholder.com/300x450?text=Action+Movie+4',
      rlse_year: '2023'
    }
  ];

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h1>영화</h1>
        <p>다양한 장르의 영화를 탐색해보세요</p>
      </div>

      <div className="movie-content">
        {/* 인기 영화 */}
        <ContentSection 
          title="인기 영화"
          items={genreMovies['인기'] || sampleMovies}
          isLoading={loading}
          error={error}
        />
        
        {/* 최신 영화 */}
        <ContentSection 
          title="최신 영화"
          items={genreMovies['최신'] || sampleMovies}
          isLoading={loading}
          error={error}
        />
        
        {/* 각 장르별 영화 */}
        {categories.map(category => (
          <ContentSection 
            key={category.id}
            title={`${category.name} 영화`}
            items={genreMovies[category.name] || sampleMovies}
            isLoading={loading}
            error={error}
          />
        ))}
      </div>
    </div>
  );
};

export default MoviePage;
