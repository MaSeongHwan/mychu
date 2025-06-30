# VOD 추천 서비스 프론트엔드 (Vanilla JS)

## 1. 개선된 디렉토리 구조 (초심자 친화적)

### 🎯 **구조 개선 목표**
- **명확한 분리**: HTML, CSS, JS, 이미지를 명확히 분리
- **직관적 이해**: 폴더명만 봐도 역할을 알 수 있도록
- **재사용성**: 공통 컴포넌트를 쉽게 찾고 사용할 수 있도록
- **확장성**: 새로운 로그인 API(네이버, 카카오) 추가 시 쉽게 확장

```
client/
├── html/                    # 📄 모든 HTML 파일 (페이지별)
│   ├── index.html          # 메인 홈페이지
│   ├── login.html          # 로그인/회원가입 페이지
│   ├── main.html           # 사용자 대시보드
│   ├── contents.html       # 콘텐츠 상세 페이지
│   ├── search.html         # 검색 결과 페이지
│   ├── mylist.html         # 찜 목록 페이지
│   ├── movie.html          # 영화 페이지
│   ├── drama.html          # 드라마 페이지
│   ├── adult.html          # 성인 콘텐츠 페이지
│   └── rating.html         # 평점 페이지
│
├── css/                     # 🎨 모든 CSS 파일 (페이지별 + 공통)
│   ├── common/             # 공통 스타일
│   │   ├── reset.css       # CSS 초기화
│   │   ├── variables.css   # CSS 변수 (색상, 크기 등)
│   │   ├── layout.css      # 기본 레이아웃
│   │   └── responsive.css  # 반응형 스타일
│   ├── components/         # 컴포넌트별 스타일
│   │   ├── header.css      # 헤더 스타일
│   │   ├── footer.css      # 푸터 스타일
│   │   ├── slider.css      # 슬라이더 스타일
│   │   ├── card.css        # 콘텐츠 카드 스타일
│   │   ├── button.css      # 버튼 스타일
│   │   └── dropdown.css    # 드롭다운 스타일
│   └── pages/              # 페이지별 스타일
│       ├── index.css       # 메인 페이지
│       ├── login.css       # 로그인 페이지
│       ├── main.css        # 대시보드 페이지
│       ├── contents.css    # 콘텐츠 상세 페이지
│       ├── search.css      # 검색 페이지
│       ├── mylist.css      # 찜 목록 페이지
│       ├── movie.css       # 영화 페이지
│       └── drama.css       # 드라마 페이지
│
├── js/                      # ⚡ 모든 JavaScript 파일
│   ├── common/             # 공통 기능
│   │   ├── init.js         # 페이지 초기화
│   │   ├── utils.js        # 유틸리티 함수
│   │   └── constants.js    # 상수 정의
│   ├── components/         # UI 컴포넌트
│   │   ├── header.js       # 헤더 컴포넌트
│   │   ├── footer.js       # 푸터 컴포넌트
│   │   ├── slider.js       # 슬라이더 컴포넌트
│   │   ├── card.js         # 콘텐츠 카드 컴포넌트
│   │   ├── dropdown.js     # 드롭다운 컴포넌트
│   │   ├── search.js       # 검색 컴포넌트
│   │   └── user-menu.js    # 사용자 메뉴 컴포넌트
│   ├── pages/              # 페이지별 로직
│   │   ├── index.js        # 메인 페이지 로직
│   │   ├── login.js        # 로그인 페이지 로직
│   │   ├── main.js         # 대시보드 로직
│   │   ├── contents.js     # 콘텐츠 상세 로직
│   │   ├── search.js       # 검색 페이지 로직
│   │   ├── mylist.js       # 찜 목록 로직
│   │   ├── movie.js        # 영화 페이지 로직
│   │   └── drama.js        # 드라마 페이지 로직
│   └── api/                # API 통신 (서버 API만)
│       ├── config.js       # API 설정 (서버 URL 등)
│       ├── content.js      # 콘텐츠 관련 API
│       ├── recommendation.js # 추천 API
│       ├── search.js       # 검색 API
│       └── user.js         # 사용자 정보 API
│
├── auth/                    # 🔐 로그인/인증 전용 폴더
│   ├── firebase/           # Firebase 인증
│   │   ├── config.js       # Firebase 설정
│   │   ├── auth.js         # Firebase 인증 로직
│   │   └── user.js         # Firebase 사용자 관리
│   ├── naver/             # 네이버 로그인 (향후 추가)
│   │   ├── config.js       # 네이버 API 설정
│   │   ├── auth.js         # 네이버 로그인 로직
│   │   └── user.js         # 네이버 사용자 정보
│   ├── kakao/             # 카카오 로그인 (향후 추가)
│   │   ├── config.js       # 카카오 API 설정
│   │   ├── auth.js         # 카카오 로그인 로직
│   │   └── user.js         # 카카오 사용자 정보
│   └── auth-manager.js     # 통합 인증 관리자
│
├── images/                  # 🖼️ 모든 이미지 파일
│   ├── logos/              # 로고 이미지
│   │   ├── logo.png        # 메인 로고
│   │   ├── logo-white.png  # 흰색 로고
│   │   └── favicon.ico     # 파비콘
│   ├── icons/              # 아이콘 이미지
│   │   ├── search.png      # 검색 아이콘
│   │   ├── user.png        # 사용자 아이콘
│   │   ├── heart.png       # 찜하기 아이콘
│   │   └── play.png        # 재생 아이콘
│   ├── backgrounds/        # 배경 이미지
│   │   ├── main-bg.jpg     # 메인 배경
│   │   └── login-bg.jpg    # 로그인 배경
│   ├── placeholders/       # 플레이스홀더 이미지
│   │   ├── no-image.png    # 이미지 없음
│   │   └── loading.gif     # 로딩 이미지
│   └── content/            # 콘텐츠 관련 이미지
│       ├── posters/        # 포스터 이미지 (API에서 제공)
│       └── thumbnails/     # 썸네일 이미지
│
├── shared/                  # 🔗 공통 컴포넌트 (HTML + CSS + JS 세트)
│   ├── header/             # 헤더 컴포넌트
│   │   ├── header.html     # 헤더 HTML 구조
│   │   ├── header.css      # 헤더 전용 CSS
│   │   └── header.js       # 헤더 로직
│   ├── footer/             # 푸터 컴포넌트
│   │   ├── footer.html     # 푸터 HTML 구조
│   │   ├── footer.css      # 푸터 전용 CSS
│   │   └── footer.js       # 푸터 로직
│   ├── navigation/         # 네비게이션 컴포넌트
│   │   ├── nav.html        # 네비게이션 HTML
│   │   ├── nav.css         # 네비게이션 CSS
│   │   └── nav.js          # 네비게이션 로직
│   └── loader/             # 로딩 컴포넌트
│       ├── loader.html     # 로딩 HTML
│       ├── loader.css      # 로딩 CSS
│       └── loader.js       # 로딩 로직
│
├── config/                  # ⚙️ 설정 파일
│   ├── app.js              # 앱 전체 설정
│   ├── routes.js           # 페이지 라우팅 설정
│   └── environment.js      # 환경별 설정 (개발/운영)
│
└── package.json            # 프로젝트 설정
```

