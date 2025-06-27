import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ContentDetailsPage.css';

/**
 * 콘텐츠 상세 페이지 컴포넌트
 * 영화, 드라마 등 개별 콘텐츠의 상세 정보 표시
 */
const ContentDetailsPage = () => {
  const { id } = useParams(); // URL에서 콘텐츠 ID 가져오기
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContentDetails = async () => {
      setLoading(true);
      setError(null);
      
      console.log(`콘텐츠 ID ${id}에 대한 상세 정보를 가져오는 중...`);
      
      try {
        // 콘텐츠 상세 정보 API 호출 - 올바른 엔드포인트 사용
        // const apiUrl = `/assets/${id}`;
        // console.log(`API 호출 URL: ${apiUrl}`);
        
        // const contentResponse = await fetch(apiUrl);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

        const apiUrl = API_BASE_URL
          ? `${API_BASE_URL}/assets/${id}`
          : `/assets/${id}`; // 로컬 개발 시 프록시 사용

        console.log(`API 호출 URL: ${apiUrl}`);

        const contentResponse = await fetch(apiUrl);
        console.log(`API 응답 상태: ${contentResponse.status}`);
        
        if (!contentResponse.ok) {
          throw new Error(`API 오류: ${contentResponse.status}`);
        }
        
        const contentData = await contentResponse.json();
        console.log('받은 콘텐츠 데이터:', contentData);
        setContent(contentData);
        
        // 관련 콘텐츠 API 호출 - 임시로 비활성화
        // const relatedResponse = await fetch(`/api/content/${id}/related`);
        // const relatedData = await relatedResponse.json();
        // setRelatedContent(relatedData.items || []);
        
      } catch (err) {
        console.error('콘텐츠 로드 중 오류:', err);
        setError('콘텐츠 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContentDetails();
  }, [id]); // ID가 변경될 때마다 다시 로드

  // 샘플 콘텐츠 데이터 (API 로드 실패 시 사용)
  const sampleContent = {
    idx: id,
    asset_nm: '샘플 콘텐츠 제목',
    genre: '액션/모험',
    release_date: '2024-01-01',
    director: '홍길동',
    actors: ['배우1', '배우2', '배우3'],
    synopsis: '이 작품은 샘플 콘텐츠입니다. API에서 데이터를 가져올 수 없을 때 표시됩니다.',
    rating: 4.5,
    runtime: 120,
    poster_path: `https://via.placeholder.com/300x450?text=Content+${id}`,
    backdrop_path: `https://via.placeholder.com/1920x1080?text=Content+${id}+Background`
  };

  // 콘텐츠가 없고 로딩 중이 아닌 경우 샘플 데이터 사용
  const displayContent = content || sampleContent;

  // 콘텐츠 클릭 핸들러
  const handleContentClick = (contentId) => {
    navigate(`/content/${contentId}`);
  };

  if (loading) {
    return (
      <div className="content-details-loading">
        <div className="loading-spinner"></div>
        <p>콘텐츠 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="content-details-error">
        <h2>오류 발생</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="content-details-page">
      {/* 배경 이미지 */}
      <div 
        className="content-backdrop"
        style={{ 
          backgroundImage: `url(${displayContent?.backdrop_path})` 
        }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      {/* 콘텐츠 정보 */}
      <div className="content-info-container">
        <div className="content-poster">
          <img 
            src={displayContent?.poster_path} 
            alt={displayContent?.asset_nm} 
          />
        </div>

        <div className="content-info">
          <h1>{displayContent?.asset_nm}</h1>
          
          <div className="content-meta">
            <span>{displayContent?.release_date?.substring(0, 4)}</span>
            <span className="meta-divider">•</span>
            <span>{displayContent?.genre}</span>
            <span className="meta-divider">•</span>
            <span>{displayContent?.runtime}분</span>
            <span className="meta-divider">•</span>
            <span className="content-rating">★ {displayContent?.rating}</span>
          </div>
          
          <div className="content-synopsis">
            <h3>개요</h3>
            <p>{displayContent?.synopsis}</p>
          </div>
          
          <div className="content-people">
            <div className="content-director">
              <h3>감독</h3>
              <p>{displayContent?.director}</p>
            </div>
            
            <div className="content-actors">
              <h3>출연</h3>
              <p>{displayContent?.actors?.join(', ')}</p>
            </div>
          </div>
          
          <div className="content-actions">
            <button className="play-button">
              <i className="play-icon">▶</i> 재생
            </button>
            <button className="add-list-button">
              <i className="add-icon">+</i> 찜하기
            </button>
          </div>
        </div>
      </div>

      {/* 관련 콘텐츠 섹션 */}
      <div className="related-content">
        <h2>비슷한 콘텐츠</h2>
        
        <div className="related-content-grid">
          {(relatedContent.length > 0 ? relatedContent : Array(4).fill(sampleContent)).map((item, idx) => (
            <div 
              className="related-content-item" 
              key={item.idx || `sample-${idx}`}
              onClick={() => handleContentClick(item.idx || `sample-${idx}`)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={item.poster_path || `https://via.placeholder.com/200x300?text=Related+${idx}`}
                alt={item.asset_nm || `관련 콘텐츠 ${idx}`}
              />
              <h3>{item.asset_nm || `관련 콘텐츠 ${idx}`}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentDetailsPage;
