import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Slider.css';

/**
 * React Slider Component that displays a horizontal scrollable list of content cards
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of content items to display
 * @param {string} props.title - Title of the slider section
 * @param {string} props.sliderId - Unique ID for the slider
 * @returns {JSX.Element} - Rendered slider component
 */
const Slider = ({ items = [], title = '', sliderId = 'react-slider' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Number of cards to show at once (can be adjusted based on viewport)
  const cardsToShow = 5;

  // Handle navigation
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - cardsToShow) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Handle card click to navigate to content page
  const handleCardClick = (id) => {
    window.location.href = `/contents?id=${id}`;
  };

  // Placeholder image loading for missing posters
  const loadImage = (src) => {
    return new Promise((resolve) => {
      if (!src) {
        resolve('https://via.placeholder.com/300x450?text=No+Image');
        return;
      }

      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve('https://via.placeholder.com/300x450?text=No+Image');
      img.src = src;
    });
  };

  if (isLoading) {
    return <div className="slider-loading">로딩 중...</div>;
  }

  if (hasError) {
    return <div className="slider-error">콘텐츠를 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (!items || items.length === 0) {
    return <div className="slider-empty">표시할 콘텐츠가 없습니다.</div>;
  }

  return (
    <div className="slider-section" id={sliderId}>
      {title && <h2 className="slider-title">{title}</h2>}
      
      <div className="slider-container">
        <button 
          className="slider-nav prev" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          &lt;
        </button>

        <div className="cards-container">
          <div 
            className="cards-wrapper" 
            style={{ 
              transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` 
            }}
          >
            {items.map((item, index) => (
              <div 
                key={`${sliderId}-card-${index}`}
                className="content-card"
                onClick={() => handleCardClick(item.idx || item.id || index)}
              >
                <img 
                  src={item.poster_path && item.poster_path.startsWith('http') 
                    ? item.poster_path 
                    : `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.asset_nm || 'Movie')}`}
                  alt={item.asset_nm || item.super_asset_nm || '콘텐츠 이미지'} 
                  loading="lazy" 
                  onError={(e) => { e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.asset_nm || 'No Image')}`; }}
                />
                <div className="card-info">
                  <h3 className="card-title">{item.asset_nm || item.super_asset_nm || '제목 없음'}</h3>
                  {item.genre && <p className="card-genre">{item.genre}</p>}
                  {item.rlse_year && <p className="card-year">{item.rlse_year}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="slider-nav next" 
          onClick={handleNext}
          disabled={currentIndex >= items.length - cardsToShow}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

Slider.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  sliderId: PropTypes.string
};

export default Slider;
