# VOD 추천 서비스 프론트엔드 (React/Vite)

## 1. 디렉토리 구조
```
client-react/
├── src/                # 소스 코드
│   ├── assets/         # 정적 리소스
│   │   ├── images/     # 이미지 파일
│   │   ├── fonts/      # 폰트 파일
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── common/     # 범용 컴포넌트 (버튼, 카드 등)
│   │   ├── layout/     # 레이아웃 컴포넌트
│   │   │   ├── Header.jsx     # 헤더 컴포넌트
│   │   │   ├── Header.css     # 헤더 스타일
│   │   │   ├── Footer.jsx     # 푸터 컴포넌트
│   │   │   ├── Footer.css     # 푸터 스타일
│   │   │   ├── MainLayout.jsx # 메인 레이아웃
│   │   │   └── MainLayout.css # 메인 레이아웃 스타일
│   │   ├── content/    # 콘텐츠 관련 컴포넌트
│   │   │   └── ContentSection.jsx # 콘텐츠 섹션 컴포넌트
│   │   ├── hero/       # 히어로 섹션 컴포넌트
│   │   │   ├── Hero.jsx      # 히어로 컴포넌트
│   │   │   └── Hero.css      # 히어로 스타일
│   │   ├── slider/     # 슬라이더 관련 컴포넌트
│   │   │   ├── Slider.jsx     # 슬라이더 컴포넌트
│   │   │   └── Slider.css     # 슬라이더 스타일
│   │   └── ui/         # UI 요소 (모달, 토스트, 드롭다운 등)
│   ├── hooks/          # 커스텀 React Hooks
│   │   ├── useAuth.js       # 인증 관련 훅
│   │   ├── useFetch.js      # API 요청 훅
│   │   └── useLocalStorage.js # 로컬 스토리지 훅
│   ├── pages/          # 각 페이지 컴포넌트
│   │   ├── home/       # 홈페이지 관련 컴포넌트
│   │   │   ├── HomePage.jsx  # 홈페이지 컴포넌트
│   │   │   └── HomePage.css  # 홈페이지 스타일
│   │   ├── contents/   # 콘텐츠 페이지 관련 컴포넌트
│   │   │   ├── ContentDetailsPage.jsx # 콘텐츠 상세 페이지
│   │   │   └── ContentDetailsPage.css # 콘텐츠 상세 페이지 스타일
│   │   ├── movie/      # 영화 페이지 관련 컴포넌트
│   │   │   ├── MoviePage.jsx # 영화 페이지 컴포넌트
│   │   │   └── MoviePage.css # 영화 페이지 스타일
│   │   ├── drama/      # 드라마 페이지 관련 컴포넌트
│   │   │   ├── DramaPage.jsx # 드라마 페이지 컴포넌트
│   │   │   └── DramaPage.css # 드라마 페이지 스타일
│   │   ├── mylist/     # 마이 리스트 페이지 관련 컴포넌트
│   │   │   ├── MyListPage.jsx # 마이 리스트 페이지 컴포넌트
│   │   │   └── MyListPage.css # 마이 리스트 페이지 스타일
│   │   ├── account/    # 계정 페이지 관련 컴포넌트
│   │   │   └── AccountPage.jsx # 계정 페이지 컴포넌트
│   │   └── search/     # 검색 페이지 관련 컴포넌트
│   │       ├── SearchPage.jsx # 검색 페이지 컴포넌트
│   │       └── SearchPage.css # 검색 페이지 스타일
│   ├── services/       # API 및 서비스 함수
│   │   ├── api.js      # API 호출 관련 함수
│   │   ├── auth.js     # 인증 관련 함수
│   │   └── storage.js  # 로컬 스토리지 관련 함수
│   ├── store/          # 상태 관리 (Context API, Redux 등)
│   │   ├── authContext.js  # 인증 컨텍스트
│   │   ├── contentContext.js # 콘텐츠 컨텍스트
│   │   └── userContext.js  # 사용자 컨텍스트
│   ├── styles/         # 전역 스타일, 테마, 변수 등
│   │   ├── global.css  # 전역 스타일
│   │   └── variables.css # 색상, 폰트 등의 변수
│   ├── utils/          # 유틸리티 함수 및 헬퍼
│   │   ├── dateFormat.js # 날짜 포맷 함수
│   │   ├── stringUtils.js # 문자열 유틸리티
│   │   └── validation.js # 유효성 검사 함수
│   ├── App.jsx         # 앱의 루트 컴포넌트
│   ├── main.jsx        # 앱 진입점
│   └── routes.jsx      # 라우트 정의
├── public/             # 정적 파일
│   └── vite.svg        # Favicon
├── eslint.config.js    # ESLint 설정
├── vite.config.js      # Vite 설정
├── package.json        # 의존성 및 스크립트
└── README.md           # 프로젝트 설명
```

