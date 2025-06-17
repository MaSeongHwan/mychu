export function initHeroSlider() {
  const sliderTrack = document.querySelector('.hero-slider-track');
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const nextBtn = document.querySelector('.hero-slider-next');
  const prevBtn = document.querySelector('.hero-slider-prev');
  let currentSlideIndex = 0;
  let autoSlideInterval;

  // Set background images dynamically (example for demonstration)
  const imageUrls = [
    'https://via.placeholder.com/1920x1080/0d1117/ffffff?text=Slide+1', // Dark blue background
    'https://via.placeholder.com/1920x1080/2f1b67/ffffff?text=Slide+2', // Purple background
    'https://via.placeholder.com/1920x1080/0f1116/ffffff?text=Slide+3'  // Dark background
  ];

  slides.forEach((slide, index) => {
    slide.style.backgroundImage = `url('${imageUrls[index % imageUrls.length]}')`;
  });

  const updateSliderPosition = () => {
    sliderTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
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
  };

  const nextSlide = () => {
    goToSlide(currentSlideIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentSlideIndex - 1);
  };

  const startAutoSlide = () => {
    stopAutoSlide(); // Clear any existing interval
    autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
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