## 2. 구조의 장점 및 사용법

### 🎯 **이 구조의 장점**

#### 1. **초심자 친화적**
- 파일 타입별로 명확히 분리 (HTML, CSS, JS)
- 폴더명만 봐도 무엇인지 바로 알 수 있음
- 복잡한 중첩 구조 없음

#### 2. **유지보수 용이**
- 버그 발생시 해당 파일 타입 폴더에서 바로 찾을 수 있음
- 새로운 페이지 추가시 각 폴더에 파일만 추가하면 됨
- 로그인 API 변경시 `auth/` 폴더에서만 작업

#### 3. **확장성**
- 새로운 로그인 방식(네이버, 카카오) 추가가 매우 쉬움
- 새로운 컴포넌트 추가시 일관된 패턴 적용

### 📁 **폴더별 사용법**

#### HTML 폴더 (`html/`)
```
모든 HTML 파일은 여기에만!
├── index.html      ← 메인 홈페이지
├── login.html      ← 로그인 페이지  
└── main.html       ← 사용자 대시보드
```

#### CSS 폴더 (`css/`)
```
모든 스타일은 여기에만!
├── common/         ← 모든 페이지에서 쓰는 공통 CSS
├── components/     ← 컴포넌트별 CSS (헤더, 푸터 등)
└── pages/          ← 페이지별 CSS
```

#### JS 폴더 (`js/`)
```
모든 JavaScript는 여기에만!
├── common/         ← 공통 기능
├── components/     ← UI 컴포넌트 (슬라이더, 카드 등)
├── pages/          ← 페이지별 로직
└── api/            ← 서버 API 통신만
```

