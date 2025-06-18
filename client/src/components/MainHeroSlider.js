import { API_BASE_URL } from '../api/config.js';

/**
 * API 응답 데이터에서 poster_path만 남기고 나머지 필드들을 제거하는 함수
 * @param {Array} items - API에서 받은 콘텐츠 배열
 * @returns {Array} poster_path만 포함된 배열
 */
function filterPosterPathOnly(items) {
  return items.map(item => ({
    poster_path: item.poster_path
  }));
}

export function initMainHeroSlider() {
    console.log('Initializing Main Hero Slider...');

    const sliderTrack = document.getElementById('mainHeroSliderTrack');
    const prevBtn = document.getElementById('mainHeroPrevBtn');
    const nextBtn = document.getElementById('mainHeroNextBtn');

    if (!sliderTrack || !prevBtn || !nextBtn) {
        console.error('Main Hero Slider elements not found.', { sliderTrack, prevBtn, nextBtn });
        return;
    }

    let currentSlide = 0;
    let autoSlideInterval;
    const slideDuration = 5000; // 5초마다 자동 전환

    async function fetchHeroContent() {
        try {
            const response = await fetch(`${API_BASE_URL}/recommendation/test?n=4&is_adult=false&is_main=true`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched hero content data:', data);
            
            // poster_path만 필터링
            const filteredData = filterPosterPathOnly(data.items || []);
            populateSlider(filteredData);
            startAutoSlide();
        } catch (error) {
            console.error('Error fetching main hero content:', error);
            sliderTrack.innerHTML = '<div class="error-message">콘텐츠를 불러오는데 실패했습니다.</div>';
        }
    }

    function populateSlider(data) {
        sliderTrack.innerHTML = ''; // 기존 플레이스홀더 슬라이드 제거
        data.forEach((item, index) => {
            const slideElement = document.createElement('div');
            slideElement.classList.add('hero-slide', 'hero-content');
            
            // 첫 번째 슬라이드에만 `active` 클래스를 추가하여 초기 표시
            if (index === 0) {
                slideElement.classList.add('active');
            }

            slideElement.innerHTML = `
                <div class="hero-poster">
                    <div class="poster-container">
                        <img src="${item.poster_path}" alt="Poster" class="poster-image" />
                        <div class="poster-glow"></div>
                    </div>
                </div>
                <div class="hero-info">
                    <span class="badge">오늘의 추천</span>
                    <h2 class="hero-title">추천 콘텐츠</h2>
                    <div class="content-meta">
                        <div class="rating">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="star-icon">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            <span>4.8</span>
                        </div>
                    </div>
                    <p class="hero-description">
                        매력적인 콘텐츠를 만나보세요.
                    </p>
                    <div class="hero-buttons">
                        <button class="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            재생
                        </button>
                        <button class="btn btn-outline">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            찜하기
                        </button>
                    </div>
                </div>
            `;
            sliderTrack.appendChild(slideElement);
        });

        updateSliderPosition();
    }

    function updateSliderPosition() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length > 0) {
            const offset = -currentSlide * 100; // 각 슬라이드를 100% 너비로 가정
            sliderTrack.style.transform = `translateX(${offset}%)`;

            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }
    }

    function goToSlide(slideIndex) {
        const slides = document.querySelectorAll('.hero-slide');
        if (slideIndex < 0) {
            currentSlide = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            currentSlide = 0;
        } else {
            currentSlide = slideIndex;
        }
        updateSliderPosition();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval); // 기존 인터벌 클리어
        autoSlideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // 이벤트 리스너
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    // 마우스 오버 시 자동 슬라이드 일시정지, 마우스 아웃 시 재시작
    sliderTrack.addEventListener('mouseenter', stopAutoSlide);
    sliderTrack.addEventListener('mouseleave', startAutoSlide);

    // 초기 데이터 로드
    fetchHeroContent();
} 