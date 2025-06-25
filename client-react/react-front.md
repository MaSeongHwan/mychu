# VOD 추천 서비스 프론트엔드 (React/Vite)

## 프로젝트 개요

기존 HTML/CSS/JS 기반 VOD 추천 서비스를 React SPA 구조로 완전히 이식한 프로젝트입니다.

## 프로젝트 구조

```
client-react/
├── src/
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── home/
│   │   │   └── LandingPage.jsx # 랜딩 페이지 (/)
│   │   ├── main/
│   │   │   └── HomePage.jsx    # 메인 홈 페이지 (/home)
│   │   ├── index/
│   │   │   └── SignupPage.jsx  # 회원가입 (/signup)
│   │   ├── login/
│   │   │   └── LoginPage.jsx   # 로그인 (/login)
│   │   ├── account-select/
│   │   │   └── AccountSelectPage.jsx  # 계정 선택 (/account-select)
│   │   ├── movie/
│   │   │   └── MoviePage.jsx   # 영화 페이지 (/movie)
│   │   ├── drama/
│   │   │   └── DramaPage.jsx   # 드라마 페이지 (/drama)
│   │   └── search/
│   │       └── SearchPage.jsx  # 검색 페이지 (/search)
│   │
│   ├── components/             # 재사용 가능한 UI 컴포넌트
│   │   ├── layout/
│   │   │   └── Header.jsx      # 네비게이션 헤더
│   │   ├── slider/
│   │   │   ├── Slider.jsx      # 콘텐츠 슬라이더
│   │   │   └── Slider.css
│   │   ├── recommendations/
│   │   │   ├── Recommendations.jsx  # 추천 시스템
│   │   │   └── Recommendations.css
│   │   ├── search/
│   │   │   ├── Search.jsx      # 검색 컴포넌트
│   │   │   └── Search.css
│   │   ├── dropdown/
│   │   │   ├── GenreDropdown.jsx    # 장르 드롭다운
│   │   │   └── Dropdown.css
│   │   └── hero/
│   │       ├── Hero.jsx        # 히어로 배너
│   │       └── Hero.css
│   │
│   ├── services/               # API 및 서비스 레이어
│   │   ├── api.js              # 기본 API 클라이언트
│   │   ├── searchAPI.js        # 검색 API 서비스
│   │   ├── recommendationService.js  # 추천 API 서비스
│   │   ├── recommendationHelpers.js  # 추천 헬퍼 함수
│   │   ├── auth.js             # 인증 서비스
│   │   └── firebase.js         # Firebase 설정
│   │
│   ├── utils/                  # 유틸리티 함수
│   │   ├── apiConfig.js        # API 설정 상수
│   │   └── apiCache.js         # API 캐시 관리
│   │
│   ├── assets/                 # 정적 파일
│   │   └── images/
│   │
│   ├── styles/                 # 전역 스타일
│   │   └── globals.css
│   │
│   ├── App.jsx                 # 루트 컴포넌트
│   ├── App.css
│   ├── main.jsx                # 진입점
│   ├── index.css
│   └── routes.jsx              # 라우팅 설정
│
├── public/
├── .env.example                # 환경변수 예제
├── vite.config.js
├── package.json
└── README.md
```

## 주요 기능

### 1. 페이지 구성
- **LandingPage**: WellList 브랜드 랜딩 페이지
- **HomePage**: 영화/드라마 구분된 메인 홈 페이지 
- **SignupPage**: 회원가입 페이지
- **LoginPage**: 로그인 페이지  
- **AccountSelectPage**: 프로필 선택 페이지
- **MoviePage**: 영화 전용 페이지
- **DramaPage**: 드라마 전용 페이지
- **SearchPage**: 통합 검색 페이지

### 2. 컴포넌트 시스템
- **Header**: 반응형 네비게이션 헤더
- **Slider**: 콘텐츠 슬라이더 (터치/마우스 지원)
- **Recommendations**: AI 기반 추천 시스템
- **Search**: 실시간 검색 및 자동완성
- **GenreDropdown**: 장르별 필터링
- **Hero**: 메인 배너 및 히어로 섹션

### 3. 서비스 레이어
- **API 통합**: 백엔드 API와 완전 연동
- **검색 시스템**: 실시간 검색 및 필터링
- **추천 엔진**: 개인화된 콘텐츠 추천
- **인증 시스템**: Firebase 기반 사용자 인증
- **캐시 관리**: API 응답 캐싱 및 최적화

## 기술 스택

- **Frontend**: React 18, Vite
- **Routing**: React Router v6
- **Styling**: CSS Modules, CSS Variables
- **Authentication**: Firebase Auth
- **API**: RESTful API with caching
- **Build Tool**: Vite
- **Package Manager**: npm

## 환경 설정

### 1. 환경변수 설정
`.env` 파일을 생성하고 다음 내용을 설정:

```env
# API 설정
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=10000

# Firebase 설정
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# 기타 설정
VITE_APP_NAME=WellList
VITE_CACHE_DURATION=300000
```

### 2. 패키지 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 주요 특징

### 1. SPA 아키텍처
- React Router를 통한 SPA 네비게이션
- 페이지 간 부드러운 전환
- 브라우저 히스토리 관리

### 2. 반응형 디자인
- 모바일 우선 설계
- 다양한 화면 크기 지원
- 터치/마우스 인터랙션 최적화

### 3. 성능 최적화
- API 응답 캐싱
- 이미지 레이지 로딩
- 컴포넌트 코드 분할

### 4. 사용자 경험
- 직관적인 네비게이션
- 실시간 검색 및 필터링
- 개인화된 추천 시스템

## API 연동

### 추천 API
```javascript
// 영화 추천 가져오기
const movieRecommendations = await recommendationService.getRecommendations({
  isMovie: true,
  limit: 20
});

// 드라마 추천 가져오기  
const dramaRecommendations = await recommendationService.getRecommendations({
  isDrama: true,
  limit: 20
});
```

### 검색 API
```javascript
// 콘텐츠 검색
const searchResults = await searchAPI.searchContent({
  query: '검색어',
  contentType: 'movie', // 'movie' | 'drama' | 'all'
  limit: 50
});
```

## 보안 설정

### Firebase 인증
- 환경변수를 통한 API 키 관리
- `.gitignore`에 민감한 정보 제외
- 프로덕션/개발 환경 분리

### API 보안
- CORS 설정
- API 타임아웃 관리
- 에러 핸들링

## 개발 가이드

### 컴포넌트 작성 규칙
1. 각 컴포넌트는 독립된 폴더에 위치
2. CSS 파일은 컴포넌트와 동일한 폴더에 위치
3. PropTypes 또는 TypeScript 타입 정의
4. 재사용 가능하도록 설계

### 서비스 레이어 사용
1. API 호출은 services 폴더의 함수 사용
2. 비즈니스 로직은 컴포넌트에서 분리
3. 에러 처리 및 로딩 상태 관리

### 스타일링 가이드
1. CSS Variables 사용으로 일관성 유지
2. 반응형 디자인 적용
3. 접근성(a11y) 고려

## 프로젝트 현황

### 완료된 기능
- ✅ React SPA 구조 완전 이식
- ✅ 모든 페이지 컴포넌트 구현
- ✅ 추천/검색/슬라이더 시스템 통합
- ✅ Firebase 인증 시스템
- ✅ API 연동 및 캐싱
- ✅ 반응형 UI/UX
- ✅ 환경변수 보안 설정