#### 인증 폴더 (`auth/`)
```
로그인 관련은 모두 여기에!
├── firebase/       ← Firebase 로그인
├── naver/          ← 네이버 로그인 (향후)
├── kakao/          ← 카카오 로그인 (향후)
└── auth-manager.js ← 어떤 로그인을 쓸지 선택
```

## 3. 인증 시스템 설계

### 🔐 **멀티 로그인 API 지원**

#### 통합 인증 관리자 (`auth/auth-manager.js`)
```javascript
// 어떤 로그인 방식을 사용할지 선택하는 메인 파일
import { FirebaseAuth } from './firebase/auth.js';
import { NaverAuth } from './naver/auth.js';
import { KakaoAuth } from './kakao/auth.js';

export class AuthManager {
  constructor() {
    this.currentProvider = 'firebase'; // 기본값
    this.providers = {
      firebase: new FirebaseAuth(),
      naver: new NaverAuth(),
      kakao: new KakaoAuth()
    };
  }

  // 로그인 방식 변경
  setProvider(providerName) {
    this.currentProvider = providerName;
  }

  // 로그인 (어떤 방식이든 동일한 인터페이스)
  async login(credentials) {
    const provider = this.providers[this.currentProvider];
    return await provider.login(credentials);
  }

  // 로그아웃
  async logout() {
    const provider = this.providers[this.currentProvider];
    return await provider.logout();
  }

  // 현재 사용자 정보
  getCurrentUser() {
    const provider = this.providers[this.currentProvider];
    return provider.getCurrentUser();
  }
}

// 전역에서 사용할 인증 매니저
export const authManager = new AuthManager();
```

#### Firebase 인증 (`auth/firebase/auth.js`)
```javascript
import { firebaseConfig } from './config.js';

export class FirebaseAuth {
  constructor() {
    // Firebase 초기화
    this.initializeFirebase();
  }

  async login(credentials) {
    // Firebase 로그인 로직
    console.log('Firebase로 로그인 중...');
    // 실제 Firebase 로그인 코드
  }

  async logout() {
    // Firebase 로그아웃 로직
  }

  getCurrentUser() {
    // Firebase 사용자 정보 반환
  }
}
```

#### 네이버 로그인 (`auth/naver/auth.js`) - 향후 추가
```javascript
import { naverConfig } from './config.js';

export class NaverAuth {
  constructor() {
    // 네이버 SDK 초기화
    this.initializeNaver();
  }

  async login(credentials) {
    console.log('네이버로 로그인 중...');
    // 네이버 로그인 API 호출
  }

  async logout() {
    // 네이버 로그아웃
  }

  getCurrentUser() {
    // 네이버 사용자 정보
  }
}
```

### 🔄 **로그인 방식 전환**
```javascript
// 로그인 페이지에서 사용자가 선택
import { authManager } from '../auth/auth-manager.js';

// Firebase 로그인 버튼 클릭시
document.getElementById('firebase-login').addEventListener('click', () => {
  authManager.setProvider('firebase');
  authManager.login({ email, password });
});

// 네이버 로그인 버튼 클릭시 (향후)
document.getElementById('naver-login').addEventListener('click', () => {
  authManager.setProvider('naver');
  authManager.login();
});
```

## 4. API 통신 구조

### 📡 **서버 API vs 로그인 API 분리**

#### 서버 API (`js/api/`)
```javascript
// js/api/config.js - 서버 API 설정
export const API_BASE_URL = 'http://127.0.0.1:8000';
export const ENDPOINTS = {
  recommendations: {
    top: '/recommendation/top',
    emotion: '/recommendation/emotion',
    recent: '/recommendation/recent',
    similar: '/recommendation/similar'
  },
  content: '/assets',
  search: '/search'
};

// js/api/content.js - 콘텐츠 관련 API
export async function getContentDetails(contentId) {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.content}/${contentId}`);
  return response.json();
}

// js/api/recommendation.js - 추천 API
export async function getTopRecommendations(count = 10) {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.recommendations.top}?n=${count}`);
  return response.json();
}
```

#### 로그인 API는 별도 (`auth/` 폴더)
```javascript
// auth/firebase/config.js - Firebase 설정만
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain",
  // ... Firebase 설정
};

// auth/naver/config.js - 네이버 설정만 (향후)
export const naverConfig = {
  clientId: "your-naver-client-id",
  redirectUri: "your-redirect-uri"
};
```

