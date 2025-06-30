# React에서 FastAPI 데이터 연동 가이드

## React와 FastAPI 연동 요약 가이드
# 1. 환경 설정
.env: VITE_API_URL=http://localhost:8000 설정

FastAPI 서버 실행 여부 확인 (http://localhost:8000/docs)

# 2. API 서비스 구성
apiService.js: fetch 기반 API 요청 래퍼

도메인별 서비스 (todayRecommendationService.js 등)에서 API 호출 후 데이터 정제

# 3. 컴포넌트에서 호출
useEffect에서 API 호출 → state에 저장

props로 데이터 전달하여 렌더링

# 4. 데이터 구조 변환
FastAPI 응답 데이터를 사용하기 좋게 매핑
{
  idx, asset_nm, genre, poster_path, release_year, description
}

# 5. 실제 적용 예시
Hero.jsx, Slider.jsx, Search.jsx, ContentDetailsPage.jsx 등에서 API 연동 구현
로딩/에러 처리 포함

# 6. 공통 로직 추상화
useApi 훅으로 API 호출 로직 재사용
로딩/에러 상태 컴포넌트로 분리 (LoadingSpinner, ErrorMessage)

# 7. 최적화 & 베스트 프랙티스
디바운스: 검색 입력 최적화
캐싱: API 중복 호출 방지

JSDoc: 타입 명세 제공

환경별 설정: 개발/운영 분기 처리


# 📌 전체 흐름 정리
[FastAPI → API 서비스 → React 컴포넌트 → UI 렌더링]


## 목차
1. [환경 설정](#환경-설정)
2. [API 서비스 생성](#api-서비스-생성)
3. [컴포넌트에서 API 호출](#컴포넌트에서-api-호출)
4. [UI에 데이터 표시](#ui에-데이터-표시)
5. [실제 구현 예시](#실제-구현-예시)
6. [에러 처리 및 로딩 상태](#에러-처리-및-로딩-상태)
7. [베스트 프랙티스](#베스트-프랙티스)

---

## 환경 설정

### 1. 환경 변수 설정 (.env)
```bash
# Vite 환경변수는 VITE_ 접두사 필요
VITE_API_URL=http://localhost:8000
```

### 2. FastAPI 서버 확인
```bash
# FastAPI 서버가 실행 중인지 확인
curl http://localhost:8000/docs
```

---

## API 서비스 생성

### 1. 기본 API 서비스 구조
```javascript
// src/services/apiService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 기본 fetch 래퍼
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
};

export default apiRequest;
```

### 2. 특정 도메인 API 서비스
```javascript
// src/services/todayRecommendationService.js
import apiRequest from './apiService';

export const getTodayRecommendations = async (userId = 1, count = 10) => {
  try {
    console.log(`오늘의 추천 API 호출: /recommendation/today/personalized/${userId}?n=${count}`);
    
    const data = await apiRequest(`/recommendation/today/personalized/${userId}?n=${count}`);
    
    // FastAPI 응답 데이터 변환
    if (data && data.items && Array.isArray(data.items)) {
      const transformedData = data.items.map(item => ({
        idx: item.idx,
        asset_nm: item.asset_nm || item.super_asset_nm || '제목 없음',
        genre: item.genre || '기타',
        poster_path: item.poster_path || 'https://placehold.co/300x450?text=No+Image',
        release_year: item.rlse_year ? String(item.rlse_year).slice(0, 4) : new Date().getFullYear().toString(),
        description: item.smry || item.smry_shrt || '설명이 없습니다.'
      }));
      
      console.log('변환된 데이터:', transformedData);
      return transformedData;
    }
    
    throw new Error('NO_DATA');
    
  } catch (error) {
    console.error('오늘의 추천 데이터 로드 실패:', error);
    
    // Fallback 데이터 반환
    return [
      {
        idx: '1',
        asset_nm: '위험한 관계',
        genre: '드라마',
        poster_path: 'https://image.tmdb.org/t/p/w500/7d8bGBp1CWXfPXmXSbgYHvxsJUs.jpg',
        release_year: '2022',
        description: '욕망과 진실한 사랑의 위험한 관계를 만나보세요'
      }
    ];
  }
};
```

---

## 컴포넌트에서 API 호출

### 1. 페이지 컴포넌트에서 데이터 로드
```javascript
// src/pages/main/HomePage.jsx
import { useState, useEffect } from 'react';
import { getTodayRecommendations } from '../../services/todayRecommendationService';
import Hero from '../../components/hero/Hero';

const HomePage = () => {
  const [heroItems, setHeroItems] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroError, setHeroError] = useState(null);

  // 현재 사용자 ID 가져오기
  const getCurrentUserId = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      return userData.user_idx || 541; // 기본값
    } catch (error) {
      console.error('사용자 ID 가져오기 실패:', error);
      return 541;
    }
  };

  useEffect(() => {
    const loadHeroData = async () => {
      setHeroLoading(true);
      try {
        const userId = getCurrentUserId();
        console.log('HomePage - 현재 사용자 ID:', userId);
        
        const heroData = await getTodayRecommendations(userId, 5);
        
        if (heroData && heroData.length > 0) {
          setHeroItems(heroData);
          setHeroError(null);
        } else {
          setHeroError('추천 데이터가 없습니다.');
        }
      } catch (error) {
        console.error('Hero 데이터 로드 실패:', error);
        setHeroError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setHeroLoading(false);
      }
    };

    loadHeroData();
  }, []);

  return (
    <div className="home-page">
      <Hero 
        items={heroItems} 
        loading={heroLoading} 
        error={heroError} 
      />
      {/* 다른 컴포넌트들... */}
    </div>
  );
};

export default HomePage;
```

### 2. 컴포넌트에서 props로 데이터 받기
```javascript
// src/components/hero/Hero.jsx
import { useState, useEffect } from 'react';

const Hero = ({ items = [], loading = false, error = null }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroItems = items || [];

  // 로딩 상태 처리
  if (loading) {
    return (
      <section className="hero">
        <div className="hero-slider-view">
          <div className="hero-loading">
            <div className="loading-spinner"></div>
            <p>오늘의 추천을 불러오는 중...</p>
          </div>
        </div>
      </section>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <section className="hero">
        <div className="hero-slider-view">
          <div className="hero-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              다시 시도
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 실제 데이터 렌더링
  return (
    <section className="hero">
      <div className="hero-slider-view">
        <div className="hero-slider-track">
          {heroItems.map((item, index) => (
            <div key={item.idx || index} className="hero-slide">
              <div className="hero-poster">
                <img 
                  src={item.poster_path} 
                  alt={`${item.asset_nm} 포스터`}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/300x450/333/fff?text=이미지\n없음';
                  }}
                />
              </div>
              <div className="hero-info">
                <h2 className="hero-title">{item.asset_nm}</h2>
                <div className="content-meta">
                  <span className="release-year">{item.release_year}</span>
                  <span className="genre">{item.genre}</span>
                </div>
                <p className="hero-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

---

## UI에 데이터 표시

### 1. 데이터 바인딩 패턴
```javascript
// FastAPI 응답 → React State → UI 렌더링

// FastAPI 응답 예시:
{
  "items": [
    {
      "idx": 123,
      "asset_nm": "영화 제목",
      "genre": "액션",
      "rlse_year": 2023,
      "poster_path": "https://...",
      "smry": "영화 설명"
    }
  ]
}

// React State로 변환:
const [items, setItems] = useState([
  {
    idx: 123,
    asset_nm: "영화 제목",
    genre: "액션", 
    release_year: "2023",
    poster_path: "https://...",
    description: "영화 설명"
  }
]);

// UI 렌더링:
{items.map(item => (
  <div key={item.idx}>
    <img src={item.poster_path} alt={item.asset_nm} />
    <h3>{item.asset_nm}</h3>
    <p>{item.genre} · {item.release_year}</p>
  </div>
))}
```

### 2. 슬라이더 컴포넌트 데이터 흐름
```javascript
// 1. 페이지에서 API 호출
const [sliderItems, setSliderItems] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const data = await getMovieRecommendations();
    setSliderItems(data);
  };
  fetchData();
}, []);

// 2. 슬라이더에 데이터 전달
<Slider items={sliderItems} title="추천 영화" />

// 3. 슬라이더에서 렌더링
const Slider = ({ items, title }) => (
  <div className="slider-section">
    <h2>{title}</h2>
    <div className="card-container">
      {items.map(item => (
        <div key={item.idx} className="card" onClick={() => navigate(`/contents/${item.idx}`)}>
          <img src={item.poster_path} alt={item.asset_nm} />
        </div>
      ))}
    </div>
  </div>
);
```

---

## 실제 구현 예시

### 1. 검색 기능 구현
```javascript
// src/services/searchService.js
export const searchContent = async (query, limit = 10) => {
  try {
    const data = await apiRequest(`/search/?query=${encodeURIComponent(query)}&limit=${limit}`);
    return data.results || [];
  } catch (error) {
    console.error('검색 실패:', error);
    return [];
  }
};

// src/components/search/Search.jsx
const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (searchQuery) => {
    setLoading(true);
    try {
      const results = await searchContent(searchQuery);
      setSuggestions(results);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-component">
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      {loading && <div>검색 중...</div>}
      {suggestions.map(item => (
        <div key={item.idx} onClick={() => navigate(`/contents/${item.idx}`)}>
          {item.asset_nm}
        </div>
      ))}
    </div>
  );
};
```

### 2. 상세 페이지 구현
```javascript
// src/pages/contents/ContentDetailsPage.jsx
import { useParams } from 'react-router-dom';

const ContentDetailsPage = () => {
  const { id } = useParams(); // URL에서 ID 추출
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await apiRequest(`/content/${id}`);
        setContent(data);
      } catch (error) {
        console.error('콘텐츠 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (!content) return <div>콘텐츠를 찾을 수 없습니다.</div>;

  return (
    <div className="content-details">
      <img src={content.poster_path} alt={content.asset_nm} />
      <h1>{content.asset_nm}</h1>
      <p>{content.description}</p>
    </div>
  );
};
```

---

## 에러 처리 및 로딩 상태

### 1. 통합 에러 처리
```javascript
// src/hooks/useApi.js
import { useState, useEffect } from 'react';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// 사용 예시
const HomePage = () => {
  const { data: heroItems, loading, error } = useApi(() => getTodayRecommendations(541, 5));

  return <Hero items={heroItems} loading={loading} error={error} />;
};
```

### 2. 로딩 및 에러 UI 컴포넌트
```javascript
// src/components/common/LoadingSpinner.jsx
const LoadingSpinner = ({ message = "로딩 중..." }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

// src/components/common/ErrorMessage.jsx
const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-container">
    <p>{message}</p>
    {onRetry && <button onClick={onRetry}>다시 시도</button>}
  </div>
);
```

---

## 베스트 프랙티스

### 1. API 호출 최적화
```javascript
// 디바운스를 통한 검색 최적화
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// 사용 예시
const Search = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery);
    }
  }, [debouncedQuery]);
};
```

### 2. 캐싱 전략
```javascript
// 메모리 캐시
const cache = new Map();

const apiRequestWithCache = async (endpoint, options = {}) => {
  const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
  
  if (cache.has(cacheKey)) {
    console.log('캐시에서 데이터 반환:', cacheKey);
    return cache.get(cacheKey);
  }

  const data = await apiRequest(endpoint, options);
  cache.set(cacheKey, data);
  
  // 5분 후 캐시 삭제
  setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
  
  return data;
};
```

### 3. 타입 안전성 (선택사항)
```javascript
// JSDoc을 통한 타입 힌트
/**
 * @typedef {Object} ContentItem
 * @property {number} idx - 콘텐츠 ID
 * @property {string} asset_nm - 콘텐츠 제목
 * @property {string} genre - 장르
 * @property {string} poster_path - 포스터 이미지 URL
 * @property {string} release_year - 출시년도
 * @property {string} description - 설명
 */

/**
 * 오늘의 추천 콘텐츠를 가져옵니다
 * @param {number} userId - 사용자 ID
 * @param {number} count - 가져올 개수
 * @returns {Promise<ContentItem[]>} 추천 콘텐츠 배열
 */
export const getTodayRecommendations = async (userId, count) => {
  // ...
};
```

### 4. 환경별 설정
```javascript
// src/config/api.js
const getApiConfig = () => {
  const isDevelopment = import.meta.env.MODE === 'development';
  
  return {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: isDevelopment ? 10000 : 5000,
    retries: isDevelopment ? 1 : 3,
  };
};

export default getApiConfig();
```

---

## 전체 데이터 흐름 요약

```
FastAPI 서버 → API 서비스 → React 컴포넌트 → UI 렌더링

1. FastAPI에서 JSON 응답
2. API 서비스에서 데이터 변환/정제
3. React 컴포넌트에서 state 관리
4. UI에서 데이터 표시
5. 사용자 상호작용 → 새로운 API 호출
```

이 가이드라인을 따르면 FastAPI와 React 간의 데이터 연동을 효과적으로 구현할 수 있습니다.