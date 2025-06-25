import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Slider from './components/Slider';
import './StandaloneSlider.css';

// API 기본 URL
const API_BASE_URL = window.location.hostname === 'localhost' ? '' : 'http://fastapi:8000';

/**
 * 샘플 데이터 생성 함수
 * API 호출 실패시 대체 데이터로 사용
 */
const generateSampleItems = (count = 5) => {
  return Array.from({ length: count }, (_, i) => ({
    idx: `sample-${i + 1}`,
    asset_idx: `sample-${i + 1}`,
    asset_nm: `샘플 콘텐츠 ${i + 1}`,
    genre: ['액션', '드라마', '코미디', 'SF', '판타지', '로맨스'][i % 6],
    poster_path: `https://via.placeholder.com/300x450?text=Sample+${i + 1}`,
    release_year: 2025 - (i % 3)
  }));
};

/**
 * Standalone Slider Component
 * This component is designed to be embedded into existing HTML pages
 */
const StandaloneSlider = () => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Get the container element that has our data
    const container = document.getElementById('react-slider-mount');
    
    if (!container) {
      setError('슬라이더를 마운트할 컨테이너를 찾을 수 없습니다.');
      setLoading(false);
      return;
    }
    
    // Extract data from the container's data attributes
    const dataItems = container.dataset.items;
    const dataTitle = container.dataset.title || '';
    const dataUrl = container.dataset.url;
    const dataId = container.dataset.id;
    const dataTest = container.dataset.test === 'true'; // 테스트 API 사용 여부
    
    // Set title from data attribute
    setTitle(dataTitle);
    
    const loadItems = async () => {
      try {
        // If test API is requested
        if (dataTest) {
          try {
            const testUrl = `${API_BASE_URL}/recommendation/test?n=10`;
            console.log('테스트 API 호출:', testUrl);
            const response = await fetch(testUrl);
            if (!response.ok) {
              throw new Error(`테스트 API 서버 에러: ${response.status}`);
            }
            const data = await response.json();
            // 데이터 정규화
            const normalizedItems = (data.items || []).map(item => ({
              idx: item.idx || item.asset_idx || `temp-${Math.random().toString(36).substr(2, 9)}`,
              asset_nm: item.asset_nm || item.super_asset_nm || '제목 없음',
              genre: item.genre || '',
              poster_path: item.poster_path && item.poster_path.startsWith('http') 
                ? item.poster_path 
                : `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.asset_nm || 'Movie')}`,
              release_year: item.release_year || item.rlse_year || null
            }));
            setItems(normalizedItems);
            setLoading(false);
            return;
          } catch (testErr) {
            console.error('테스트 API 호출 실패:', testErr);
            // 실패 시 다른 방법으로 계속
          }
        }
        
        // If items are provided directly
        if (dataItems) {
          try {
            const parsedItems = JSON.parse(dataItems);
            setItems(parsedItems);
            setLoading(false);
            return;
          } catch (err) {
            console.error('데이터 파싱 실패:', err);
            // Continue to try URL if available
          }
        }
          // If a URL is provided to fetch items
        if (dataUrl) {          try {
            const response = await fetch(dataUrl);
            if (!response.ok) {
              throw new Error(`서버 에러: ${response.status}`);
            }
            const data = await response.json();
            // 데이터 정규화 - 필요한 필드가 없는 경우 기본값으로 대체
            const normalizedItems = (data.items || []).map(item => ({
              idx: item.idx || item.asset_idx || `temp-${Math.random().toString(36).substr(2, 9)}`,
              asset_nm: item.asset_nm || item.super_asset_nm || '제목 없음',
              genre: item.genre || '',
              poster_path: item.poster_path && item.poster_path.startsWith('http') 
                ? item.poster_path 
                : `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.asset_nm || 'Movie')}`,
              release_year: item.release_year || item.rlse_year || null
            }));
            setItems(normalizedItems);
            setLoading(false);
            return;
          } catch (fetchErr) {
            console.error('API 호출 실패:', fetchErr);
            // API 호출 실패시 샘플 데이터로 대체
            setItems(generateSampleItems(5));
            setLoading(false);
            return;
          }
        }
        
        // If content ID is provided for similar content
        if (dataId) {
          try {
            const response = await fetch(`/recommendation/similar/${dataId}?top_n=10`);
            if (!response.ok) {
              throw new Error(`서버 에러: ${response.status}`);
            }
            const data = await response.json();
            setItems(data.items || []);
            setLoading(false);
            return;
          } catch (fetchErr) {
            console.error('API 호출 실패:', fetchErr);
            // API 호출 실패시 샘플 데이터로 대체
            setItems(generateSampleItems(5));
            setLoading(false);
            return;
          }
        }
        
        // No valid data source
        setError('슬라이더를 위한 데이터 소스가 제공되지 않았습니다.');
        setLoading(false);
        
      } catch (err) {
        console.error('슬라이더 데이터 로드 실패:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadItems();
  }, []);
  
  if (loading) {
    return <div className="slider-loading">콘텐츠를 불러오는 중...</div>;
  }
  
  if (error) {
    return <div className="slider-error">오류 발생: {error}</div>;
  }
  
  if (!items || items.length === 0) {
    return <div className="slider-empty">표시할 콘텐츠가 없습니다.</div>;
  }
  
  return <Slider items={items} title={title} />;
};

// Self-initializing function to mount the component
const mountSlider = () => {
  const mountPoint = document.getElementById('react-slider-mount');
  if (mountPoint) {
    const root = createRoot(mountPoint);
    root.render(<StandaloneSlider />);
  }
};

// Auto-initialize when the script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountSlider);
} else {
  mountSlider();
}

export default StandaloneSlider;