### 추천 콘텐츠 요청
```javascript
// recommendation_test.js - 테스트 추천 API를 사용하는 예시
export async function initRecommendationsWithTest() {
  // 오늘의 인기작 슬라이더 초기화 - 액션 장르로 필터링
  try {
    const topResponse = await fetch(`${API_BASE_URL}/recommendation/test?n=10&is_adult=false&genre=액션`);
    const topData = await topResponse.json();
    const topItems = topData.items || [];
    renderSlider(document.getElementById('top-slider'), topItems);
  } catch (error) {
    console.error('인기작 추천 데이터 로드 실패:', error);
  }
  
  // 감정 기반 추천 슬라이더 초기화 - 코미디 장르로 필터링
  try {
    const emoResponse = await fetch(`${API_BASE_URL}/recommendation/test?n=10&is_main=true&genre=코미디`);
    const emoData = await emoResponse.json();
    const emoItems = emoData.items || [];
    renderSlider(document.getElementById('emotion-slider'), emoItems);
  } catch (error) {
    console.error('감정 기반 추천 데이터 로드 실패:', error);
  }
  
  // 최근 시청 콘텐츠 슬라이더 초기화 - 드라마 장르로 필터링
  try {
    const recentResponse = await fetch(`${API_BASE_URL}/recommendation/test?n=8&genre=드라마`);
    const recentData = await recentResponse.json();
    const recentItems = recentData.items || [];
    renderSlider(document.getElementById('recent-slider'), recentItems);
  } catch (error) {
    console.error('최근 시청 추천 데이터 로드 실패:', error);
  }
}

// MainHeroSlider.js - 메인 히어로 섹션 슬라이더
// API: http://127.0.0.1:8000/recommendation/test?n=4&is_adult=false&is_main=true
// 응답 데이터 (asset_nm, poster_path, genre, release_year 등)를 사용하여 동적으로 슬라이드를 생성하고 자동 넘김 및 탐색 기능을 제공.
```

### 검색 기능
```javascript
// search.js
export async function searchFiltered(query, limit = 10) {
  const params = new URLSearchParams({ query, limit });
  const res = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
  if (!res.ok) throw new Error(`검색 실패: ${res.status}`);
  const { results } = await res.json();
  return results;
}
```

## 4. 페이지 구성

### index.html (랜딩 페이지)
- 서비스 소개 및 주요 기능 설명
- 회원가입 링크
- Firebase 인증 통합
- 반응형 디자인 적용
- WellList 스타일 UI/UX

### login.html (인증)
- 이메일/비밀번호 로그인
- Firebase 인증 통합
- 유효성 검사
- 비밀번호 강도 체크
- 로고 이미지 경로 수정 (images/welllist_backno.png 또는 images/logo.png)

### main.html (메인 페이지)
- 헤더
  - 로고 (init.js에서 이벤트 리스너 처리)
  - 네비게이션 메뉴
    - 홈, 영화, 드라마, 마이페이지
  - 검색바
  - 사용자 메뉴
    - 마이페이지, 설정, 로그아웃
- 메인 섹션 (Hero Section)
  - API에서 동적으로 로드되는 슬라이더 (MainHeroSlider.js)
  - 추천 컨텐츠 하이라이트
  - 재생/찜하기 버튼
  - 자동 슬라이드 및 탐색 버튼
- 드롭다운 메뉴 (장르)
  - 헤더 로고 아래에 위치
  - 3x6 그리드 형태의 장르 목록 (Dropdown.js)
  - 클릭 시 토글, 외부 클릭 시 닫힘 기능
- 컨텐츠 섹션
  - 카테고리별 슬라이더
  - 반응형 그리드 레이아웃
  - 호버 효과

### contents.html (상세 페이지)
- 컨텐츠 메타데이터 표시 (포스터, 제목, 장르, 연도, 시간, 설명 등)
- 감정 태그 표시 (설렘, 로맨틱, 시간여행, 감동 등)
- 출연진 정보 표시
- 헬로 렌탈 추천 상품 슬라이더
- 비슷한 콘텐츠 추천 슬라이더 (API 연동)
- 모듈식 구조 (헤더는 loadHeader.js에 의해 자동으로 삽입)
- 공통 헤더 컴포넌트 사용
- 반응형 슬라이더 (모바일/데스크탑 화면 크기 대응)