### 향후 개선 사항
- 성능 최적화 (React.memo, useMemo)
- 에러 바운더리 및 전역 에러 처리
- 단위/E2E 테스트 코드
- 접근성(ARIA) 개선
- 상태관리 라이브러리 도입
- PWA 기능 추가

## 핵심 컴포넌트 예제

### Slider 컴포넌트
```jsx
import React, { useState, useRef, useEffect } from 'react';
import './Slider.css';

const Slider = ({ 
  items = [], 
  itemsPerView = 5, 
  autoPlay = false, 
  autoPlayInterval = 3000,
  onItemClick 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev + itemsPerView >= items.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.max(0, items.length - itemsPerView) : prev - 1
    );
  };

  return (
    <div className="slider-container">
      <button className="slider-btn prev" onClick={prevSlide}>
        ←
      </button>
      
      <div className="slider-wrapper" ref={sliderRef}>
        <div 
          className="slider-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="slider-item"
              onClick={() => onItemClick?.(item)}
            >
              <img src={item.poster} alt={item.title} />
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
      
      <button className="slider-btn next" onClick={nextSlide}>
        →
      </button>
    </div>
  );
};
```

### Recommendations 컴포넌트
```jsx
import React, { useState, useEffect } from 'react';
import { recommendationService } from '../../services/recommendationService';
import Slider from '../slider/Slider';
import './Recommendations.css';

const Recommendations = ({ 
  userId, 
  contentType = 'all', 
  limit = 20 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await recommendationService.getRecommendations({
          userId,
          isMovie: contentType === 'movie',
          isDrama: contentType === 'drama',
          limit
        });
        setRecommendations(data);
      } catch (error) {
        console.error('추천 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, contentType, limit]);

  if (loading) return <div className="loading">추천을 불러오는 중...</div>;

  return (
    <div className="recommendations">
      <h2>맞춤 추천</h2>
      <Slider
        items={recommendations}
        itemsPerView={5}
        onItemClick={(item) => console.log('클릭:', item)}
      />
    </div>
  );
};
```

## 배포 및 운영

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물 확인
npm run preview

# Docker 컨테이너 빌드
docker build -t welllist-frontend .

# Docker 실행
docker run -p 3000:3000 welllist-frontend
```

### 성능 모니터링
- Lighthouse 점수 정기 확인
- Bundle 크기 최적화
- 로딩 시간 모니터링
- 사용자 인터랙션 추적

---

**프로젝트 완료**: 기존 HTML/CSS/JS 기반 VOD 서비스가 React SPA로 완전히 이식되었습니다.

## 프로젝트 개요

기존 HTML/CSS/JS 기반 VOD 추천 서비스를 React SPA 구조로 완전히 이식한 프로젝트입니다.

## 프로젝트 구조

```
client-react/
├── src/
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── home/
│   │   │   └── LandingPage.jsx # 랜딩 페이지 (/)
│   │   ├── main/
│   │   │   └── HomePage.jsx    # 메인 홈 페이지 (/home)
│   │   ├── index/
│   │   │   └── SignupPage.jsx  # 회원가입 (/signup)
│   │   ├── login/
│   │   │   └── LoginPage.jsx   # 로그인 (/login)
│   │   ├── account-select/
│   │   │   └── AccountSelectPage.jsx  # 계정 선택 (/account-select)
│   │   ├── movie/
│   │   │   └── MoviePage.jsx   # 영화 페이지 (/movie)
│   │   ├── drama/
│   │   │   └── DramaPage.jsx   # 드라마 페이지 (/drama)
│   │   └── search/
│   │       └── SearchPage.jsx  # 검색 페이지 (/search)
│   │
│   ├── components/             # 재사용 가능한 UI 컴포넌트
│   │   ├── layout/
│   │   │   └── Header.jsx      # 네비게이션 헤더
│   │   ├── slider/
│   │   │   ├── Slider.jsx      # 콘텐츠 슬라이더
│   │   │   └── Slider.css
│   │   ├── recommendations/
│   │   │   ├── Recommendations.jsx  # 추천 시스템
│   │   │   └── Recommendations.css
│   │   ├── search/
│   │   │   ├── Search.jsx      # 검색 컴포넌트
│   │   │   └── Search.css
│   │   ├── dropdown/
│   │   │   ├── GenreDropdown.jsx    # 장르 드롭다운
│   │   │   └── Dropdown.css
│   │   └── hero/
│   │       ├── Hero.jsx        # 히어로 배너
│   │       └── Hero.css
│   │
│   ├── services/               # API 및 서비스 레이어
│   │   ├── api.js              # 기본 API 클라이언트
│   │   ├── searchAPI.js        # 검색 API 서비스
│   │   ├── recommendationService.js  # 추천 API 서비스
│   │   ├── recommendationHelpers.js  # 추천 헬퍼 함수
│   │   ├── auth.js             # 인증 서비스
│   │   └── firebase.js         # Firebase 설정
│   │
│   ├── utils/                  # 유틸리티 함수
│   │   ├── apiConfig.js        # API 설정 상수
│   │   └── apiCache.js         # API 캐시 관리
│   │
│   ├── assets/                 # 정적 파일
│   │   └── images/
│   │
│   ├── styles/                 # 전역 스타일
│   │   └── globals.css
│   │
│   ├── App.jsx                 # 루트 컴포넌트
│   ├── App.css
│   ├── main.jsx                # 진입점
│   ├── index.css
│   └── routes.jsx              # 라우팅 설정
│
├── public/
├── .env.example                # 환경변수 예제
├── vite.config.js
├── package.json
└── README.md
```

## 주요 기능

### 1. 페이지 구성
- **LandingPage**: WellList 브랜드 랜딩 페이지
- **HomePage**: 영화/드라마 구분된 메인 홈 페이지 
- **SignupPage**: 회원가입 페이지
- **LoginPage**: 로그인 페이지  
- **AccountSelectPage**: 프로필 선택 페이지
- **MoviePage**: 영화 전용 페이지
- **DramaPage**: 드라마 전용 페이지
- **SearchPage**: 통합 검색 페이지

### 2. 컴포넌트 시스템
- **Header**: 반응형 네비게이션 헤더
- **Slider**: 콘텐츠 슬라이더 (터치/마우스 지원)
- **Recommendations**: AI 기반 추천 시스템
- **Search**: 실시간 검색 및 자동완성
- **GenreDropdown**: 장르별 필터링
- **Hero**: 메인 배너 및 히어로 섹션

### 3. 서비스 레이어
- **API 통합**: 백엔드 API와 완전 연동
- **검색 시스템**: 실시간 검색 및 필터링
- **추천 엔진**: 개인화된 콘텐츠 추천
- **인증 시스템**: Firebase 기반 사용자 인증
- **캐시 관리**: API 응답 캐싱 및 최적화

## 기술 스택

- **Frontend**: React 18, Vite
- **Routing**: React Router v6
- **Styling**: CSS Modules, CSS Variables
- **Authentication**: Firebase Auth
- **API**: RESTful API with caching
- **Build Tool**: Vite
- **Package Manager**: npm

## 환경 설정

### 1. 환경변수 설정
`.env` 파일을 생성하고 다음 내용을 설정:

```env
# API 설정
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=10000

