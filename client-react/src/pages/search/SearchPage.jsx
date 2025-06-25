import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import './SearchPage.css';

/**
 * 검색 결과 페이지 컴포넌트
 * URL 쿼리 파라미터의 검색어를 기반으로 검색 결과를 표시합니다.
 */
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 검색어 검색 결과 로드
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // 검색 API 호출
        const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error(`검색 실패: ${response.status}`);
        }
        
        const data = await response.json();
        const searchResults = data.results || [];
        
        setResults(searchResults);
      } catch (error) {
        console.error('검색 결과 로드 오류:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);

  // 콘텐츠 카드 클릭 이벤트 핸들러
  const handleItemClick = (id) => {
    window.location.href = `/contents?id=${id}`;
  };
  
  // 찜하기 버튼 클릭 이벤트 핸들러
  const handleWishlistClick = (e, id) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
    console.log('찜하기:', id);
    // 여기에 찜하기 API 호출 로직 구현
  };
  
  // 재생 버튼 클릭 이벤트 핸들러
  const handlePlayClick = (e, id) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
    console.log('재생:', id);
    window.location.href = `/contents?id=${id}&play=true`;
  };

  return (
    <div className="app">
      {/* 헤더 */}
      <Header />
      
      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <div className="container">
          {/* 검색 결과 헤더 */}
          <div className="search-header">
            <div className="search-info">
              <h1 className="search-title">'{query}' 검색 결과</h1>
              <p className="search-count">
                총 <span className="result-count">{results.length}</span>개의 콘텐츠를 찾았습니다
              </p>
            </div>
          </div>
          
          {/* 검색 결과 그리드 */}
          <section className="search-results">
            {loading ? (
              <div className="loading-indicator">검색 결과를 불러오는 중...</div>
            ) : error ? (
              <div className="error-message">검색 중 오류가 발생했습니다: {error}</div>
            ) : results.length === 0 ? (
              <div className="no-results">
                <p>검색 결과가 없습니다.</p>
                <p>다른 검색어를 입력해 보세요.</p>
              </div>
            ) : (
              <div className="results-grid">
                {results.map((item) => (
                  <div 
                    key={item.idx || item.id} 
                    className="content-item"
                    onClick={() => handleItemClick(item.idx || item.id)}
                  >
                    <div className="item-poster">
                      <img 
                        src={item.poster_path || `https://via.placeholder.com/200x300?text=${encodeURIComponent(item.asset_nm || 'No Image')}`}
                        alt={item.asset_nm} 
                        className="poster-image"
                        onError={(e) => { 
                          e.target.src = `https://via.placeholder.com/200x300?text=${encodeURIComponent(item.asset_nm || 'No Image')}`;
                        }}
                      />
                      <div className="item-overlay">
                        <button 
                          className="play-btn"
                          onClick={(e) => handlePlayClick(e, item.idx || item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </button>
                        <button 
                          className="wishlist-btn"
                          onClick={(e) => handleWishlistClick(e, item.idx || item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="item-info">
                      <h3 className="item-title">{item.asset_nm || item.super_asset_nm || '제목 없음'}</h3>
                      <div className="item-meta">
                        <span className="item-genre">{item.genre || '장르 정보 없음'}</span>
                        {item.rlse_year && <span className="item-year">{item.rlse_year}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default SearchPage;