### mylist.html (개인화)
- 찜한 컨텐츠 관리
- 시청 기록 표시
- 위시리스트 기능

## 5. 스타일링 시스템

### 반응형 디자인
- CSS 변수 시스템
```css
:root {
  --base-font-size: 16px;
  --scale-ratio: 1;
  --container-width: min(1280px, 90vw);
  --header-height: 4rem;
  --card-aspect-ratio: 1.5;
  --grid-gap: clamp(1rem, 2vw, 2rem);
}
```

### 브레이크포인트
- 1400px: 데스크톱 대형
- 1024px: 데스크톱
- 768px: 태블릿
- 480px: 모바일

### 성능 최적화
- 이미지 지연 로딩
- CSS 애니메이션 최적화
- 미디어 쿼리 최적화
- 고해상도 디스플레이 대응

## 6. JavaScript 모듈

### main.js
- 콘텐츠 상세 페이지 (contents.html) 전용 스크립트
- 현재 컨텐츠 ID를 URL에서 추출
- 유사 콘텐츠 추천 API 호출 (`/recommendation/similar/{contentId}`)
- 데이터 처리 및 Slider.js를 통한 렌더링
- 이벤트 핸들러 관리 (슬라이더 내비게이션)
- 반응형 동작 처리

### init.js
- 모든 페이지에서 공통으로 사용되는 초기화 스크립트
- 헤더 로딩 후 초기화 (`loadHeader()` 호출)
- 로고 클릭 시 메인 페이지 이동 이벤트 리스너 처리
- 검색 기능 초기화 (`initializeSearch()`)
- 사용자 메뉴 초기화 (`initializeUserMenu()`, `setupLogout()`)
- 드롭다운 메뉴 초기화 (`initDropdown()`) - 경로에 따라 조건부 실행

### auth.js
- Firebase 인증 통합
- 사용자 세션 관리
- 권한 체크

### asset.js
- 컨텐츠 메타데이터 관리
- 이미지 최적화
- 캐싱 전략

### Dropdown.js
- 드롭다운 메뉴의 표시/숨김 로직 처리
- 버튼 클릭 및 외부 클릭 이벤트 핸들링

### MainHeroSlider.js
- 메인 히어로 섹션 슬라이더의 API 데이터 호출
- 동적 슬라이드 생성 및 표시
- 자동 슬라이드 및 좌우 탐색 기능 구현

## 7. API 연동

### 엔드포인트
- `/assets/{asset_idx}`: 특정 콘텐츠 상세 정보 조회
- `/recommendation/similar/{asset_idx}`: 특정 콘텐츠와 유사한 콘텐츠 추천 (다양한 시리즈에서 하나씩만 추천)
- `/recommendation/test`: 테스트 추천 API 엔드포인트 (MainHeroSlider에서 사용, 여러 파라미터 지원)
- `/search`: 컨텐츠 검색 (기본)
- `/search/advanced`: 고급 검색 (필터링 기능 제공)

### 파라미터 처리
- 슬레이트별 다른 파라미터로 API 호출:
  - 인기작: `genre=액션`
  - 감정 기반: `genre=코미디`
  - 최근 시청: `genre=드라마`
  - 메인 히어로 슬라이더: `n=4&is_adult=false&is_main=true`
- 각 슬레이트가 서로 다른 콘텐츠를 표시하도록 설계

### 데이터 흐름
1. 페이지 로드
2. `loadHeader.js`를 통해 공통 헤더 로드 및 초기화
3. `init.js`에서 페이지 기본 요소 초기화 후 `initMainHeroSlider()` 및 `initDropdown()` 호출 (main.html)
4. 비디오 정보 로드 (contents.html의 경우 URL 파라미터에서 컨텐츠 ID 추출)
5. 콘텐츠 ID 기반으로 상세 정보 API 호출 (`/assets/{contentId}`)
6. 추천 콘텐츠 API 호출 (`/recommendation/similar/{contentId}?top_n=10`)
7. `Slider.js`의 `renderSlider()` 함수를 통해 추천 콘텐츠 렌더링
8. 사용자 인터랙션에 따른 UI 업데이트 (슬라이더 네비게이션, 클릭 등)

## 8. 사용자 경험

### 컴포넌트 아키텍처
- 관심사 분리 패턴 적용:
  - `api/`: API 통신 로직
  - `components/`: UI 컴포넌트 및 렌더링 로직
