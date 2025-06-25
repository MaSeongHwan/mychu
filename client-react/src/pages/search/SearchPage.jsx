import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './SearchPage.css';

/**
 * 검색 결과 페이지 컴포넌트 - HTML/CSS를 React로 구현
 */
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // URL에서 검색어 가져오기
  const searchQuery = searchParams.get('q') || '';

  // 검색 실행
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  // 검색 API 호출
  const performSearch = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      // 실제 API 호출 대신 샘플 데이터 사용
      // const response = await fetch(`/search/?query=${encodeURIComponent(query)}&limit=20`);
      // const data = await response.json();
      
      // 샘플 검색 결과 데이터
      const sampleResults = [
        {
          id: 1,
          super_asset_nm: '기생충',
          poster_path: '/client/public/images/poster1.jpg',
          genre: '드라마',
          rlse_year: '2019'
        },
        {
          id: 2,
          super_asset_nm: '오징어 게임',
          poster_path: '/client/public/images/poster2.jpg',
          genre: '스릴러',
          rlse_year: '2021'
        },
        {
          id: 3,
          super_asset_nm: '킹덤',
          poster_path: '/client/public/images/poster3.jpg',
          genre: '공포',
          rlse_year: '2019'
        },
        {
          id: 4,
          super_asset_nm: '더 글로리',
          poster_path: '/client/public/images/poster4.jpg',
          genre: '드라마',
          rlse_year: '2022'
        },
        {
          id: 5,
          super_asset_nm: '이상한 변호사 우영우',
          poster_path: '/client/public/images/poster5.jpg',
          genre: '드라마',
          rlse_year: '2022'
        }
      ];

      // 검색어가 포함된 결과만 필터링
      const filteredResults = sampleResults.filter(item => 
        item.super_asset_nm.toLowerCase().includes(query.toLowerCase()) ||
        item.genre.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredResults);
    } catch (err) {
      console.error('검색 중 오류 발생:', err);
      setError('검색 중 오류가 발생했습니다.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 콘텐츠 아이템 클릭 핸들러
  const handleContentClick = (item) => {
    navigate(`/content/${item.id}`);
  };

  // 재생 버튼 클릭 핸들러
  const handlePlayClick = (e, item) => {
    e.stopPropagation();
    alert(`${item.super_asset_nm} 재생을 시작합니다.`);
  };

  // 찜하기 버튼 클릭 핸들러
  const handleWishlistClick = (e, item) => {
    e.stopPropagation();
    // 찜하기 상태 토글 로직
    const button = e.currentTarget;
    const svg = button.querySelector('svg');
    
    if (svg.getAttribute('fill') === 'currentColor') {
      svg.setAttribute('fill', 'none');
      button.style.color = '';
      alert(`${item.super_asset_nm}을(를) 찜 목록에서 제거했습니다.`);
    } else {
      svg.setAttribute('fill', 'currentColor');
      button.style.color = '#10b981';
      alert(`${item.super_asset_nm}을(를) 찜 목록에 추가했습니다.`);
    }
  };

  return (
    <div className="search-page">
      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <div className="container">
          {/* 검색 결과 헤더 */}
          <div className="search-header">
            <div className="search-info">
              <h1 className="search-title">
                '{searchQuery}' 검색 결과
              </h1>
              <p className="search-count">
                총 <span className="result-count">{searchResults.length}</span>개의 콘텐츠를 찾았습니다
              </p>
            </div>
          </div>

          {/* 검색 결과 그리드 */}
          <section className="search-results">
            <div className="results-grid">
              {loading && (
                <div className="loading-message">
                  <p>검색 중...</p>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && searchResults.length === 0 && (
                <div className="no-results">
                  <h3>검색 결과가 없습니다</h3>
                  <p>다른 검색어를 시도해보세요.</p>
                </div>
              )}

              {!loading && !error && searchResults.map((item) => (
                <div 
                  key={item.id} 
                  className="content-item"
                  onClick={() => handleContentClick(item)}
                >
                  <div className="item-poster">
                    <img 
                      src={item.poster_path || 'https://via.placeholder.com/200x300'} 
                      alt={item.super_asset_nm}
                      className="poster-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x300';
                      }}
                    />
                    <div className="item-overlay">
                      <button 
                        className="play-btn"
                        onClick={(e) => handlePlayClick(e, item)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </button>
                      <button 
                        className="wishlist-btn"
                        onClick={(e) => handleWishlistClick(e, item)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="item-info">
                    <h3 className="item-title">{item.super_asset_nm}</h3>
                    <div className="item-meta">
                      <span className="item-genre">{item.genre || '장르 없음'}</span>
                      {item.rlse_year && <span className="item-year">{item.rlse_year}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
