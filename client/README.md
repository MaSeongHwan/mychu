# VOD 서비스 프론트엔드

## 1. 프로젝트 구조 

```bash
client/
├── public/                    # 배포될 정적 리소스
│   ├── images/               # 이미지 리소스
│   │   ├── logo.png         # 서비스 로고
│   │   ├── mypage_img.png   # 마이페이지 아이콘
│   │   └── search_img.png   # 검색 아이콘
│   ├── contents.html         # 컨텐츠 상세 페이지
│   ├── login.html           # 로그인 페이지
│   ├── main.html            # 메인 페이지
│   └── mylist.html          # 찜 목록 페이지
├── src/
│   ├── assets/              # 로고, PNG, 아이콘 등
│   │   ├── netflix.png
│   │   └── WellList.png
│   ├── api/                 # API 요청 관련 모듈
│   │   ├── config.js       # API 엔드포인트 설정
│   │   └── requests.js     # API 요청 함수
│   ├── firebase/           # Firebase 관련 기능
│   │   ├── config.js       # Firebase 설정
│   │   └── auth.js         # 인증 관련 함수
│   ├── pages/              # 페이지별 JS 로직
│   │   ├── main.js        # 메인 페이지 로직
│   │   ├── mylist.js      # 찜 목록 페이지 로직
│   │   └── asset.js       # 컨텐츠 상세 페이지 로직
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── Search.js      # 검색 컴포넌트
│   │   ├── Slider.js      # 슬라이더 컴포넌트
│   │   └── UserMenu.js    # 사용자 메뉴 컴포넌트
│   └── styles/            # CSS 스타일
│       ├── index.css      # 공통 스타일
│       ├── login.css      # 로그인 페이지 스타일
│       ├── main.css       # 메인 페이지 스타일
│       └── mylist.css     # 찜 목록 페이지 스타일
└── scripts/               # 설정 자동화 스크립트
    └── generate-firebase-config.js  # Firebase 설정 생성

## 2. 주요 기능

### 2.1 사용자 인증 (Firebase)
- 이메일/비밀번호 로그인
- 소셜 로그인 (구글)
- 로그아웃
- 사용자 상태 관리

### 2.2 컨텐츠 관리
- 메인 페이지 컨텐츠 목록 표시
- 컨텐츠 상세 정보 조회
- 찜하기/찜 해제
- 검색 기능

### 2.3 추천 시스템
- 개인화된 컨텐츠 추천
- 인기 컨텐츠 추천
- 유사 컨텐츠 추천

## 3. API 통신

### 3.1 기본 설정
```javascript
// src/api/config.js
const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    endpoints: {
        users: '/users',
        auth: '/users/auth',
        assets: '/assets',
        recommendations: '/recommendations'
    }
};
```

### 3.2 주요 API 엔드포인트
- GET /assets - 컨텐츠 목록 조회
- GET /assets/{id} - 컨텐츠 상세 조회
- POST /users/auth/register - 회원가입
- GET /recommendations - 추천 컨텐츠 조회

## 4. 컴포넌트 구조

### 4.1 Search 컴포넌트
- 실시간 검색 기능
- 검색어 자동 완성
- 검색 결과 필터링

### 4.2 Slider 컴포넌트
- 컨텐츠 가로 스크롤
- 터치/마우스 드래그 지원
- 반응형 디자인

### 4.3 UserMenu 컴포넌트
- 사용자 프로필
- 로그아웃
- 설정 메뉴

## 5. 스타일 가이드

### 5.1 색상 팔레트
- Primary: #E50914 (Netflix Red)
- Secondary: #141414 (Dark Gray)
- Background: #000000
- Text: #FFFFFF

### 5.2 반응형 브레이크포인트
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
