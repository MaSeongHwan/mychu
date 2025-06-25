import { useState, useEffect } from 'react';
import './ContentSection.css';

/**
 * 콘텐츠 슬라이더 섹션 컴포넌트
 * 다양한 API 엔드포인트에서 콘텐츠를 로드하여 표시
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.title - 섹션 제목
 * @param {string} props.endpoint - 데이터를 불러올 API 엔드포인트
 * @param {string} props.id - 컴포넌트 고유 ID (DOM 제어용)
 * @param {Array} props.items - 선택적: 직접 전달되는 아이템 목록 (API 호출 대신 사용)
 */
const ContentSection = ({ title, endpoint, id, items: initialItems }) => {
  const [items, setItems] = useState(initialItems || []);
  const [loading, setLoading] = useState(!initialItems);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 뷰포트 크기에 따라 보여질 카드 수 계산
  const getCardsToShow = () => {
    const width = window.innerWidth;
    if (width < 480) return 2;
    if (width < 768) return 3;
    if (width < 1200) return 4;
    return 5;
  };
  
  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());

  // 반응형 레이아웃을 위한 리사이즈 이벤트 처리
  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsToShow());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // API에서 데이터 로드
  useEffect(() => {
    // 이미 아이템이 전달되었으면 API 호출 건너뛰기
    if (initialItems) return;
    
    const fetchData = async () => {
      if (!endpoint) return;
      
      setLoading(true);
      
      try {
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }
        
        const data = await response.json();
        // API 응답 구조에 따라 적절히 데이터 추출
        const contentItems = data.result || data.items || data;
        
        if (Array.isArray(contentItems) && contentItems.length > 0) {
          setItems(contentItems);
        } else {
          throw new Error('유효한 콘텐츠를 찾을 수 없습니다');
        }
      } catch (err) {
        console.error(`콘텐츠 로드 오류 (${title}):`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [endpoint, initialItems, title]);

  // 이전 슬라이드로 이동
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  // 다음 슬라이드로 이동
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(items.length - cardsToShow, prev + 1));
  };

  // 콘텐츠 상세 페이지로 이동
  const handleCardClick = (idx) => {
    window.location.href = `/contents?id=${idx}`;
  };

  return (
    <section className="content-section" id={id}>
      <div className="section-header">
        <h2>{title}</h2>
        <div className="section-controls">
          <button 
            className="control-btn prev-btn"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
          >
            <span className="icon icon-arrow-left">◀</span>
          </button>
          <button 
            className="control-btn next-btn"
            onClick={handleNext}
            disabled={currentIndex >= items.length - cardsToShow}
          >
            <span className="icon icon-arrow-right">▶</span>
          </button>
        </div>
      </div>
      
      <div className="content-slider">
        {loading ? (
          <div className="loading-indicator">콘텐츠를 불러오는 중...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : items.length === 0 ? (
          <div className="empty-message">표시할 콘텐츠가 없습니다.</div>
        ) : (
          <div className="slider-track" style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}>
            {items.map((item, index) => (
              <div 
                key={item.idx || index} 
                className="content-card"
                onClick={() => handleCardClick(item.idx)}
              >
                <div className="card-poster">
                  <img 
                    src={item.poster_path || `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.asset_nm || 'Poster')}`} 
                    alt={item.asset_nm || '포스터'}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.asset_nm || 'No Image')}`;
                    }}
                  />
                </div>
                <div className="card-info">
                  <h3 className="card-title">{item.asset_nm || item.super_asset_nm}</h3>
                  <div className="card-meta">
                    {item.genre && <span className="card-genre">{item.genre}</span>}
                    {item.rlse_year && <span className="card-year">{item.rlse_year}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentSection;
