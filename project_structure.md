# VOD 추천 시스템 프로젝트 구조 --> 내용 바꿔야함

## 1. 프로젝트 개요
웹 기반 VOD 추천 시스템으로, FastAPI 백엔드와 HTML/CSS/JS 프론트엔드로 구성되어 있습니다.

## 2. 디렉토리 구조

### 2.1 루트 디렉토리
- `firebase.json`: Firebase 구성 파일
- `firestore.indexes.json`: Firestore 인덱스 설정
- `firestore.rules`: Firestore 보안 규칙
- `package.json`: 프로젝트 의존성 관리
- `requirements.txt`: Python 의존성 관리

## 2. 클라이언트 (client/)
### 2.1 public/
- `contents.html`: 컨텐츠 페이지
- `index.html`: 메인 랜딩 페이지
- `login.html`: 로그인 페이지
- `main.html`: 로그인 후 메인 페이지
- `mylist.html`: 사용자 찜 목록 페이지

### 2.2 src/
#### JavaScript 파일
- `asset.js`: 자산 관리 로직
- `config.js`: 설정 관리
- `main.js`: 메인 애플리케이션 로직

#### assets/
- `netflix.png`: 넷플릭스 스타일 로고
- `WellList.png`: 찜 목록 관련 이미지

#### firebase/
- `auth.js`: Firebase 인증 관리

#### styles/
- `index.css`: 랜딩 페이지 스타일
- `login.css`: 로그인 페이지 스타일
- `main.css`: 메인 페이지 스타일

## 3. 서버 (server/)
### 3.1 api/
#### routes/
- `recommendations.py`: 추천 시스템 API 엔드포인트

### 3.2 core/
- `config.py`: 서버 설정
- `database.py`: 데이터베이스 연결 및 설정
#### services/
- `recommendation.py`: 추천 서비스 로직
#### utils/
- 유틸리티 함수들

### 3.3 models/
- `__init__.py`: 모델 패키지 초기화
- `asset.py`: 자산 모델
- `base.py`: 기본 모델 클래스
- `image.py`: 이미지 데이터베이스 모델
- `schemas.py`: Pydantic 스키마
- `user.py`: 사용자 모델

### 3.4 routes/
- `__init__.py`: 라우트 패키지 초기화
- `asset.py`: 자산 관련 라우트
- `recommendations.py`: 추천 관련 라우트
- `user.py`: 사용자 관련 라우트

## 주요 기능
1. **사용자 인증**
   - 이메일/비밀번호 로그인
   - Firebase 기반 인증

2. **컨텐츠 관리**
   - VOD 자산 관리
   - 이미지 메타데이터 관리

3. **추천 시스템**
   - TF-IDF 기반 컨텐츠 추천
   - 사용자 맞춤 추천

4. **프론트엔드**
   - 반응형 UI
   - Netflix 스타일 인터페이스

## 기술 스택
- **프론트엔드**: HTML, CSS, JavaScript
- **백엔드**: FastAPI, Python
- **데이터베이스**: PostgreSQL
- **인증**: Firebase Authentication