# Firebase 설정
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# 기타 설정
VITE_APP_NAME=WellList
VITE_CACHE_DURATION=300000
```

### 2. 패키지 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 주요 특징

### 1. SPA 아키텍처
- React Router를 통한 SPA 네비게이션
- 페이지 간 부드러운 전환
- 브라우저 히스토리 관리

### 2. 반응형 디자인
- 모바일 우선 설계
- 다양한 화면 크기 지원
- 터치/마우스 인터랙션 최적화

### 3. 성능 최적화
- API 응답 캐싱
- 이미지 레이지 로딩
- 컴포넌트 코드 분할

### 4. 사용자 경험
- 직관적인 네비게이션
- 실시간 검색 및 필터링
- 개인화된 추천 시스템

## API 연동

### 추천 API
```javascript
// 영화 추천 가져오기
const movieRecommendations = await recommendationService.getRecommendations({
  isMovie: true,
  limit: 20
});

// 드라마 추천 가져오기  
const dramaRecommendations = await recommendationService.getRecommendations({
  isDrama: true,
  limit: 20
});
```

### 검색 API
```javascript
// 콘텐츠 검색
const searchResults = await searchAPI.searchContent({
  query: '검색어',
  contentType: 'movie', // 'movie' | 'drama' | 'all'
  limit: 50
});
```

## 보안 설정

### Firebase 인증
- 환경변수를 통한 API 키 관리
- `.gitignore`에 민감한 정보 제외
- 프로덕션/개발 환경 분리

### API 보안
- CORS 설정
- API 타임아웃 관리
- 에러 핸들링

## 개발 가이드

### 컴포넌트 작성 규칙
1. 각 컴포넌트는 독립된 폴더에 위치
2. CSS 파일은 컴포넌트와 동일한 폴더에 위치
3. PropTypes 또는 TypeScript 타입 정의
4. 재사용 가능하도록 설계

### 서비스 레이어 사용
1. API 호출은 services 폴더의 함수 사용
2. 비즈니스 로직은 컴포넌트에서 분리
3. 에러 처리 및 로딩 상태 관리

### 스타일링 가이드
1. CSS Variables 사용으로 일관성 유지
2. 반응형 디자인 적용
3. 접근성(a11y) 고려

## 프로젝트 현황

### 완료된 기능
- ✅ React SPA 구조 완전 이식
- ✅ 모든 페이지 컴포넌트 구현
- ✅ 추천/검색/슬라이더 시스템 통합
- ✅ Firebase 인증 시스템
- ✅ API 연동 및 캐싱
- ✅ 반응형 UI/UX
- ✅ 환경변수 보안 설정

### 향후 개선 사항
- 성능 최적화 (React.memo, useMemo)
- 에러 바운더리 및 전역 에러 처리
- 단위/E2E 테스트 코드
- 접근성(ARIA) 개선
- 상태관리 라이브러리 도입
- PWA 기능 추가
                <AppRoutes />
                <Toaster />
              </div>
            </Router>
          </ContentProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
```

### 📁 샘플 데이터 분리
기존 App.jsx에 하드코딩된 샘플 데이터를 별도 파일로 분리:

**`src/assets/data/sampleContent.js`**
```javascript
/**
 * 개발 및 테스트용 샘플 콘텐츠 데이터
 * API 연결 실패시 대체 데이터로 사용
 */
export const sampleMovies = [
  {
    idx: '1',
    asset_nm: '샘플 영화 1',
    genre: '액션, 모험',
    poster_path: 'https://placehold.co/300x450?text=Movie+1',
    rlse_year: 2025,
    rating: 8.5
  },
  {
    idx: '2',
    asset_nm: '샘플 영화 2',
    genre: '드라마, 로맨스',
    poster_path: 'https://placehold.co/300x450?text=Movie+2',
    rlse_year: 2024,
    rating: 7.8
  },
  // ... 추가 샘플 데이터
];

export const sampleDramas = [
  {
    idx: '101',
    asset_nm: '샘플 드라마 1',
    genre: '로맨스, 코미디',
    poster_path: 'https://placehold.co/300x450?text=Drama+1',
    rlse_year: 2025,
    rating: 9.2
  },
  // ... 추가 샘플 데이터
];

// 기본 샘플 데이터 (영화 + 드라마 혼합)
export const sampleContent = [...sampleMovies, ...sampleDramas];

// API 실패시 사용할 기본 대체 데이터
export const fallbackContent = {
  popular: sampleContent.slice(0, 10),
  recent: sampleContent.slice(5, 15),
  recommended: sampleContent.slice(10, 20)
};
```

## 3. 데이터베이스 연동 및 API 통신

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

#### 개선된 API 서비스 구조 (services/api/)

**`src/services/api/index.js` - API 서비스 진입점**
```javascript
// 모든 API 서비스를 중앙에서 관리
export { default as contentAPI } from './content';
export { default as searchAPI } from './search';
export { default as recommendationAPI } from './recommendation';
export { default as userAPI } from './user';
export { baseAPI } from './base';
```

**`src/services/api/base.js` - 기본 API 설정**
```javascript
import { API_ENDPOINTS, HTTP_STATUS } from '../../utils/constants/api';

// 환경별 API URL 설정
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }
  return window.location.hostname === 'localhost' ? '' : 'http://fastapi:8000';
};

const BASE_URL = getBaseURL();

/**
 * 기본 fetch 래퍼 함수 (개선됨)
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise<any>} 응답 데이터
 */
export const baseAPI = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // 인증 토큰이 필요한 경우
      ...(options.auth && { 
        'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
      }),
    },
    timeout: 10000, // 10초 타임아웃
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);
    
    const response = await fetch(url, {
      ...mergedOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new APIError(
        `API 호출 실패: ${response.status} ${response.statusText}`,
        response.status,
        endpoint
      );
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new APIError('요청 시간 초과', HTTP_STATUS.REQUEST_TIMEOUT, endpoint);
    }
    
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 커스텀 API 에러 클래스
 */
export class APIError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.endpoint = endpoint;
  }
}
```

**`src/services/api/recommendation.js` - 추천 API (개선됨)**
```javascript
import { baseAPI } from './base';
import { sampleContent, fallbackContent } from '../../assets/data/sampleContent';
import { normalizeContentData } from '../../utils/helpers/content';

/**
 * 추천 API 서비스
 * 실패시 자동으로 샘플 데이터로 대체
 */
const recommendationAPI = {
  /**
   * 테스트 추천 목록 가져오기 (개선됨)
   */
  async getTestRecommendations(n = 10) {
    try {
      const response = await baseAPI(`/recommendation/test?n=${n}`);
      return {
        success: true,
        data: normalizeContentData(response.items || response.result || []),
        source: 'api'
      };
    } catch (error) {
      console.warn('테스트 추천 API 실패, 샘플 데이터 사용:', error);
      return {
        success: false,
        data: normalizeContentData(fallbackContent.popular.slice(0, n)),
        source: 'fallback',
        error: error.message
      };
    }
  },

  /**
   * 인기 콘텐츠 가져오기
   */
  async getPopular(limit = 10) {
    try {
      const response = await baseAPI(`/recommendation/top?n=${limit}`);
      return {
        success: true,
        data: normalizeContentData(response.items || response.result || []),
        source: 'api'
      };
    } catch (error) {
      console.warn('인기 콘텐츠 API 실패, 샘플 데이터 사용:', error);
      return {
        success: false,
        data: normalizeContentData(fallbackContent.popular.slice(0, limit)),
        source: 'fallback',
        error: error.message
      };
    }
  },

  /**
   * 감정 기반 추천
   */
  async getEmotionBased(emotion = 'happy', limit = 10) {
    try {
      const response = await baseAPI(`/recommendation/emotion?emotion=${emotion}&n=${limit}`);
      return {
        success: true,
        data: normalizeContentData(response.items || response.result || []),
        source: 'api'
      };
    } catch (error) {
      console.warn('감정 기반 추천 API 실패, 샘플 데이터 사용:', error);
      return {
        success: false,
        data: normalizeContentData(fallbackContent.recommended.slice(0, limit)),
        source: 'fallback',
        error: error.message
      };
    }
  },

  /**
   * 유사 콘텐츠 추천
   */
  async getSimilar(contentId, limit = 10) {
    try {
      const response = await baseAPI(`/recommendation/similar/${contentId}?n=${limit}`);
      return {
        success: true,
        data: normalizeContentData(response.items || response.result || []),
        source: 'api'
      };
    } catch (error) {
      console.warn('유사 콘텐츠 API 실패, 샘플 데이터 사용:', error);
      return {
        success: false,
        data: normalizeContentData(fallbackContent.recommended.slice(0, limit)),
        source: 'fallback',
        error: error.message
      };
    }
  }
};

export default recommendationAPI;
```