## 2. 데이터베이스 연동 및 API 통신

### 테이블 구조 (서버 측)

#### users 테이블
```sql
CREATE TABLE users (
    sha2_hash VARCHAR(256) PRIMARY KEY,
    age_avg FLOAT,
    main_channels TEXT,
    use_tms FLOAT,
    cnt INTEGER
);
```

#### asset 테이블
```sql
CREATE TABLE asset (
    full_asset_id VARCHAR(100) PRIMARY KEY,
    asset_nm TEXT,
    genre TEXT,
    cleaned_smry TEXT
);
```

### API 연동 방법

#### API 서비스 설정 (api.js)
```javascript
/**
 * API 호출을 위한 유틸리티 함수
 */

// API 기본 URL
const API_BASE_URL = '/api';

/**
 * 기본 fetch 래퍼 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise<any>} 응답 데이터
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('/api') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 추천 API 관련 함수
 */
export const recommendationAPI = {
  /**
   * 테스트 추천 목록 가져오기
   * @param {number} n - 가져올 아이템 수
   * @returns {Promise<any>} 추천 목록
   */
  getTestRecommendations: (n = 10) => {
    return fetchAPI(`/recommendation/test?n=${n}`);
  },
  
  /**
   * 인기 콘텐츠 가져오기
   * @param {number} limit - 가져올 아이템 수
   * @returns {Promise<any>} 인기 콘텐츠 목록
   */
  getPopular: (limit = 10) => {
    return fetchAPI(`/api/recommendation/popular?limit=${limit}`);
  },
  
  // 기타 추천 API 함수들...
};

/**
 * 검색 API 관련 함수
 */
export const searchAPI = {
  /**
   * 콘텐츠 검색
   * @param {string} query - 검색어
   * @param {number} limit - 검색 결과 수
   * @returns {Promise<any>} 검색 결과
   */
  search: (query, limit = 20) => {
    return fetchAPI(`/api/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  }
};
```

#### 커스텀 Hook을 사용한 데이터 가져오기 (useFetch.js)
```javascript
import { useState, useEffect } from 'react';

/**
 * API 요청을 위한 커스텀 훅
 * @param {string} url - 요청할 URL
 * @param {Object} options - fetch 옵션
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 데이터 다시 가져오기 함수
  const refetch = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || '데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    refetch();
  }, [url]);
  
  return { data, loading, error, refetch };
};
```

## 3. 컴포넌트 설계 및 데이터 흐름

### React 컴포넌트 구조

#### 레이아웃 컴포넌트 (MainLayout.jsx)
```jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './MainLayout.css';

/**
 * 메인 레이아웃 컴포넌트
 * 모든 페이지에서 공통으로 사용되는 헤더와 푸터를 포함한 레이아웃
 */
const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
```

#### 헤더 컴포넌트 (Header.jsx)
```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

/**
 * 헤더 컴포넌트
 * 네비게이션, 검색, 사용자 메뉴 등을 포함
 */
