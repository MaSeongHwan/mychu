import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyListPage.css';

/**
 * 내가 찜한 콘텐츠 목록 페이지
 */
const MyListPage = () => {
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMyList = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 사용자의 찜 목록 가져오기
        const response = await fetch('http://localhost:8000/logs/user/541?limit=50&offset=0');
        
        if (!response.ok) {
          throw new Error('찜 목록을 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setMyList(data.items || []);
      } catch (err) {
        console.error('찜 목록 로드 중 오류:', err);
        setError('찜 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyList();
  }, []);

  // 콘텐츠 제거 핸들러
  const handleRemoveItem = async (id) => {
    try {
      // API 호출하여 찜 목록에서 제거
      const response = await fetch(`/api/user/mylist/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('콘텐츠 제거에 실패했습니다.');
      }
      
      // 성공 시 로컬 상태 업데이트
      setMyList(prevList => prevList.filter(item => item.idx !== id));
    } catch (err) {
      console.error('콘텐츠 제거 중 오류:', err);
      alert('콘텐츠를 제거하는 중 오류가 발생했습니다.');
    }
  };

  // 샘플 데이터 (API 로드 실패 시 사용)
  const sampleMyList = [
    {
      idx: '101',
      asset_nm: '샘플 영화 1',
      genre: '액션',
      poster_path: 'https://via.placeholder.com/300x450?text=Sample+1',
      rlse_year: '2023'
    },
    {
      idx: '102',
      asset_nm: '샘플 드라마 1',
      genre: '로맨스',
      poster_path: 'https://via.placeholder.com/300x450?text=Sample+2',
      rlse_year: '2022'
    },
    {
      idx: '103',
      asset_nm: '샘플 영화 2',
      genre: '코미디',
      poster_path: 'https://via.placeholder.com/300x450?text=Sample+3',
      rlse_year: '2023'
    },
    {
      idx: '104',
      asset_nm: '샘플 드라마 2',
      genre: '스릴러',
      poster_path: 'https://via.placeholder.com/300x450?text=Sample+4',
      rlse_year: '2024'
    }
  ];

  // API 실패 시 샘플 데이터 사용
  const displayList = myList.length > 0 ? myList : (loading ? [] : sampleMyList);

  return (
    <div className="mylist-page">
      <div className="mylist-header">
        <h1>내가 찜한 콘텐츠</h1>
      </div>
      
      <div className="mylist-content">
        {loading ? (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <p>콘텐츠를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        ) : displayList.length === 0 ? (
          <div className="empty-list">
            <h2>찜한 콘텐츠가 없습니다</h2>
            <p>관심있는 영화나 드라마를 찜하면 이곳에 표시됩니다.</p>
            <Link to="/" className="browse-button">콘텐츠 탐색하기</Link>
          </div>
        ) : (
          <div className="mylist-grid">
            {displayList.map(item => (
              <div className="mylist-item" key={item.idx}>
                <div className="mylist-poster">
                  <Link to={`/content/${item.idx}`}>
                    <img src={item.poster_path}
                     alt={item.asset_nm}
                     onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                     />
                  </Link>
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.idx)}
                  >
                    &times;
                  </button>
                </div>
                <div className="mylist-item-info">
                  <h3><Link to={`/content/${item.idx}`}>{item.asset_nm}</Link></h3>
                  <div className="mylist-item-meta">
                    <span>{item.rlse_year}</span>
                    <span className="meta-divider">•</span>
                    <span>{item.genre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