#### 개선된 커스텀 Hook (hooks/api/)

**`src/hooks/api/useApi.js` - 범용 API 훅**
```javascript
import { useState, useEffect, useCallback } from 'react';
import { APIError } from '../../services/api/base';

/**
 * 범용 API 요청 훅 (개선됨)
 * @param {Function} apiFunction - API 함수
 * @param {Array} dependencies - 의존성 배열
 * @param {Object} options - 옵션
 * @returns {Object} { data, loading, error, refetch, reset }
 */
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const {
    immediate = true,
    onSuccess,
    onError,
    retryCount = 3,
    retryDelay = 1000,
    cacheTTL = 5 * 60 * 1000, // 5분 캐시
  } = options;

  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null,
    retryAttempt: 0,
    lastFetch: null,
    source: null // 'api', 'fallback', 'cache'
  });

  // 캐시 키 생성
  const cacheKey = apiFunction.name + JSON.stringify(dependencies);

  // 캐시에서 데이터 확인
  const getCachedData = useCallback(() => {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTTL) {
        return data;
      }
    }
    return null;
  }, [cacheKey, cacheTTL]);

  // 캐시에 데이터 저장
  const setCachedData = useCallback((data) => {
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }, [cacheKey]);

  // API 호출 함수
  const fetchData = useCallback(async (attempt = 0) => {
    // 캐시 확인
    const cachedData = getCachedData();
    if (cachedData && attempt === 0) {
      setState(prev => ({
        ...prev,
        data: cachedData,
        loading: false,
        error: null,
        source: 'cache'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      retryAttempt: attempt
    }));

    try {
      const result = await apiFunction(...dependencies);
      
      setState(prev => ({
        ...prev,
        data: result.data || result,
        loading: false,
        error: null,
        lastFetch: Date.now(),
        source: result.source || 'api'
      }));

      // 성공시 캐시 저장
      if (result.success !== false) {
        setCachedData(result.data || result);
      }

      // 성공 콜백 실행
      if (onSuccess) {
        onSuccess(result.data || result);
      }

    } catch (error) {
      const isLastAttempt = attempt >= retryCount;
      
      if (!isLastAttempt && error instanceof APIError) {
        // 재시도
        setTimeout(() => {
          fetchData(attempt + 1);
        }, retryDelay * Math.pow(2, attempt)); // 지수 백오프
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || '데이터를 가져오는 중 오류가 발생했습니다.',
        retryAttempt: attempt
      }));

      // 에러 콜백 실행
      if (onError) {
        onError(error);
      }
    }
  }, [apiFunction, dependencies, onSuccess, onError, retryCount, retryDelay, getCachedData, setCachedData]);

  // 데이터 다시 가져오기
  const refetch = useCallback(() => {
    fetchData(0);
  }, [fetchData]);

  // 상태 리셋
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retryAttempt: 0,
      lastFetch: null,
      source: null
    });
  }, []);

  // 초기 로드
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, dependencies);

  return {
    ...state,
    refetch,
    reset,
    isStale: state.lastFetch && (Date.now() - state.lastFetch > cacheTTL)
  };
};
```

**`src/hooks/api/useContent.js` - 콘텐츠 API 전용 훅**
```javascript
import { useApi } from './useApi';
import { contentAPI } from '../../services/api';

/**
 * 콘텐츠 목록을 가져오는 훅
 */
export const useContentList = (category = 'all', options = {}) => {
  return useApi(
    contentAPI.getList,
    [category, options.limit, options.offset],
    {
      cacheTTL: 10 * 60 * 1000, // 10분 캐시
      ...options
    }
  );
};

/**
 * 콘텐츠 상세 정보를 가져오는 훅
 */
export const useContentDetails = (contentId, options = {}) => {
  return useApi(
    contentAPI.getDetails,
    [contentId],
    {
      immediate: !!contentId,
      cacheTTL: 30 * 60 * 1000, // 30분 캐시
      ...options
    }
  );
};

/**
 * 콘텐츠 검색 훅
 */
export const useContentSearch = (query, options = {}) => {
  return useApi(
    contentAPI.search,
    [query, options.filters],
    {
      immediate: !!query && query.length > 2,
      cacheTTL: 5 * 60 * 1000, // 5분 캐시
      ...options
    }
  );
};
```

## 4. 개선된 컴포넌트 설계 및 데이터 흐름

### 🏗️ 컴포넌트 아키텍처 원칙

#### 1. **컴포넌트 분류 체계**
- **`common/`**: 범용 UI 컴포넌트 (Button, Card, Modal 등)
- **`layout/`**: 레이아웃 관련 컴포넌트 (Header, Footer, Sidebar 등)
- **`feature/`**: 특정 기능에 특화된 컴포넌트 (WatchList, Rating 등)
- **`content/`**: 콘텐츠 표시 관련 컴포넌트
- **`search/`**: 검색 기능 관련 컴포넌트

#### 2. **컴포넌트 폴더 구조 표준**
```
ComponentName/
├── ComponentName.jsx      # 메인 컴포넌트
├── ComponentName.css      # 스타일 파일
├── ComponentName.test.js  # 테스트 파일
├── index.js              # export 파일 (선택적)
└── hooks/                # 컴포넌트 전용 훅 (필요시)
    └── useComponentName.js
```

### 🔄 데이터 흐름 아키텍처

