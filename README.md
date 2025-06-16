# MyChU 프로젝트

## 프로젝트 소개
VOD 추천 시스템 웹 애플리케이션

## 개발 환경 설정

### 필수 설치 항목
1. Node.js (최신 LTS 버전)
2. Python 3.10 이상
3. Git

### 폴더 구조 설명
이 프로젝트는 다음과 같은 구조로 되어 있습니다:

- `server/`: FastAPI 백엔드 서버 코드
- `client/`: 프론트엔드 코드
  - `client/public/`: 정적 HTML 파일들
  - `client/src/`: 자바스크립트, CSS 파일들

### 주의: package.json 파일 관리

이 프로젝트에는 두 개의 package.json 파일이 있습니다:

1. **루트 폴더의 package.json**: Vite를 사용한 정적 파일 서빙 설정
2. **client 폴더의 package.json**: React와 Firebase를 포함한 실제 프론트엔드 앱

개발 목표에 따라 적절한 package.json을 사용하세요:
- 백엔드와 연동된 정적 페이지 작업: 루트 package.json 사용
- React 컴포넌트 개발: client/package.json 사용

### 환경 변수 설정
`.env` 파일을 프로젝트 루트 디렉토리에 생성하고 다음 환경 변수를 설정합니다:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 프로젝트 설치 및 실행 방법

#### 1. 백엔드 설치

```bash
# 가상환경 생성 (선택사항이지만 권장)
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt
```

#### 2. 프론트엔드 설치

##### 정적 파일 서빙만 필요한 경우 (루트 폴더에서):
```bash
# 프로젝트 루트 디렉토리에서
npm install
npm run dev
```

##### React 앱 개발이 필요한 경우 (client 폴더에서):
```bash
cd client
npm install
npm run dev
```

#### 3. 백엔드 서버 실행

```bash
# 프로젝트 루트 디렉토리에서
uvicorn server.main:app --reload
```

서버는 기본적으로 `http://localhost:8000`에서 실행됩니다.

## 문제 해결

### CSS가 적용되지 않는 경우

1. 백엔드 서버가 실행 중인지 확인하세요.
2. 브라우저에서 직접 CSS 파일에 접근해보세요: `http://localhost:8000/src/styles/mylist.css`
3. 브라우저 개발자 도구의 네트워크 탭에서 CSS 요청이 실패하는지 확인하세요.
4. 모든 경로가 절대 경로인지 확인하세요 (예: `/src/styles/mylist.css`).

### 파일 경로 문제

- 윈도우에서 실행 시 절대 경로가 달라질 수 있습니다. 서버 시작 로그를 확인하여 실제 경로가 올바른지 확인하세요.
- 브라우저 개발자 도구의 콘솔에서 경로 관련 오류가 있는지 확인하세요.

### Firebase 인증 관련 문제

1. Firebase 설정이 올바르게 되어 있는지 확인하세요.
2. `client/src/firebase/config.js` 파일이 존재하고 올바른 설정을 가지고 있는지 확인하세요.

## API 엔드포인트

주요 엔드포인트:

- `GET /`: 메인 페이지
- `GET /login`, `GET /login.html`: 로그인 페이지
- `GET /mylist`, `GET /mylist.html`: 마이 리스트 페이지
- `GET /users/auth/me`: 현재 로그인한 사용자 정보 (토큰 필요)
2. Vite 개발 서버를 실행

#### 백엔드 실행
```bash
# 프로젝트 루트 디렉토리에서
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python -m server.main
```

## 프로젝트 구조 설명

- `client/` - 프론트엔드 코드
  - `public/` - 정적 파일 (HTML, 이미지 등)
  - `src/` - 소스 코드
    - `firebase/` - Firebase 관련 코드
    - `styles/` - CSS 파일들
    - `components/` - 재사용 가능한 컴포넌트
    - `pages/` - 페이지 컴포넌트

- `server/` - 백엔드 코드
  - `api/` - API 엔드포인트
  - `models/` - 데이터 모델
  - `recommender/` - 추천 시스템 로직
  - `core/` - 핵심 기능 구현

- `scripts/` - 유틸리티 스크립트

## 참고사항
- Firebase 구성 파일은 `npm run dev` 실행 시 자동으로 생성됩니다.
- 프론트엔드는 Vite를 사용하여 개발 서버를 실행합니다.
- 백엔드는 FastAPI 프레임워크를 사용합니다.
