# VOD 추천 서비스 프론트엔드 (Vanilla JS)

## 1. 디렉토리 구조
```
client/
├── public/              # 정적 파일
│   ├── contents.html    # 컨텐츠 상세 페이지
│   ├── index.html       # 랜딩 페이지
│   ├── login.html       # 로그인/회원가입
│   ├── main.html        # 메인 대시보드
│   ├── mylist.html      # 찜 목록
│   └── search.html      # 검색 결과 페이지
│   ├── images/          # 이미지 파일
│   │   ├── logo.png     # 기존 로고 이미지 (경로명 오류 수정 후 welllist_backno.png 사용 가능)
│   │   └── welllist_backno.png # 추가된 로고 이미지 (실제 파일 존재 시)
│   │   └── ...
├── src/
│   ├── api/            # API 통신 관련 파일
│   │   ├── config.js   # API 엔드포인트 설정
│   │   ├── rec_test.js # 기본 추천 API 호출
│   │   ├── recommendation_test.js # 테스트 추천 API
│   │   ├── requests.js # 통합 API 요청 함수
│   │   ├── search.js   # 검색 API 관련
│   │   └── ...
│   ├── components/     # UI 컴포넌트
│   │   ├── Dropdown.js # 드롭다운 메뉴 기능
│   │   ├── MainHeroSlider.js # 메인 히어로 섹션 슬라이더
│   │   ├── Recommendations.js # 추천 슬라이더 렌더링 (일반)
│   │   ├── Search.js   # 검색 UI 컴포넌트
│   │   ├── Slider.js   # 슬라이더 UI (재활용 가능)
│   │   ├── UserMenu.js # 사용자 메뉴
│   │   └── utils.js    # 유틸리티 함수
│   ├── styles/         # CSS 파일
│   │   ├── contents.css # 컨텐츠 상세 페이지 스타일
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── main.css
│   │   └── mylist.css
│   ├── firebase/       # Firebase 관련
│   │   ├── auth.js     # 인증
│   │   └── config.js   # Firebase 설정
│   └── pages/          # 페이지별 로직
│       ├── asset.js    # 콘텐츠 관련
│       ├── main.js     # 메인 페이지 로직 (기존 마이페이지 관련 코드 제거)
│       └── mylist.js   # 찜 목록
└── package.json
```

## 2. 데이터베이스 연동

### 테이블 구조

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

### 데이터 매핑

#### 컨텐츠 카드 컴포넌트
```javascript
function createContentCard(data) {
  return {
    id: data.full_asset_id,
    title: data.asset_nm,
    genre: data.genre,
    description: data.cleaned_smry,
    posterUrl: data.poster_path
  };
}
```

#### 사용자 프로필
```javascript
function createUserProfile(data) {
  return {
    id: data.sha2_hash,
    ageGroup: data.age_avg,
    preferredChannels: data.main_channels,
    watchTime: data.use_tms,
    activityCount: data.cnt
  };
}
```

## 3. API 통신

### API 구성
- 프론트엔드에서는 `api/` 폴더에 API 요청 관련 로직 분리
- `components/` 폴더에는 UI 렌더링 로직 분리
- 별도의 폴더 구조로 관심사 분리 패턴 적용

### API 엔드포인트 설정 (config.js)
```javascript
// API 설정
export const API_BASE_URL = 'http://127.0.0.1:8000';

// 추천 시스템 엔드포인트 설정
export const ENDPOINTS = {
    recommendations: {
        top: '/recommendation/top',
        emotion: '/recommendation/emotion',
        recent: '/recommendation/recent'
    },
    assets: '/assets',
    search: '/search',
    advancedSearch: '/search/advanced'
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
- 컨텐츠 메타데이터 표시
- 비디오 플레이어
- 관련 컨텐츠 추천
- 시청 기록 관리

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
- 기존 마이페이지 관련 코드 제거
- FastAPI 서버 연동 (슬라이더 초기화)
- 컨텐츠 로딩 및 렌더링
- 이벤트 핸들러 관리 (일반 슬라이더)
- 반응형 동작 처리

### init.js
- 헤더 로딩 후 초기화 (`loadHeader()`)
- 로고 클릭 시 메인 페이지 이동 이벤트 리스너 처리
- 검색 기능, 사용자 메뉴, 추천 콘텐츠 초기화

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
2. `init.js`에서 헤더 로드 후 `initMainHeroSlider()` 및 `initDropdown()` 호출 (main.html)
3. `MainHeroSlider.js`에서 API 요청 (`/recommendation/test?n=4&is_adult=false&is_main=true`)
4. 응답 데이터를 `populateSlider()` 함수로 슬라이드 동적 렌더링
5. `recommendation_test.js`에서 다른 슬라이더들에 대한 API 요청 및 `renderSlider()` 렌더링
6. 사용자 인터랙션에 따른 UI 업데이트

## 8. 사용자 경험

### 컴포넌트 아키텍처
- 관심사 분리 패턴 적용:
  - `api/`: API 통신 로직
  - `components/`: UI 컴포넌트 및 렌더링 로직
- 코드 재사용성 향상:
  - `renderSlider()` 함수를 모든 슬레이트에서 공유

### 인터랙션
- 슬라이더 내비게이션 (이전/다음 버튼)
- 호버 효과
- 부드러운 전환
- 로딩 상태 표시
- 에러 처리 및 재시도 로직

### 추천 시스템 개선
- 각 슬레이트마다 다른 추천 알고리즘 적용 가능
- 테스트 엔드포인트를 통한 빠른 프로토타이핑
- 파라미터 기반의 유연한 추천 결과 제공