#### 1. **Context + Custom Hooks 패턴**
```javascript
// AuthContext.js
import { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await authAPI.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
    }
  };

  const value = {
    ...state,
    login,
    logout: () => dispatch({ type: 'LOGOUT' }),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### 2. **API 상태 관리 패턴**
```javascript
// useRecommendations.js
import { useState, useEffect } from 'react';
import { recommendationAPI } from '../../services/api';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState({
    popular: { data: [], loading: true, error: null },
    recent: { data: [], loading: true, error: null },
    personalized: { data: [], loading: true, error: null }
  });

  const fetchRecommendations = async () => {
    const fetchCategory = async (category, apiCall) => {
      try {
        const result = await apiCall();
        setRecommendations(prev => ({
          ...prev,
          [category]: { data: result.data, loading: false, error: null }
        }));
      } catch (error) {
        setRecommendations(prev => ({
          ...prev,
          [category]: { data: [], loading: false, error: error.message }
        }));
      }
    };

    // 병렬 요청 처리
    await Promise.allSettled([
      fetchCategory('popular', () => recommendationAPI.getPopular(10)),
      fetchCategory('recent', () => recommendationAPI.getRecent(10)),
      fetchCategory('personalized', () => recommendationAPI.getPersonalized(10))
    ]);
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return {
    recommendations,
    refetch: fetchRecommendations
  };
};
```

#### 개선된 레이아웃 컴포넌트 (MainLayout/MainLayout.jsx)
```jsx
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import LoadingSpinner from '../../common/Loading/LoadingSpinner';
import { useAuth } from '../../../hooks/auth/useAuth';
import { useTheme } from '../../../hooks/ui/useTheme';
import './MainLayout.css';

/**
 * 메인 레이아웃 컴포넌트 (개선됨)
 * - 인증 상태 관리
 * - 테마 적용
 * - 로딩 상태 처리
 * - 에러 바운더리 포함
 */
const MainLayout = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`main-layout theme-${theme}`} data-testid="main-layout">
      <Header 
        user={user}
        isAuthenticated={isAuthenticated}
        onThemeToggle={toggleTheme}
        currentTheme={theme}
      />
      
      <main className="main-content" role="main">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
```

#### 개선된 헤더 컴포넌트 (Header/Header.jsx)
```jsx
import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../../search/SearchBar/SearchBar';
import UserMenu from '../../user/UserMenu/UserMenu';
import Navigation from '../Navigation/Navigation';
import { useClickOutside } from '../../../hooks/utils/useClickOutside';
import { ROUTES } from '../../../utils/constants/routes';
import './Header.css';

/**
 * 헤더 컴포넌트 (개선됨)
 * - 반응형 네비게이션
 * - 검색 기능 통합
 * - 사용자 메뉴 관리
 * - 접근성 개선
 */