- 코드 재사용성 향상:
  - `renderSlider()` 함수를 모든 슬레이트에서 공유

### 인터랙션
- 통합 헤더 및 네비게이션 (모든 페이지 공통)
- 슬라이더 내비게이션 (이전/다음 버튼)
- 콘텐츠 카드 호버 효과 및 클릭 시 상세 페이지 이동
- 부드러운 슬라이드 전환 (CSS transitions)
- 로딩 상태 표시 (API 호출 중)
- 이미지 로드 에러 처리 및 대체 이미지 표시
- 반응형 UI (모바일/태블릿/데스크탑 대응)

### 추천 시스템 개선
- 각 슬레이트마다 다른 추천 알고리즘 적용 가능
- 테스트 엔드포인트를 통한 빠른 프로토타이핑
- 파라미터 기반의 유연한 추천 결과 제공

## 9. 컴포넌트 구조 개선

### 헤더 분리와 재사용
- 기존의 모든 페이지에 복제되어 있던 헤더를 별도의 컴포넌트로 분리
- `/public/components/` 디렉토리에 헤더 관련 파일 구성
  - `header.html`: 헤더의 HTML 구조
  - `header.css`: 헤더 전용 스타일
  - `loadHeader.js`: 모든 페이지에서 헤더를 동적으로 로드하는 스크립트

```javascript
// loadHeader.js의 주요 기능
export async function loadHeader() {
  try {
    const response = await fetch('/components/header.html');
    const html = await response.text();
    
    // 헤더 HTML을 페이지에 삽입
    const headerPlaceholder = document.querySelector('header') || document.createElement('header');
    headerPlaceholder.innerHTML = html;
    
    if (!document.querySelector('header')) {
      document.body.insertBefore(headerPlaceholder, document.body.firstChild);
    }
    
    // 헤더 스타일 로드
    if (!document.querySelector('link[href="/components/header.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/components/header.css';
      document.head.appendChild(link);
    }
    
    // 헤더 초기화 (검색, 드롭다운 등)
    initializeHeader();
  } catch (error) {
    console.error('헤더 로드 실패:', error);
  }
}
```

### 슬라이더 컴포넌트 개선
- `contents.html`에서 하드코딩된 이미지 슬라이더를 동적 로드 방식으로 변경
- `Slider.js` 컴포넌트를 활용하여 API에서 실시간으로 추천 컨텐츠 로드
- 슬라이더 내비게이션 로직 간소화 및 성능 개선

```javascript
// Slider.js의 주요 기능
export async function renderSlider(slider, items) {
  slider.innerHTML = '';
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';

  for (const item of items) {
    const card = await createCard(item);
    cardContainer.appendChild(card);
  }

  slider.appendChild(cardContainer);
}

// 카드 생성 함수
async function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  
  // 이미지 로드 처리 및 에러 핸들링
  const posterPath = await loadImage(item.poster_path);
  
  card.innerHTML = `
    <img src="${posterPath}" 
         alt="${item.asset_nm}" 
         loading="lazy" />
    <div class="card-info">
      <h3 class="card-title">${item.asset_nm}</h3>
    </div>
  `;

  // 클릭 이벤트 - 컨텐츠 상세 페이지로 이동
  card.addEventListener('click', () => {
    window.location.href = `/contents?id=${item.id}`;
  });

  return card;
}
```

### 페이지 간 일관성 유지
- 모든 페이지에서 공통으로 사용하는 요소를 `components/` 폴더로 분리
- 동일한 스타일 및 동작을 유지하여 사용자 경험 일관성 제공
- CSS 클래스 네이밍 컨벤션 표준화 (BEM 방식)
- 페이지별 필요 없는 클래스 및 속성 정리 (예: main-content 클래스 제거)

### loadHeader.js
- 공통 헤더를 모든 페이지에 동적으로 삽입하는 모듈
- 헤더 HTML 및 CSS를 비동기적으로 로드
- 각 페이지에서 import하여 사용 (`import { loadHeader } from '/components/loadHeader.js'`)
- 헤더 로드 후 초기화 함수 실행
- 오류 처리 및 로드 실패 시 폴백 메커니즘

### Slider.js
- 공통 슬라이더 컴포넌트 (재사용 가능)
- 콘텐츠 카드 동적 생성 및 렌더링
- 이미지 로드 오류 처리
- 포스터 이미지 최적화 (lazy loading 지원)
- 콘텐츠 ID를 통한 상세 페이지 링크 연결
