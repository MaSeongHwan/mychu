import { getHeroMovies } from '../api/recommendation_test.js';

export async function initHeroSlider() {
  console.log('Hero 슬라이더 초기화 시작');
  
  // DOM 요소 가져오기
  const sliderTrack = document.querySelector('.hero-slider-track');
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const nextBtn = document.getElementById('mainHeroNextBtn');
  const prevBtn = document.getElementById('mainHeroPrevBtn');
  
  // 디버깅을 위한 DOM 요소 체크
  console.log('슬라이더 요소 확인:', {
    sliderTrack: sliderTrack,
    slides: slides.length,
    nextBtn: nextBtn !== null,
    prevBtn: prevBtn !== null
  });
  
  if (!sliderTrack || slides.length === 0 || !nextBtn || !prevBtn) {
    console.error('슬라이더 필수 요소를 찾을 수 없습니다', {
      sliderTrack: !!sliderTrack,
      slides: slides.length,
      nextBtn: !!nextBtn,
      prevBtn: !!prevBtn
    });
  }
  
  let currentSlideIndex = 0;
  let autoSlideInterval;

  // 영화 데이터 가져오기
  try {
    const movies = await getHeroMovies();
    console.log('Hero 슬라이더용 영화 데이터:', movies);
    
    if (movies.length > 0) {
      // 각 슬라이드에 영화 데이터 적용
      slides.forEach((slide, index) => {
        const movie = movies[index % movies.length];
        if (movie) {
          // 배경 이미지 설정 (포스터 이미지 사용)
          const backgroundImage = movie.poster_path || 'https://via.placeholder.com/1920x1080/0d1117/ffffff?text=Movie+Poster';
          slide.style.backgroundImage = `url('${backgroundImage}')`;
          
          // 영화 정보 업데이트
          const titleElement = slide.querySelector('.hero-title');
          const yearElement = slide.querySelector('.release-year');
          const genreElement = slide.querySelector('.genre');
          const descriptionElement = slide.querySelector('.hero-description');
          
          if (titleElement) titleElement.textContent = movie.asset_nm || '영화 제목';
          if (yearElement) yearElement.textContent = movie.rlse_year ? `(${movie.rlse_year})` : '';
          if (genreElement) genreElement.textContent = movie.genre || '장르';
          if (descriptionElement) descriptionElement.textContent = movie.smry || '영화 설명이 없습니다.';
          
          // 포스터 이미지 업데이트
          const posterImg = slide.querySelector('.main-hero-poster-img');
          if (posterImg && movie.poster_path) {
            posterImg.src = movie.poster_path;
            posterImg.alt = movie.asset_nm || '영화 포스터';
          }

          if (movie.asset_idx) {
            // 슬라이드 전체 클릭 시 상세페이지로 이동
            slide.addEventListener('click', (event) => {
              // 내부 버튼 클릭 시 상세페이지 이동 막기
              if (event.target.closest('.btn')) return;
              window.location.href = `/contents?id=${movie.idx || movie.asset_idx}`;
            });
            slide.style.cursor = 'pointer';

            // 내부 버튼 클릭 시 상세페이지 이동 막기
            const playBtn = slide.querySelector('.btn-primary');
            if (playBtn) {
              playBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                // 재생 동작 구현 (필요시)
              });
            }
            const likeBtn = slide.querySelector('.btn-outline');
            if (likeBtn) {
              likeBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                // 찜하기 동작 구현 (필요시)
              });
            }
          }
        }
      });
    } else {
      // 데이터가 없을 경우 기본 이미지 사용
      const imageUrls = [
        'https://via.placeholder.com/1920x1080/0d1117/ffffff?text=Slide+1',
        'https://via.placeholder.com/1920x1080/2f1b67/ffffff?text=Slide+2',
        'https://via.placeholder.com/1920x1080/0f1116/ffffff?text=Slide+3',
        'https://via.placeholder.com/1920x1080/4f1116/ffffff?text=Slide+4',
        'https://via.placeholder.com/1920x1080/0d4117/ffffff?text=Slide+5'
      ];

      slides.forEach((slide, index) => {
        slide.style.backgroundImage = `url('${imageUrls[index % imageUrls.length]}')`;
      });
    }
  } catch (error) {
    console.error('Hero 슬라이더 영화 데이터 로드 실패:', error);
    // 에러 시 기본 이미지 사용
    const imageUrls = [
      'https://via.placeholder.com/1920x1080/0d1117/ffffff?text=Slide+1',
      'https://via.placeholder.com/1920x1080/2f1b67/ffffff?text=Slide+2',
      'https://via.placeholder.com/1920x1080/0f1116/ffffff?text=Slide+3',
      'https://via.placeholder.com/1920x1080/4f1116/ffffff?text=Slide+4',
      'https://via.placeholder.com/1920x1080/0d4117/ffffff?text=Slide+5'
    ];

    slides.forEach((slide, index) => {
      slide.style.backgroundImage = `url('${imageUrls[index % imageUrls.length]}')`;
    });
  }

  const updateSliderPosition = () => {
    // CSS 클래스 토글 방식
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlideIndex);
    });
    
    // translateX 트랜스폼 방식 (movie.html에 맞춤)
    if (sliderTrack) {
      const offset = -currentSlideIndex * 100; // 각 슬라이드를 100% 너비로 가정
      sliderTrack.style.transform = `translateX(${offset}%)`;
      console.log(`슬라이드 이동: ${currentSlideIndex}, 오프셋: ${offset}%`);
    }
  };

  const goToSlide = (index) => {
    if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex = index;
    }
    updateSliderPosition();
    console.log(`슬라이드 변경: ${currentSlideIndex}`);
  };

  const nextSlide = () => {
    goToSlide(currentSlideIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentSlideIndex - 1);
  };

  const startAutoSlide = () => {
    stopAutoSlide(); // Clear any existing interval
    autoSlideInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  // Event Listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoSlide(); // Stop auto-slide on manual interaction
    startAutoSlide(); // Restart after a brief pause
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoSlide(); // Stop auto-slide on manual interaction
    startAutoSlide(); // Restart after a brief pause
  });

  // Pause auto-slide on hover
  sliderTrack.addEventListener('mouseenter', stopAutoSlide);
  sliderTrack.addEventListener('mouseleave', startAutoSlide);

  // Initial setup
  goToSlide(0); // Show the first slide
  startAutoSlide(); // Start auto-sliding
} 