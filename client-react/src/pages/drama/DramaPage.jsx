import { useState, useEffect } from 'react';
import ContentSection from '../../components/content/ContentSection';
import { tryApiWithMockFallback, mockApi } from '../../services/mockApi';
import './DramaPage.css';

/**
 * 드라마 전용 페이지 컴포넌트
 */
const DramaPage = () => {
  const [categories, setCategories] = useState([]);
  const [genreDramas, setGenreDramas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  useEffect(() => {
    const fetchDramaData = async () => {
      setLoading(true);
      try {
        console.log('드라마 데이터 가져오기 시작');
        
        // 실제 API 또는 모의 데이터 가져오기
        const genresData = await tryApiWithMockFallback(
          '/api/dramas/genres', 
          mockApi.getDramaGenres
        );
        
        console.log('장르 데이터 받음:', genresData);
        
        // 사용 가능한 장르 처리
        const availableGenres = genresData.genres || [];
        setCategories(availableGenres);
        
        if (availableGenres.length > 0) {
          // 각 장르별 드라마 가져오기
          const genrePromises = availableGenres.map(async (genre) => {
            const data = await tryApiWithMockFallback(
              `/api/dramas/genre/${genre.id}?limit=10`,
              mockApi.getDramasByGenre,
              [genre.id]
            );
            return { genre: genre.name, dramas: data.dramas || [] };
          });
          
          const genreResults = await Promise.all(genrePromises);
          
          // 장르별 드라마 객체 생성
          const genreDramasObj = {};
          genreResults.forEach(result => {
            genreDramasObj[result.genre] = result.dramas;
          });
          
          console.log('장르별 드라마 데이터:', genreDramasObj);
          setGenreDramas(genreDramasObj);
        }
      } catch (err) {
        console.error('드라마 데이터 로드 중 오류:', err);
        setError('드라마 콘텐츠를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDramaData();
  }, []);
  // 샘플 데이터 (API 실패 시 대체용)
  const sampleDramas = [
    {
      idx: '101',
      asset_nm: '이상한 변호사 우영우',
      genre: '법정',
      poster_path: 'https://via.placeholder.com/300x450?text=Extraordinary+Attorney+Woo',
      rlse_year: '2022'
    },
    {
      idx: '102',
      asset_nm: '오징어 게임',
      genre: '스릴러',
      poster_path: 'https://via.placeholder.com/300x450?text=Squid+Game',
      rlse_year: '2021'
    },
    {
      idx: '103',
      asset_nm: '사랑의 불시착',
      genre: '로맨스',
      poster_path: 'https://via.placeholder.com/300x450?text=Crash+Landing+On+You',
      rlse_year: '2020'
    },
    {
      idx: '104',
      asset_nm: '슬기로운 의사생활',
      genre: '의학',
      poster_path: 'https://via.placeholder.com/300x450?text=Hospital+Playlist',
      rlse_year: '2020'
    },
    {
      idx: '105',
      asset_nm: '마이 네임',
      genre: '액션',
      poster_path: 'https://via.placeholder.com/300x450?text=My+Name',
      rlse_year: '2021'
    },
    {
      idx: '106',
      asset_nm: '더 글로리',
      genre: '복수',
      poster_path: 'https://via.placeholder.com/300x450?text=The+Glory',
      rlse_year: '2022'
    }
  ];

  return (
    <div className="drama-page">
      <div className="drama-header">
        <h1>드라마</h1>
        <p>다양한 장르의 드라마를 탐색해보세요</p>
      </div>

      <div className="drama-content">
        {/* 인기 드라마 */}
        <ContentSection 
          title="인기 드라마"
          items={genreDramas['인기'] || sampleDramas}
          isLoading={loading}
          error={error}
        />
        
        {/* 최신 드라마 */}
        <ContentSection 
          title="최신 드라마"
          items={genreDramas['최신'] || sampleDramas}
          isLoading={loading}
          error={error}
        />
        
        {/* 각 장르별 드라마 */}
        {categories.map(category => (
          <ContentSection 
            key={category.id}
            title={`${category.name} 드라마`}
            items={genreDramas[category.name] || sampleDramas}
            isLoading={loading}
            error={error}
          />
        ))}
      </div>
    </div>
  );
};

export default DramaPage;