const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  // 로그아웃 핸들러
  const handleLogout = () => {
    // 로그아웃 로직 구현
    console.log('로그아웃');
    // 로그아웃 후 홈으로 이동
    navigate('/');
  };
  
  return (
    <header className="header">
      <div className="header-container">
        {/* 로고 */}
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.png" alt="WellList" />
          </Link>
        </div>
        
        {/* 네비게이션 */}
        <nav className="main-nav">
          <ul>
            <li><Link to="/">홈</Link></li>
            <li><Link to="/movie">영화</Link></li>
            <li><Link to="/drama">드라마</Link></li>
            <li><Link to="/mylist">찜 목록</Link></li>
          </ul>
        </nav>
        
        {/* 검색 폼 */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목, 배우, 감독, 장르 검색"
          />
          <button type="submit">
            <i className="search-icon">🔍</i>
          </button>
        </form>
        
        {/* 사용자 메뉴 */}
        <div className="user-menu">
          <button 
            className="user-button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <img src="/images/user-icon.png" alt="사용자 메뉴" />
          </button>
          
          {isUserMenuOpen && (
            <div className="user-dropdown">
              <ul>
                <li><Link to="/account">계정</Link></li>
                <li><button onClick={handleLogout}>로그아웃</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### 데이터 흐름

1. **API 요청 및 데이터 가져오기**:
   - `services/api.js`에서 API 호출 함수 정의
   - 각 컴포넌트 또는 페이지에서 필요한 API 함수 호출
   - 데이터 로딩, 에러 처리 및 상태 관리

2. **컴포넌트 간 데이터 전달**:
   - Props를 통한 부모-자식 컴포넌트 간 데이터 전달
   - Context API를 사용한 전역 상태 관리 (인증, 사용자 설정 등)
   - URL 파라미터를 통한 페이지 간 데이터 전달 (콘텐츠 ID 등)

3. **사용자 이벤트 처리**:
   - 이벤트 핸들러를 통한 사용자 액션 처리
   - 라우팅 및 페이지 전환 관리
   - 폼 제출 및 검증 처리

## 4. 컴포넌트 구현 및 페이지별 기능

### 홈페이지 (HomePage.jsx)

- **기능**:
  - 히어로 섹션 표시 (주요 콘텐츠 하이라이트)
  - 카테고리별 추천 콘텐츠 슬라이더 (인기작, 최신작, 장르별 추천 등)
  - 사용자 맞춤 추천 콘텐츠
  - 자동 슬라이더 및 탐색 버튼

```jsx
import { useState, useEffect } from 'react';
import Hero from '../../components/hero/Hero';
import ContentSection from '../../components/content/ContentSection';
import { recommendationAPI } from '../../services/api';
import './HomePage.css';

const HomePage = () => {
  const [heroData, setHeroData] = useState([]);
  const [popularContent, setPopularContent] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 데이터 로드
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // 병렬로 여러 API 엔드포인트 호출
        const [heroResponse, popularResponse, recentResponse] = await Promise.all([
          fetch('/api/recommendation/hero'),
          fetch('/api/recommendation/popular?limit=10'),
          fetch('/api/recommendation/recent?limit=10')
        ]);
        
        // 응답 처리
        const heroData = await heroResponse.json();
        const popularData = await popularResponse.json();
        const recentData = await recentResponse.json();
        
        // 상태 업데이트
        setHeroData(heroData.result || []);
        setPopularContent(popularData.result || []);
        setRecentContent(recentData.result || []);
      } catch (err) {
        setError('콘텐츠를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, []);
  
  // API 실패 시 사용할 샘플 데이터
  const sampleContentItems = [
    // 샘플 데이터 항목들...
  ];

  return (
    <div className="home-page">
      {/* 히어로 섹션 */}
      <Hero 
        content={heroData[0] || {}}
        isLoading={loading}
      />

      {/* 콘텐츠 섹션들 */}
      <div className="content-sections">
        {/* 인기 콘텐츠 */}
        <ContentSection 
          title="인기 콘텐츠"
          items={popularContent.length > 0 ? popularContent : sampleContentItems}
          isLoading={loading}
          error={error}
        />
        
        {/* 최신 콘텐츠 */}
        <ContentSection 
          title="최신 업데이트"
          items={recentContent.length > 0 ? recentContent : sampleContentItems}
          isLoading={loading}
          error={error}
        />
        
        {/* 추가 콘텐츠 섹션들... */}
      </div>
    </div>
  );
};

export default HomePage;
```

### 콘텐츠 상세 페이지 (ContentDetailsPage.jsx)

- **기능**:
  - 콘텐츠 상세 정보 표시 (포스터, 제목, 장르, 출시년도, 줄거리 등)
  - 배우 및 감독 정보
  - 관련 콘텐츠 추천
  - 재생 및 찜하기 버튼

```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ContentDetailsPage.css';

const ContentDetailsPage = () => {
  const { id } = useParams(); // URL에서 콘텐츠 ID 가져오기
  const [content, setContent] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchContentDetails = async () => {
      setLoading(true);
      
      try {
        // 콘텐츠 상세 정보 및 관련 콘텐츠 API 호출
        const [contentResponse, relatedResponse] = await Promise.all([
          fetch(`/api/content/${id}`),
          fetch(`/api/content/${id}/related`)
        ]);
        
        const contentData = await contentResponse.json();
        const relatedData = await relatedResponse.json();
        
        setContent(contentData);
        setRelatedContent(relatedData.items || []);
      } catch (err) {
        console.error('콘텐츠 로드 중 오류:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContentDetails();
  }, [id]);
  
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  return (
    <div className="content-details-page">
      {/* 콘텐츠 상세 정보 UI */}
      <div className="content-backdrop" style={{ backgroundImage: `url(${content?.backdrop_path})` }}>
        <div className="backdrop-overlay"></div>
      </div>
      
      <div className="content-info-container">
        {/* 포스터 이미지 */}
        <div className="content-poster">
          <img src={content?.poster_path} alt={content?.asset_nm} />
        </div>
        
        {/* 콘텐츠 정보 */}
        <div className="content-info">
          <h1>{content?.asset_nm}</h1>
          <div className="content-meta">
            {/* 메타 정보 (개봉년도, 장르, 러닝타임 등) */}
          </div>
          <div className="content-synopsis">
            <p>{content?.synopsis}</p>
          </div>
          <div className="content-actions">
            <button className="play-button">재생</button>
            <button className="add-list-button">찜하기</button>
          </div>
        </div>
      </div>
      
      {/* 관련 콘텐츠 섹션 */}
      <div className="related-content">
        <h2>비슷한 콘텐츠</h2>
        <div className="related-content-grid">
          {relatedContent.map(item => (
            <div className="related-content-item" key={item.idx}>
              <img src={item.poster_path} alt={item.asset_nm} />
              <h3>{item.asset_nm}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentDetailsPage;
```

## 5. 컴포넌트 재사용 및 공통 컴포넌트

### 슬라이더 컴포넌트 (Slider.jsx)

- **기능**:
  - 콘텐츠 카드를 수평 슬라이드로 표시
  - 좌/우 탐색 버튼
  - 반응형 디자인 (모바일/태블릿/데스크탑)
  - 마우스 오버 효과

```jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Slider.css';

/**
 * 콘텐츠 슬라이더 컴포넌트
 * @param {Object} props
 * @param {Array} props.items - 표시할 콘텐츠 아이템 배열
 * @param {string} props.title - 슬라이더 제목
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {string} props.sliderId - 고유 슬라이더 ID
 */
const Slider = ({ items = [], title = '', isLoading = false, sliderId = 'slider' }) => {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // 슬라이더 스크롤 위치에 따라 화살표 표시 여부 결정
  useEffect(() => {
    const updateArrows = () => {
      if (!sliderRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    };
    
    updateArrows();
    
    const slider = sliderRef.current;
    slider.addEventListener('scroll', updateArrows);
    return () => slider.removeEventListener('scroll', updateArrows);
  }, [items]);
  
  // 좌우 스크롤 핸들러
  const scroll = (direction) => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  // 드래그 시작
  const handleMouseDown = (e) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  
  // 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };
  
  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  return (
    <div className="slider-container" id={sliderId}>
      {title && <h2 className="slider-title">{title}</h2>}
      
      <div className="slider-wrapper">
        {showLeftArrow && (
          <button className="slider-arrow left" onClick={() => scroll('left')}>
            &lt;
          </button>
        )}
        
        <div 
          className="slider" 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {isLoading ? (
            <div className="slider-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="slider-empty">
              <p>표시할 콘텐츠가 없습니다.</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="slider-item" key={item.idx}>
                <Link to={`/content/${item.idx}`} className="card">
                  <div className="card-image">
                    <img 
                      src={item.poster_path || 'https://via.placeholder.com/300x450?text=No+Image'} 
                      alt={item.asset_nm} 
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/300x450?text=Error';
                      }} 
                    />
                  </div>
                  <div className="card-info">
                    <h3 className="card-title">{item.asset_nm}</h3>
                    <p className="card-meta">
                      {item.rlse_year && <span className="year">{item.rlse_year}</span>}
                      {item.genre && <span className="genre">{item.genre}</span>}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
        
        {showRightArrow && (
          <button className="slider-arrow right" onClick={() => scroll('right')}>
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default Slider;
```

### ContentSection 컴포넌트

- **기능**:
  - 제목과 슬라이더를 포함한 콘텐츠 섹션
  - 로딩 및 에러 상태 처리
  - 슬라이더 컴포넌트 사용

```jsx
import Slider from '../slider/Slider';
import './ContentSection.css';

/**
 * 콘텐츠 섹션 컴포넌트
 * 제목과 슬라이더를 포함한 콘텐츠 섹션
 */
const ContentSection = ({ title, items = [], isLoading = false, error = null, id = '' }) => {
  const sectionId = id || `section-${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <section className="content-section" id={sectionId}>
      {error ? (
        <div className="content-section-error">
          <h2>{title}</h2>
          <p className="error-message">{error}</p>
        </div>
      ) : (
        <Slider 
          title={title}
          items={items}
          isLoading={isLoading}
          sliderId={`${sectionId}-slider`}
        />
      )}
    </section>
  );
};

export default ContentSection;
```

## 6. 레이아웃 및 반응형 디자인

### 반응형 디자인 구현

#### 1. CSS 변수 시스템

```css
/* variables.css */
:root {
  /* 색상 */
  --primary-color: #e50914;
  --secondary-color: #222222;
  --background-color: #0f1116;
  --text-color: #ffffff;
  --text-secondary: #c0c0c0;
  
  /* 공간 */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  
  /* 레이아웃 */
  --header-height: 70px;
  --container-width: 1400px;
  --content-padding: 2rem;
  
  /* 카드 */
  --card-width-lg: 240px;
  --card-width-md: 200px;
  --card-width-sm: 160px;
  --card-aspect-ratio: 1.5;
  
  /* 반응형 */
  --breakpoint-xs: 480px;
  --breakpoint-sm: 768px;
  --breakpoint-md: 1024px;
  --breakpoint-lg: 1400px;
}

/* 다크 테마 */
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #0f1116;
    --secondary-color: #2a2c35;
    --text-color: #ffffff;
    --text-secondary: #c0c0c0;
  }
}
```

#### 2. 반응형 미디어 쿼리

```css
/* global.css */
/* 모바일 우선 접근 */
body {
  font-size: 16px;
  background-color: var(--background-color);
  color: var(--text-color);
}

/* 타블렛 */
@media (min-width: 768px) {
  body {
    font-size: 16px;
  }
  
  .slider-item {
    width: var(--card-width-sm);
  }
}

/* 작은 데스크탑 */
@media (min-width: 1024px) {
  body {
    font-size: 16px;
  }
  
  .slider-item {
    width: var(--card-width-md);
  }
}

/* 큰 데스크탑 */
@media (min-width: 1400px) {
  .slider-item {
    width: var(--card-width-lg);
  }
}
```

## 7. 페이지 간 일관성 유지 및 컴포넌트 재사용

### 페이지 간 일관성 유지 전략

1. **공통 레이아웃 사용**
   - `MainLayout.jsx`를 통해 모든 페이지에서 동일한 헤더/푸터 구조 유지
   - React Router의 `Outlet`을 활용한 레이아웃 중첩

2. **디자인 시스템 구축**
   - 일관된 색상, 간격, 타이포그래피 변수 사용
   - 공통 UI 컴포넌트 라이브러리 구축 (버튼, 입력 필드 등)

3. **컴포넌트 재사용**
   - 공통 컴포넌트 추출 및 재사용
   - Props와 상태를 통한 동적 렌더링
   - 조건부 렌더링으로 다양한 상황 대응

### 라우팅 설정 (routes.jsx)

```jsx
import { Route, Routes, Navigate } from 'react-router-dom';

// 페이지 컴포넌트 가져오기
import HomePage from './pages/home/HomePage';
import SearchPage from './pages/search/SearchPage';
import MoviePage from './pages/movie/MoviePage';
import DramaPage from './pages/drama/DramaPage';
import MyListPage from './pages/mylist/MyListPage';
import AccountPage from './pages/account/AccountPage';
import ContentDetailsPage from './pages/contents/ContentDetailsPage';

// 레이아웃 컴포넌트
import MainLayout from './components/layout/MainLayout';

/**
 * 애플리케이션 경로 정의
 * 레이아웃 구성요소와 함께 모든 경로를 정의
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* 메인 레이아웃이 적용된 경로 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie" element={<MoviePage />} />
        <Route path="/drama" element={<DramaPage />} />
        <Route path="/mylist" element={<MyListPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/content/:id" element={<ContentDetailsPage />} />
      </Route>
      
      {/* 레이아웃이 없는 특수 경로 또는 리다이렉션 */}
      <Route path="/login" element={<Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
```

### 앱 진입점 (App.jsx)

```jsx
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
```

## 8. 기존 HTML 페이지와의 통합

### StandaloneSlider.jsx (기존 HTML에 React 슬라이더 삽입)

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Slider from './components/slider/Slider';
import './StandaloneSlider.css';

/**
 * 기존 HTML 페이지에 임베드 가능한 React 슬라이더
 * 데이터 속성을 통해 설정 가능
 */
const StandaloneSlider = () => {
  // 마운트될 요소 찾기
  const mountElement = document.getElementById('react-slider-mount');
  
  if (!mountElement) {
    console.error('마운트 요소를 찾을 수 없습니다. id="react-slider-mount" 요소가 필요합니다.');
    return null;
  }
  
  // 데이터 속성 가져오기
  const title = mountElement.dataset.title || '추천 콘텐츠';
  const url = mountElement.dataset.url;
  const id = mountElement.dataset.id;
  const jsonItems = mountElement.dataset.items;
  
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    // API URL이 있으면 데이터 가져오기
    if (url) {
      fetchData(url);
    } 
    // ID가 있으면 해당 ID로 추천 API 호출
    else if (id) {
      fetchData(`/recommendation/similar/${id}`);
    }
    // JSON 데이터가 직접 제공된 경우
    else if (jsonItems) {
      try {
        const parsedItems = JSON.parse(jsonItems);
        setItems(parsedItems);
        setLoading(false);
      } catch (err) {
        console.error('JSON 파싱 오류:', err);
        setError('데이터 형식이 올바르지 않습니다.');
        setLoading(false);
      }
    } 
    // 데이터 소스가 없는 경우
    else {
      setLoading(false);
      setError('데이터 소스가 지정되지 않았습니다. data-url 또는 data-items 속성이 필요합니다.');
    }
  }, [url, id, jsonItems]);
  
  // API 데이터 가져오기
  const fetchData = async (apiUrl) => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      const data = await response.json();
      setItems(data.result || data.items || []);
    } catch (err) {
      console.error('데이터 로드 오류:', err);
      setError('콘텐츠를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Slider
      title={title}
      items={items}
      isLoading={loading}
      error={error}
      sliderId={`standalone-slider-${Math.random().toString(36).substring(2, 9)}`}
    />
  );
};

// 앱 마운트 (React 18 방식)
const root = ReactDOM.createRoot(document.getElementById('react-slider-mount'));
root.render(<StandaloneSlider />);
```

### 기존 HTML 페이지에서 사용 예시

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React 슬라이더 통합 예시</title>
  <link rel="stylesheet" href="/components/header.css">
  <!-- 기존 스타일 -->
</head>
<body>
  <!-- 기존 HTML 콘텐츠 -->
  
  <!-- React 슬라이더 마운트 포인트 -->
  <div id="react-slider-mount" data-title="인기 콘텐츠" data-url="/recommendation/top?n=10"></div>
  
  <!-- 기존 스크립트 -->
  
  <!-- React 슬라이더 스크립트 -->
  <script type="module" src="/react/slider.es.js"></script>
</body>
</html>
```

## 9. 성능 최적화 및 고려사항

### 성능 최적화 전략

1. **코드 분할 및 지연 로딩**
   - React.lazy()와 Suspense를 사용한 컴포넌트 지연 로딩
   - 큰 페이지나 모달을 필요할 때만 로드

2. **이미지 최적화**
   - 이미지 지연 로딩 (loading="lazy" 속성 사용)
   - 이미지 오류 처리 및 대체 이미지 제공
   - 반응형 이미지 (화면 크기에 맞는 크기 제공)

3. **메모이제이션**
   - React.memo, useCallback, useMemo를 사용한 불필요한 렌더링 방지
   - 큰 목록의 경우 가상화 기법 사용

4. **API 요청 최적화**
   - 데이터 캐싱
   - 병렬 요청 처리
   - 에러 핸들링 및 재시도 전략

### 접근성(a11y) 고려사항

- 키보드 탐색 지원 (포커스 관리)
- ARIA 속성 사용
- 충분한 색상 대비
- 스크린 리더 지원

## 10. 배포 및 환경 설정

### Vite 설정 (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // API 요청 프록시 설정
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/recommendation': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    // 단독 컴포넌트 빌드 설정 (기존 HTML 페이지 삽입용)
    lib: {
      entry: path.resolve(__dirname, 'src/StandaloneSlider.jsx'),
      name: 'ReactSlider',
      fileName: 'slider',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
```

### 환경별 설정

- **개발 환경**: `.env.development` 파일에 개발 서버 URL 등 설정
- **프로덕션 환경**: `.env.production` 파일에 실제 API 서버 URL 등 설정
- **테스트 환경**: `.env.test` 파일에 테스트 설정

```
# .env.development
VITE_API_BASE_URL=http://localhost:8000
VITE_ENABLE_MOCK_API=true

# .env.production
VITE_API_BASE_URL=/api
VITE_ENABLE_MOCK_API=false
```

## 11. 점진적 마이그레이션 전략

### 마이그레이션 접근 방식

1. **공통 컴포넌트 먼저 변환**
   - 슬라이더, 헤더, 푸터 등 재사용 가능한 컴포넌트부터 React로 변환

2. **독립적인 기능 마이그레이션**
   - 기존 HTML/JS 코드와 독립적으로 동작할 수 있는 기능부터 이전
   - 예: 검색 기능, 콘텐츠 슬라이더

3. **하이브리드 접근**
   - React 컴포넌트를 기존 HTML 페이지에 삽입
   - 예: StandaloneSlider.jsx

4. **페이지별 점진적 마이그레이션**
   - 트래픽이 적거나 덜 중요한 페이지부터 시작
   - 각 페이지를 React로 완전히 변환
   - React Router를 사용하여 SPA로 통합

### 마이그레이션 순서

1. 슬라이더 컴포넌트
2. 헤더 및 네비게이션
3. 푸터 컴포넌트
4. 콘텐츠 카드 컴포넌트
5. 홈페이지
6. 검색 페이지
7. 콘텐츠 상세 페이지
8. 영화/드라마 카테고리 페이지
9. 마이 리스트 페이지
10. 계정 관련 페이지

## 12. 유지보수 및 확장성

### 코드 구조화 원칙

1. **관심사 분리**
   - UI 컴포넌트와 비즈니스 로직을 분리
   - 데이터 페칭을 커스텀 훅이나 서비스로 분리

2. **모듈화**
   - 작고 집중된 컴포넌트 설계
   - 단일 책임 원칙 준수

3. **재사용 가능한 컴포넌트**
   - 공통 UI 요소를 재사용 가능한 컴포넌트로 개발
   - Props를 통한 설정 가능성

4. **확장성 있는 설계**
   - 새로운 기능이나 페이지를 쉽게 추가할 수 있는 구조
   - 플러그인 패턴 활용

### 문서화

- 주요 컴포넌트에 JSDoc 주석 추가
- README.md 파일에 프로젝트 구조 및 실행 방법 설명
- 스토리북(Storybook)을 사용한 컴포넌트 문서화 및 시각적 테스트

### 테스트

- Jest와 React Testing Library를 사용한 단위 테스트
- Cypress를 사용한 E2E 테스트
- 테스트 커버리지 모니터링
