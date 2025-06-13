# 서버 폴더 구조 및 데이터베이스 설계

## 1. 도메인 설계

### 사용자 도메인 (User)
사용자 인증, 개인정보, 활동 기록과 관련된 테이블

| 테이블 이름 | 설명 |
|------------|------|
| users | 사용자 기본 정보 (Primary Key, Firebase UID(sha2_hash), 나이, 생년월일, 성인여부, 2차비밀번호) |
| user_log | 사용자 활동 로그 (로그인, 로그아웃 등) |
| vod_log | 비디오 시청 로그 (시청시간, 피드백 등) |
| my_list | 사용자 찜 목록 (선호 콘텐츠) |
| rec_list | 일반 사용자 추천 목록 (개인화된 추천) |
| rec_adult_list | 성인 사용자 추천 목록 (성인 콘텐츠 추천) |

※ Firebase 인증 시스템과의 통합:
- users.sha2_hash 필드에 Firebase UID를 직접 저장
- 별도의 firebase_users 테이블 불필요
- 자세한 인증 구조는 auth_structure.md 참조

### 콘텐츠 도메인 (Asset)
콘텐츠 메타데이터 및 콘텐츠와 관련된 부가 정보

| 테이블 이름 | 설명 |
|------------|------|
| assets | 콘텐츠 기본 정보 |
| actor | 배우 정보 |
| actorasset | 배우-콘텐츠 연결 정보 |
| director | 감독 정보 |
| directorasset | 감독-콘텐츠 연결 정보 |
| score | 콘텐츠 평점 정보 |
| tags | 태그 정보 |
| tagasset | 태그-콘텐츠 연결 정보 |

### 로그 및 추천 도메인 (Log)
VOD 시청 로그, 추천 결과, 사용자-콘텐츠 상호작용

| 테이블 이름 | 설명 |
|------------|------|
| product | 제품 정보 |
| productkeyword | 제품-키워드 연결 정보 |

## 2. 프로젝트 폴더 구조

```
server/
├── api/                     # API 관련 모듈
│   ├── routes/              # API 엔드포인트 정의
│   │   ├── user.py          # 회원가입, 로그인, 정보조회
│   │   ├── asset.py         # 콘텐츠 관련 조회
│   │   ├── recommend.py     # 추천 결과 제공
│   │   └── log.py           # 로그 관련 API
│   └── schemas/             # API 요청/응답 데이터 구조
│       ├── user.py          # 사용자 관련 스키마
│       ├── asset.py         # 콘텐츠 관련 스키마
│       └── log.py           # 로그 관련 스키마
├── config/                  # 설정 관련 모듈
│   └── settings.py          # .env 기반 환경변수 관리
├── core/                    # 핵심 기능 모듈
│   ├── database.py          # SQLAlchemy, 세션 관리
│   ├── firebase_auth.py     # Firebase 로그인 연동
│   └── utils.py             # 해시 함수, 타임스탬프 등 공통 유틸
├── models/                  # 데이터베이스 모델 정의
│   ├── user.py              # 사용자 관련 모델 (users, user_log 등)
│   ├── asset.py             # 콘텐츠 관련 모델 (assets, actor 등)
│   ├── log.py               # 로그 관련 모델 (vod_log, my_list 등)
│   ├── base.py              # BaseModel (SQLAlchemy 상속)
│   └── __init__.py          # 모델 패키지 초기화
├── recommender/             # 추천 시스템 모듈
│   ├── slate_generator.py   # Slate 기반 추천 목록 생성
│   └── model_inference.py   # 추천 모델 호출 (TF, torch 등)
├── main.py                  # FastAPI 진입점
└── schemas.py               # 전역 스키마 정의
```

## 3. 주요 모듈 역할

| 폴더/파일 | 역할 | 사용 기술 |
|----------|------|----------|
| models/ | 데이터베이스 테이블 구조 정의 | SQLAlchemy ORM |
| api/schemas/ | API 요청/응답 데이터 구조 정의 | Pydantic |
| api/routes/ | API 엔드포인트 및 비즈니스 로직 | FastAPI |
| config/ | 환경 설정 및 상수 관리 | python-dotenv |
| core/ | 핵심 기능 및 유틸리티 | - |
| recommender/ | 추천 알고리즘 및 추천 결과 생성 | scikit-learn, numpy |

## 4. API 구조

### 사용자 API (/users)
- `GET /users/` - 사용자 목록 조회
- `GET /users/{user_id}` - 특정 사용자 정보 조회
- `POST /users/auth/register` - 회원 가입
- `GET /users/auth/me` - 현재 로그인한 사용자 정보 조회

### 콘텐츠 API (/assets)
- `GET /assets/` - 콘텐츠 목록 조회
- `GET /assets/{asset_id}` - 특정 콘텐츠 정보 조회
- `GET /assets/search` - 콘텐츠 검색

### 추천 API (/recommendations)
- `GET /recommendations/` - 사용자 맞춤 추천 목록 제공
- `GET /recommendations/similar/{item_id}` - 유사 콘텐츠 추천

### 로그 API (/logs)
- `POST /logs/view` - 시청 로그 저장
- `POST /logs/action` - 사용자 활동 로그 저장
