import { useState, useEffect, useRef } from 'react';
import './Hero.css';

/**
 * 메인 페이지 히어로 슬라이더 컴포넌트
 * 자동 슬라이드 및 수동 컨트롤 지원
 */
const Hero = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroData, setHeroData] = useState([]);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const totalSlides = heroData.length;
  
  // 기본 샘플 데이터 (API 실패시 대체용)
  const sampleHeroData = [
    {
      idx: '1',
      asset_nm: '더 배트맨',
      genre: '액션, 스릴러',
      poster_path: 'https://via.placeholder.com/500x750?text=Batman',
      rlse_year: '2022',
      synopsis: '고담시의 비리를 파헤치며 수수께끼 살인마와 대결하는 배트맨의 이야기',
      rating: 4.5
    },
    {
      idx: '2',
      asset_nm: '스파이더맨: 노 웨이 홈',
      genre: '액션, 어드벤처',
      poster_path: 'https://via.placeholder.com/500x750?text=Spider-Man',
      rlse_year: '2021',
      synopsis: '정체가 탄로난 스파이더맨이 여러 다양한 세계의 빌런들과 맞서는 이야기',
      rating: 4.7
    },
    {
      idx: '3',
      asset_nm: '인터스텔라',
      genre: 'SF, 드라마',
      poster_path: 'https://via.placeholder.com/500x750?text=Interstellar',
      rlse_year: '2014',
      synopsis: '우주 여행을 통해 인류의 새로운 거주지를 찾아 나서는 우주비행사들의 이야기',
      rating: 4.8
    },
    {
      idx: '4',
      asset_nm: '조커',
      genre: '범죄, 스릴러',
      poster_path: 'https://via.placeholder.com/500x750?text=Joker',
      rlse_year: '2019',
      synopsis: '소외된 코미디언이 광기를 통해 악명 높은 빌런이 되어가는 과정',
      rating: 4.4
    },
    {
      idx: '5',
      asset_nm: '인셉션',
      genre: '액션, SF',
      poster_path: 'https://via.placeholder.com/500x750?text=Inception',
      rlse_year: '2010',
      synopsis: '꿈의 세계를 통해 타인의 생각을 훔치는 특별한 능력을 가진 팀의 이야기',
      rating: 4.8
    }
  ];
  
  // 히어로 슬라이더 데이터 불러오기
  useEffect(() => {
    const fetchHeroData = async () => {
      setIsLoading(true);
      try {
        // 데이터가 이미 전달된 경우
        if (slides && slides.length > 0) {
          setHeroData(slides);
          return;
        }
          // API에서 데이터 가져오기
        // 실제 API가 존재하지 않으므로 기존 테스트 API를 사용
        const response = await fetch('/recommendation/test?n=5&is_adult=false&is_main=true');
        if (!response.ok) {
          throw new Error('히어로 데이터를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        const heroItems = data?.items || [];
        
        if (heroItems.length === 0) {
          // API 응답이 비었을 경우 샘플 데이터 사용
          setHeroData(sampleHeroData);
        } else {
          setHeroData(heroItems);
        }
      } catch (error) {
        console.error('Hero 데이터 로딩 오류:', error);
        setError(error);
        // 오류 시 샘플 데이터 사용
        setHeroData(sampleHeroData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, [slides]);

  // 자동 슬라이드 기능
  useEffect(() => {
    const playSlideshow = () => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    };

    autoPlayRef.current = setTimeout(playSlideshow, 6000); // 6초마다 자동 슬라이드
    
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [currentSlide, totalSlides]);

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  // 이전 슬라이드로 이동
  const prevSlide = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  // 특정 슬라이드로 바로 이동
  const goToSlide = (index) => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
    setCurrentSlide(index);
  };

  // 텍스트 길이 제한 헬퍼 함수
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (isLoading) {
    return (
      <section className="hero hero-loading">
        <div className="container">
          <div className="loading-indicator">로딩 중...</div>
        </div>
      </section>
    );
  }

  if (error || heroData.length === 0) {
    return (
      <section className="hero hero-error">
        <div className="container">
          <div className="error-message">
            콘텐츠를 불러오는데 문제가 발생했습니다.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="hero-slider-view">
        <div 
          className="hero-slider-track" 
          ref={sliderRef}
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)` 
          }}
        >
          {heroData.map((item, index) => (
            <div key={item.idx || index} className="hero-slide hero-content">
              <div className="hero-poster">
                <div className="poster-container">
                  <img 
                    className="poster-image" 
                    src={item.poster_path || `https://via.placeholder.com/500x750?text=${encodeURIComponent(item.asset_nm || 'Poster')}`}
                    alt={item.asset_nm || '포스터'}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/500x750?text=${encodeURIComponent(item.asset_nm || 'No Image')}`;
                    }}
                  />
                  <div className="poster-glow"></div>
                </div>
              </div>
              <div className="hero-info">
                <span className="badge">오늘의 추천</span>
                <h2 className="hero-title">{item.asset_nm}</h2>
                <div className="content-meta">
                  <div className="rating">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>{item.rating || '4.5'}</span>
                  </div>
                  {item.rlse_year && <span className="release-year">{item.rlse_year}</span>}
                  {item.genre && <span className="genre">{item.genre}</span>}
                </div>
                <p className="hero-description">
                  {truncateText(item.synopsis || '설명이 제공되지 않았습니다.', 200)}
                </p>
                <div className="hero-buttons">
                  <button className="btn btn-primary">재생</button>
                  <button className="btn btn-outline">찜하기</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 슬라이더 내비게이션 버튼 */}
        <button className="hero-slider-nav prev" onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="hero-slider-nav next" onClick={nextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* 슬라이더 인디케이터 */}
        <div className="slider-indicators">
          {heroData.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`슬라이드 ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