const Header = ({ user, isAuthenticated, onThemeToggle, currentTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  // 모바일 메뉴 외부 클릭시 닫기
  useClickOutside(mobileMenuRef, () => setIsMobileMenuOpen(false));

  // 검색 처리
  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}`);
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
    }
  };

  // 로고 클릭 처리
  const handleLogoClick = () => {
    navigate(ROUTES.HOME);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        {/* 로고 */}
        <div className="header-logo">
          <Link 
            to={ROUTES.HOME}
            onClick={handleLogoClick}
            aria-label="홈으로 이동"
          >
            <img src="/images/logo.svg" alt="WellList" />
          </Link>
        </div>

        {/* 데스크탑 네비게이션 */}
        <div className="header-nav-desktop">
          <Navigation 
            currentPath={location.pathname}
            isMobile={false}
          />
        </div>

        {/* 검색바 */}
        <div className={`header-search ${isSearchFocused ? 'focused' : ''}`}>
          <SearchBar
            onSearch={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="제목, 배우, 감독, 장르 검색"
          />
        </div>

        {/* 사용자 메뉴 */}
        <div className="header-user">
          <UserMenu
            user={user}
            isAuthenticated={isAuthenticated}
            onThemeToggle={onThemeToggle}
            currentTheme={currentTheme}
          />
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="header-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="메뉴 열기/닫기"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div 
          className="header-mobile-menu"
          ref={mobileMenuRef}
          role="navigation"
          aria-label="모바일 메뉴"
        >
          <Navigation 
            currentPath={location.pathname}
            isMobile={true}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
```

## 5. 개선된 페이지 컴포넌트 및 기능 구현

### 🏠 홈페이지 컴포넌트 (pages/home/HomePage.jsx)

**개선 사항:**
- 커스텀 훅을 통한 데이터 관리
- 에러 바운더리 및 로딩 상태 개선
- 성능 최적화 (React.memo, useMemo)
- 샘플 데이터 분리

```jsx
import { useState, useEffect, useMemo } from 'react';
import Hero from '../../components/hero/Hero/Hero';
import ContentSection from '../../components/content/ContentSection/ContentSection';
import { useRecommendations } from '../../hooks/api/useRecommendation';
import { useAuth } from '../../hooks/auth/useAuth';
import LoadingSpinner from '../../components/common/Loading/LoadingSpinner';
import ErrorMessage from '../../components/common/Error/ErrorMessage';
import { sampleContent } from '../../assets/data/sampleContent';
import './HomePage.css';

/**
 * 홈페이지 컴포넌트 (개선됨)
 * - 커스텀 훅을 통한 데이터 관리
 * - 사용자별 개인화 콘텐츠
 * - 로딩 및 에러 상태 개선
 */
const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    recommendations,
    loading: recommendationsLoading,
    error: recommendationsError,
    refetch
  } = useRecommendations();

  const [heroContent, setHeroContent] = useState(null);

  // 히어로 콘텐츠 선택 (추천 콘텐츠 중 첫 번째 또는 샘플)
  const selectedHeroContent = useMemo(() => {
    if (recommendations.popular?.data?.length > 0) {
      return recommendations.popular.data[0];
    }
    return sampleContent[0] || null;
  }, [recommendations.popular?.data]);

  // 콘텐츠 섹션 데이터 구성
  const contentSections = useMemo(() => [
    {
      id: 'popular',
      title: '오늘의 인기 콘텐츠',
      data: recommendations.popular?.data || [],
      loading: recommendations.popular?.loading || false,
      error: recommendations.popular?.error || null,
      priority: 'high'
    },
    {
      id: 'recent',
      title: '최근 업데이트',
      data: recommendations.recent?.data || [],
      loading: recommendations.recent?.loading || false,
      error: recommendations.recent?.error || null,
      priority: 'medium'
    },
    ...(isAuthenticated ? [{
      id: 'personalized',
      title: `${user?.name || '회원'}님을 위한 추천`,
      data: recommendations.personalized?.data || [],
      loading: recommendations.personalized?.loading || false,
      error: recommendations.personalized?.error || null,
      priority: 'high'
    }] : []),
    {
      id: 'trending',
      title: '지금 뜨는 콘텐츠',
      data: recommendations.trending?.data || [],
      loading: recommendations.trending?.loading || false,
      error: recommendations.trending?.error || null,
      priority: 'low'
    }
  ], [recommendations, isAuthenticated, user]);

  // 전체 로딩 상태
  const isInitialLoading = contentSections.every(section => section.loading);

  // 전체 에러 처리
  if (recommendationsError && !recommendations.popular?.data?.length) {
    return (
      <div className="home-page">
        <ErrorMessage 
          message="콘텐츠를 불러오는 중 문제가 발생했습니다."
          onRetry={refetch}
          showRetryButton
        />
      </div>
    );
  }

  return (
    <div className="home-page" data-testid="home-page">
      {/* 히어로 섹션 */}
      <Hero 
        content={selectedHeroContent}
        isLoading={!selectedHeroContent}
        onPlayClick={(content) => {
          console.log('재생:', content);
          // 재생 로직 구현
        }}
        onAddToListClick={(content) => {
          console.log('찜하기:', content);
          // 찜하기 로직 구현
        }}
      />

      {/* 콘텐츠 섹션들 */}
      <div className="content-sections">
        {isInitialLoading ? (
          <div className="home-loading">
            <LoadingSpinner size="large" />
            <p>추천 콘텐츠를 불러오는 중...</p>
          </div>
        ) : (
          contentSections.map((section) => (
            <ContentSection
              key={section.id}
              id={section.id}
              title={section.title}
              items={section.data}
              isLoading={section.loading}
              error={section.error}
              priority={section.priority}
              onItemClick={(item) => {
                // 콘텐츠 상세 페이지로 이동
                window.location.href = `/content/${item.idx}`;
              }}
              onSectionError={(error) => {
                console.error(`${section.title} 섹션 오류:`, error);
              }}
            />
          ))
        )}
      </div>

      {/* 페이지 메타데이터 */}
      <div className="home-metadata">
        <p className="last-updated">
          마지막 업데이트: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
```

### 🔍 콘텐츠 상세 페이지 (pages/content/ContentDetailsPage.jsx)

```jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContentDetails } from '../../hooks/api/useContent';
import { useAuth } from '../../hooks/auth/useAuth';
import { useWatchList } from '../../hooks/feature/useWatchList';
import ContentHeader from '../../components/content/ContentHeader/ContentHeader';
import ContentInfo from '../../components/content/ContentInfo/ContentInfo';
import ContentActions from '../../components/content/ContentActions/ContentActions';
import RelatedContent from '../../components/content/RelatedContent/RelatedContent';
import LoadingSpinner from '../../components/common/Loading/LoadingSpinner';
import ErrorMessage from '../../components/common/Error/ErrorMessage';
import { ROUTES } from '../../utils/constants/routes';
import './ContentDetailsPage.css';

/**
 * 콘텐츠 상세 페이지 컴포넌트 (개선됨)
 */
const ContentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const {
    data: content,
    loading,
    error,
    refetch
  } = useContentDetails(id);

  const {
    isInWatchList,
    addToWatchList,
    removeFromWatchList,
    loading: watchListLoading
  } = useWatchList();

  // 관련 콘텐츠 상태
  const [relatedContent, setRelatedContent] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  // 콘텐츠가 없는 경우 404 처리
  useEffect(() => {
    if (!loading && !content && !error) {
      navigate(ROUTES.NOT_FOUND, { replace: true });
    }
  }, [loading, content, error, navigate]);

  // 관련 콘텐츠 로드
  useEffect(() => {
    if (content?.idx) {
      loadRelatedContent(content.idx);
    }
  }, [content?.idx]);

  const loadRelatedContent = async (contentId) => {
    setRelatedLoading(true);
    try {
      const response = await recommendationAPI.getSimilar(contentId, 12);
      setRelatedContent(response.data || []);
    } catch (err) {
      console.error('관련 콘텐츠 로드 실패:', err);
    } finally {
      setRelatedLoading(false);
    }
  };

  // 찜하기/해제 처리
  const handleWatchListToggle = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      if (isInWatchList(content.idx)) {
        await removeFromWatchList(content.idx);
      } else {
        await addToWatchList(content);
      }
    } catch (error) {
      console.error('찜하기 처리 실패:', error);
    }
  };

  // 재생 처리
  const handlePlay = () => {
    console.log('재생:', content);
    // 재생 로직 구현
  };

  // 공유 처리
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.asset_nm,
          text: content.synopsis || `${content.asset_nm} - WellList에서 확인하세요`,
          url: window.location.href
        });
      } catch (err) {
        console.log('공유 취소됨');
      }
    } else {
      // 폴백: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      // 토스트 메시지 표시
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="content-details-loading">
        <LoadingSpinner size="large" />
        <p>콘텐츠 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="content-details-error">
        <ErrorMessage 
          message="콘텐츠 정보를 불러올 수 없습니다."
          onRetry={refetch}
          showRetryButton
        />
      </div>
    );
  }

  // 콘텐츠가 없는 경우
  if (!content) {
    return null;
  }

  return (
    <div className="content-details-page" data-testid="content-details-page">
      {/* 콘텐츠 헤더 (배경 이미지 포함) */}
      <ContentHeader 
        content={content}
        onBackClick={() => navigate(-1)}
      />

      {/* 콘텐츠 메인 정보 */}
      <div className="content-main">
        <ContentInfo content={content} />
        
        <ContentActions
          content={content}
          isInWatchList={isInWatchList(content.idx)}
          onPlay={handlePlay}
          onWatchListToggle={handleWatchListToggle}
          onShare={handleShare}
          watchListLoading={watchListLoading}
          isAuthenticated={isAuthenticated}
        />
      </div>

      {/* 관련 콘텐츠 */}
      <RelatedContent
        items={relatedContent}
        loading={relatedLoading}
        title="비슷한 콘텐츠"
        onItemClick={(item) => navigate(`/content/${item.idx}`)}
      />
    </div>
  );
};

export default ContentDetailsPage;
```

## 6. 개선된 재사용 컴포넌트 및 공통 컴포넌트

### 🎚️ 슬라이더 컴포넌트 (components/slider/Slider/Slider.jsx)

**개선 사항:**
- TypeScript 지원 (JSDoc으로 타입 힌트)
- 접근성 개선 (ARIA 속성, 키보드 네비게이션)
- 성능 최적화 (가상화, 지연 로딩)
- 터치/드래그 지원

```jsx
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../../../hooks/utils/useIntersectionObserver';
import { useKeyboardNavigation } from '../../../hooks/utils/useKeyboardNavigation';
import SliderArrow from '../SliderArrow/SliderArrow';
import ContentCard from '../../content/ContentCard/ContentCard';
import LoadingSpinner from '../../common/Loading/LoadingSpinner';
import ErrorMessage from '../../common/Error/ErrorMessage';
import './Slider.css';

/**
 * 개선된 콘텐츠 슬라이더 컴포넌트
 * @param {Object} props
 * @param {Array} props.items - 표시할 콘텐츠 아이템 배열
 * @param {string} props.title - 슬라이더 제목
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {string} props.sliderId - 고유 슬라이더 ID
 * @param {Function} props.onItemClick - 아이템 클릭 핸들러
 * @param {Function} props.onError - 에러 핸들러
 * @param {string} props.priority - 로딩 우선순위 ('high', 'medium', 'low')
 */
const Slider = ({
  items = [],
  title = '',
  isLoading = false,
  error = null,
  sliderId = 'slider',
  onItemClick,
  onError,
  priority = 'medium',
  className = '',
  showDots = false,
  autoPlay = false,
  autoPlayInterval = 5000
}) => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // 교차 관찰자를 통한 지연 로딩
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // 키보드 네비게이션
  useKeyboardNavigation(sliderRef, {
    onArrowLeft: () => scroll('left'),
    onArrowRight: () => scroll('right'),
    onHome: () => scrollToIndex(0),
    onEnd: () => scrollToIndex(items.length - 1)
  });

  // 슬라이더 아이템 계산
  const visibleItemsCount = useMemo(() => {
    if (typeof window === 'undefined') return 5;
    const width = window.innerWidth;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 5;
  }, []);

  const maxIndex = Math.max(0, items.length - visibleItemsCount);

  // 스크롤 위치 업데이트
  const updateScrollPosition = useCallback(() => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const itemWidth = clientWidth / visibleItemsCount;
    const newIndex = Math.round(scrollLeft / itemWidth);

    setCurrentIndex(newIndex);
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, [visibleItemsCount]);

  // 슬라이더 스크롤 함수
  const scroll = useCallback((direction) => {
    if (!sliderRef.current) return;

    const { clientWidth } = sliderRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
    
    sliderRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  // 특정 인덱스로 스크롤
  const scrollToIndex = useCallback((index) => {
    if (!sliderRef.current) return;

    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    const { clientWidth } = sliderRef.current;
    const itemWidth = clientWidth / visibleItemsCount;
    
    sliderRef.current.scrollTo({
      left: clampedIndex * itemWidth,
      behavior: 'smooth'
    });
  }, [maxIndex, visibleItemsCount]);

  // 드래그 시작
  const handleDragStart = useCallback((e) => {
    if (!sliderRef.current) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.pageX || e.touches?.[0]?.pageX || 0,
      scrollLeft: sliderRef.current.scrollLeft
    });
  }, []);

  // 드래그 중
  const handleDragMove = useCallback((e) => {
    if (!isDragging || !sliderRef.current) return;
    
    e.preventDefault();
    const x = e.pageX || e.touches?.[0]?.pageX || 0;
    const walkX = (x - dragStart.x) * 2;
    sliderRef.current.scrollLeft = dragStart.scrollLeft - walkX;
  }, [isDragging, dragStart]);

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 자동 재생
  useEffect(() => {
    if (!autoPlay || isDragging || items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev >= maxIndex ? 0 : prev + 1;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isDragging, items.length, maxIndex, scrollToIndex]);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener('scroll', updateScrollPosition);
    return () => slider.removeEventListener('scroll', updateScrollPosition);
  }, [updateScrollPosition]);

  // 에러 처리
  if (error) {
    return (
      <div className={`slider-container error ${className}`} id={sliderId}>
        {title && <h2 className="slider-title">{title}</h2>}
        <ErrorMessage 
          message={error}
          onRetry={onError}
          showRetryButton={!!onError}
        />
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`slider-container loading ${className}`} id={sliderId}>
        {title && <h2 className="slider-title">{title}</h2>}
        <div className="slider-loading">
          <LoadingSpinner />
          <p>콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 빈 상태
  if (!items || items.length === 0) {
    return (
      <div className={`slider-container empty ${className}`} id={sliderId}>
        {title && <h2 className="slider-title">{title}</h2>}
        <div className="slider-empty">
          <p>표시할 콘텐츠가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`slider-container ${className}`} 
      id={sliderId}
      ref={containerRef}
      data-testid={`slider-${sliderId}`}
    >
      {title && (
        <div className="slider-header">
          <h2 className="slider-title">{title}</h2>
          {items.length > visibleItemsCount && (
            <div className="slider-info">
              <span className="slider-count">
                {currentIndex + 1}-{Math.min(currentIndex + visibleItemsCount, items.length)} / {items.length}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="slider-wrapper">
        {/* 왼쪽 화살표 */}
        {showLeftArrow && (
          <SliderArrow
            direction="left"
            onClick={() => scroll('left')}
            disabled={!showLeftArrow}
            aria-label="이전 콘텐츠 보기"
          />
        )}

        {/* 슬라이더 */}
        <div
          className={`slider ${isDragging ? 'dragging' : ''}`}
          ref={sliderRef}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          role="listbox"
          aria-label={title || '콘텐츠 슬라이더'}
          tabIndex={0}
        >
          {isVisible && items.map((item, index) => (
            <div
              key={item.idx || index}
              className={`slider-item ${focusedIndex === index ? 'focused' : ''}`}
              role="option"
              aria-selected={focusedIndex === index}
              tabIndex={focusedIndex === index ? 0 : -1}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
            >
              <ContentCard
                content={item}
                priority={priority}
                onClick={() => onItemClick?.(item)}
                onError={(error) => onError?.(error)}
                lazy={index > visibleItemsCount}
              />
            </div>
          ))}
        </div>

        {/* 오른쪽 화살표 */}
        {showRightArrow && (
          <SliderArrow
            direction="right"
            onClick={() => scroll('right')}
            disabled={!showRightArrow}
            aria-label="다음 콘텐츠 보기"
          />
        )}
      </div>

      {/* 도트 네비게이션 */}
      {showDots && items.length > visibleItemsCount && (
        <div className="slider-dots" role="tablist">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              className={`slider-dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => scrollToIndex(index)}
              role="tab"
              aria-selected={currentIndex === index}
              aria-label={`${index + 1}번째 그룹으로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
```

### 📋 ContentSection 컴포넌트 (개선됨)

```jsx
import { memo } from 'react';
import Slider from '../slider/Slider/Slider';
import ErrorMessage from '../common/Error/ErrorMessage';
import { trackEvent } from '../../utils/analytics';
import './ContentSection.css';

/**
 * 콘텐츠 섹션 컴포넌트 (개선됨)
 * - 에러 상태 개선
 * - 성능 최적화 (React.memo)
 * - 분석 이벤트 트래킹
 */
const ContentSection = memo(({
  id = '',
  title,
  items = [],
  isLoading = false,
  error = null,
  priority = 'medium',
  onItemClick,
  onSectionError,
  className = '',
  showViewAll = false,
  viewAllLink = '',
}) => {
  const sectionId = id || `section-${title?.toLowerCase().replace(/\s+/g, '-')}`;

  // 아이템 클릭 처리
  const handleItemClick = (item) => {
    // 분석 이벤트 추적
    trackEvent('content_click', {
      section: title,
      content_id: item.idx,
      content_title: item.asset_nm,
      position: items.findIndex(i => i.idx === item.idx)
    });

    onItemClick?.(item);
  };

  // 에러 재시도 처리
  const handleRetry = () => {
    trackEvent('section_retry', { section: title });
    onSectionError?.(null);
  };

  return (
    <section 
      className={`content-section ${className}`} 
      id={sectionId}
      data-testid={`content-section-${sectionId}`}
    >
      {error ? (
        <div className="content-section-error">
          <div className="section-header">
            <h2 className="section-title">{title}</h2>
          </div>
          <ErrorMessage 
            message={error}
            onRetry={handleRetry}
            showRetryButton
            compact
          />
        </div>
      ) : (
        <>
          {showViewAll && viewAllLink && (
            <div className="section-header">
              <h2 className="section-title">{title}</h2>
              <Link 
                to={viewAllLink}
                className="view-all-link"
                onClick={() => trackEvent('view_all_click', { section: title })}
              >
                전체보기
              </Link>
            </div>
          )}
          
          <Slider
            title={!showViewAll ? title : ''}
            items={items}
            isLoading={isLoading}
            error={error}
            sliderId={`${sectionId}-slider`}
            onItemClick={handleItemClick}
            onError={onSectionError}
            priority={priority}
            autoPlay={priority === 'high'}
            showDots={items.length > 10}
          />
        </>
      )}
    </section>
  );
});

ContentSection.displayName = 'ContentSection';

export default ContentSection;
```

### 🎯 ContentCard 컴포넌트 (새로 추가)

```jsx
import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../common/LazyImage/LazyImage';
import { formatReleaseYear, formatGenre } from '../../utils/format/content';
import { ROUTES } from '../../utils/constants/routes';
import './ContentCard.css';

/**
 * 콘텐츠 카드 컴포넌트
 * - 지연 로딩 이미지
 * - 호버 효과
 * - 접근성 개선
 */
const ContentCard = memo(({
  content,
  priority = 'medium',
  onClick,
  onError,
  lazy = true,
  showMetadata = true,
  size = 'medium'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(content);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.('이미지 로드 실패');
  };

  const cardLink = `${ROUTES.CONTENT}/${content.idx}`;
  
  return (
    <div 
      className={`content-card content-card--${size}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`content-card-${content.idx}`}
    >
      <Link
        to={cardLink}
        className="content-card__link"
        onClick={handleClick}
        aria-label={`${content.asset_nm} 상세 정보 보기`}
      >
        <div className="content-card__image-container">
          <LazyImage
            src={content.poster_path}
            alt={content.asset_nm}
            fallbackSrc="/images/placeholder-poster.jpg"
            className="content-card__image"
            loading={lazy ? 'lazy' : priority === 'high' ? 'eager' : 'lazy'}
            onError={handleImageError}
          />
          
          {/* 호버 오버레이 */}
          {isHovered && (
            <div className="content-card__overlay">
              <div className="content-card__actions">
                <button 
                  className="content-card__play-btn"
                  aria-label={`${content.asset_nm} 재생`}
                >
                  ▶
                </button>
                <button 
                  className="content-card__wishlist-btn"
                  aria-label={`${content.asset_nm} 찜하기`}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        {showMetadata && (
          <div className="content-card__info">
            <h3 className="content-card__title" title={content.asset_nm}>
              {content.asset_nm}
            </h3>
            <div className="content-card__metadata">
              {content.rlse_year && (
                <span className="content-card__year">
                  {formatReleaseYear(content.rlse_year)}
                </span>
              )}
              {content.genre && (
                <span className="content-card__genre">
                  {formatGenre(content.genre)}
                </span>
              )}
              {content.rating && (
                <span className="content-card__rating">
                  ⭐ {content.rating}
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
    </div>
  );
});

ContentCard.displayName = 'ContentCard';

export default ContentCard;
```

### 🔧 공통 유틸리티 컴포넌트들

#### LazyImage 컴포넌트
```jsx
import { useState, useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/utils/useIntersectionObserver';

/**
 * 지연 로딩 이미지 컴포넌트
 */
export const LazyImage = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  className = '',
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(loading === 'eager' ? src : null);
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // 이미지가 보이면 로드 시작
  React.useEffect(() => {
    if (isVisible && !imageSrc && !imageError) {
      setImageSrc(src);
    }
  }, [isVisible, src, imageSrc, imageError]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    setImageSrc(fallbackSrc);
    onError?.();
  };

  return (
    <div ref={containerRef} className={`lazy-image-container ${className}`}>
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      {!isLoaded && !imageError && (
        <div className="lazy-image-placeholder">
          <div className="loading-spinner small" />
        </div>
      )}
    </div>
  );
};
```

#### LoadingSpinner 컴포넌트
```jsx
/**
 * 로딩 스피너 컴포넌트
 */
export const LoadingSpinner = ({ 
  size = 'medium', 
  className = '',
  message = '' 
}) => {
  const sizeClass = `loading-spinner--${size}`;
  
  return (
    <div className={`loading-spinner ${sizeClass} ${className}`}>
      <div className="spinner" />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};
```

#### ErrorMessage 컴포넌트
```jsx
/**
 * 에러 메시지 컴포넌트
 */
export const ErrorMessage = ({
  message,
  onRetry,
  showRetryButton = false,
  compact = false,
  className = ''
}) => {
  return (
    <div className={`error-message ${compact ? 'compact' : ''} ${className}`}>
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message}</p>
      {showRetryButton && onRetry && (
        <button 
          className="error-retry-btn"
          onClick={onRetry}
        >
          다시 시도
        </button>
      )}
    </div>
  );
};
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

## 7. 기존 HTML 페이지와의 통합

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

## 8. 성능 최적화 및 고려사항

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

## 9. 배포 및 환경 설정

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

## 10. 점진적 마이그레이션 전략

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

## 11. 유지보수 및 확장성

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

## 12. 폴더별 사용 가이드 (실무)

### 📄 `pages/` 폴더 사용법
```jsx
// pages/home/HomePage.jsx
import { useEffect } from 'react';
import { useContent } from '../../hooks/useContent';
import Layout from '../../components/layout/Layout';
import './HomePage.css';

const HomePage = () => {
  const { contents, loading, fetchRecommendations } = useContent();
  
  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <Layout>
      <div className="home-page">
        {/* 페이지 내용 */}
      </div>
    </Layout>
  );
};

export default HomePage;
```

### 🧩 `components/` 폴더 사용법
```jsx
// components/common/Button/Button.jsx
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  ...props 
}) => {
  return (
    <button 
      className={`btn btn--${variant} btn--${size}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### 🌐 `services/` 폴더 사용법
```jsx
// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

// services/recommendationService.js
import { apiClient } from './api';

export const recommendationService = {
  getRecommendations: (userId) => 
    apiClient.get(`/recommendations/${userId}`),
    
  getPersonalizedContent: (preferences) =>
    apiClient.post('/recommendations/personalized', preferences)
};
```

### 🪝 `hooks/` 폴더 사용법
```jsx
// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(setUser);
    setLoading(false);
    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    login: authService.login,
    logout: authService.logout,
    register: authService.register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 🗃️ `store/` 폴더 사용법
```jsx
// store/context/ContentContext.js
import { createContext, useContext, useReducer } from 'react';

const ContentContext = createContext();

const contentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONTENTS':
      return { ...state, contents: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_TO_FAVORITES':
      return { 
        ...state, 
        favorites: [...state.favorites, action.payload] 
      };
    default:
      return state;
  }
};

export const ContentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contentReducer, {
    contents: [],
    favorites: [],
    loading: false
  });

  return (
    <ContentContext.Provider value={{ state, dispatch }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
};
```

## 13. 개발 워크플로우 권장사항

### 🚀 새로운 기능 개발 순서

1. **서비스 레이어 먼저**
   ```javascript
   // 1단계: 기존 HTML을 React로 감싸기
   const LegacyWrapper = () => (
     <div dangerouslySetInnerHTML={{ __html: legacyHTML }} />
   );

   // 2단계: 부분적으로 React 컴포넌트로 교체
   const HybridComponent = () => (
     <div>
       <NewReactHeader />
       <div dangerouslySetInnerHTML={{ __html: legacyContent }} />
       <NewReactFooter />
     </div>
   );

   // 3단계: 완전한 React 컴포넌트로 변환
   const FullyMigratedComponent = () => (
     <Layout>
       <Header />
       <MainContent />
       <Footer />
     </Layout>
   );
   ```

2. **기존 vanilla JS 코드와의 연동**
   ```javascript
   // utils/legacyBridge.js
   export const integrateLegacyScript = (scriptId, initFunction) => {
     useEffect(() => {
       if (window[initFunction]) {
         window[initFunction]();
       }
       return () => {
         // 정리 로직
       };
     }, []);
   };
   ```

### 📋 코드 리뷰 체크리스트

- [ ] 컴포넌트가 올바른 폴더에 위치하는가?
- [ ] CSS 파일이 컴포넌트와 함께 관리되는가?
- [ ] 비즈니스 로직이 서비스/훅으로 분리되어 있는가?
- [ ] 재사용 가능한 컴포넌트인가?
- [ ] PropTypes 또는 TypeScript 타입이 정의되어 있는가?
- [ ] 접근성(a11y) 요구사항을 만족하는가?
- [ ] 반응형 디자인이 적용되어 있는가?
