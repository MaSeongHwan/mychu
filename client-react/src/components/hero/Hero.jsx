import { useState, useEffect } from 'react';
import './Hero.css';

/**
 * 히어로 슬라이더 컴포넌트 - main.html 기반 구현
 * HTML의 hero 섹션을 React로 완전히 재현
 */
const Hero = ({ items = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = items.length;

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (!items || items.length === 0) {
    // 기본 샘플 데이터 사용
    const sampleData = [
      {
        idx: '1',
        asset_nm: '더 배트맨',
        genre: '액션',
        poster_path: 'https://placehold.co/300x450?text=Batman',
        release_year: '2022',
        rating: '4.8',
        description: '고담시의 어둠 속에서 정의를 실현하는 배트맨의 이야기'
      },
      {
        idx: '2',
        asset_nm: '스파이더맨',
        genre: '액션',
        poster_path: 'https://placehold.co/300x450?text=Spider-Man',
        release_year: '2021',
        rating: '4.7',
        description: '거미줄을 뿜는 슈퍼히어로의 모험이 시작됩니다'
      },
      {
        idx: '3',
        asset_nm: '인터스텔라',
        genre: 'SF',
        poster_path: 'https://placehold.co/300x450?text=Interstellar',
        release_year: '2014',
        rating: '4.9',
        description: '우주를 여행하며 인류의 미래를 구하는 감동적인 이야기'
      },
      {
        idx: '4',
        asset_nm: '조커',
        genre: '스릴러',
        poster_path: 'https://placehold.co/300x450?text=Joker',
        release_year: '2019',
        rating: '4.6',
        description: '광기와 현실 사이에서 벌어지는 충격적인 변화'
      },
      {
        idx: '5',
        asset_nm: '어벤져스',
        genre: '액션',
        poster_path: 'https://placehold.co/300x450?text=Avengers',
        release_year: '2012',
        rating: '4.8',
        description: '지구를 구하기 위해 모인 슈퍼히어로들의 대서사시'
      }
    ];
    return <Hero items={sampleData} />;
  }

  return (
    <section className="hero">
      <div className="hero-slider-view">
        <div 
          className="hero-slider-track" 
          id="mainHeroSliderTrack"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={item.idx || index} className="hero-slide hero-content">
              <div className="hero-poster">
                <div className="poster-container">
                  <img 
                    className={`poster-image main-hero-poster-img-${index}`}
                    src={item.poster_path || 'https://placehold.co/300x450?text=No+Image'} 
                    alt="포스터" 
                  />
                  <div className="poster-glow"></div>
                </div>
              </div>
              <div className="hero-info">
                <span className="badge">오늘의 추천</span>
                <h2 className="hero-title">{item.asset_nm || '제목 없음'}</h2>
                <div className="content-meta">
                  <div className="rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>{item.rating || '4.8'}</span>
                  </div>
                  <span className="release-year">{item.release_year || '2024'}</span>
                  <span className="genre">{item.genre || '드라마'}</span>
                </div>
                <p className="hero-description">
                  {item.description || '흥미진진한 스토리와 뛰어난 연출로 많은 사랑을 받고 있는 작품입니다.'}
                </p>
                <div className="hero-buttons">
                  <button className="btn btn-primary">재생</button>
                  <button className="btn btn-outline">찜하기</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 좌우 화살표 - HTML과 동일한 구조 */}
        <button className="hero-slider-nav prev" id="mainHeroPrevBtn" onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="hero-slider-nav next" id="mainHeroNextBtn" onClick={nextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Hero;
