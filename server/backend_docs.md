# VOD 추천 시스템 백엔드 컴포넌트 설명

## 1. FastAPI 서버 구조

### main.py
- FastAPI 애플리케이션 초기화
- 미들웨어 설정 (CORS 등)
- 라우터 등록 및 경로 관리
  ```python
  # 추천 시스템 라우터 등록
  app.include_router(user_router,       prefix="/users",         tags=["users"])
  app.include_router(asset_router,      prefix="/assets",        tags=["assets"])
  app.include_router(log_router,        prefix="/logs",          tags=["logs"])
  app.include_router(search_router,     prefix="/search",        tags=["search"])
  app.include_router(rec_test_router,   prefix="",               tags=["recommendation"])
  app.include_router(rec_test_endpoint_router, prefix="",       tags=["recommendation-test"])
  app.include_router(rec_router,        prefix="",               tags=["recommendations"])
  ```
- 정적 파일 및 템플릿 처리
- 서버 시작점

### 라우트 정리 내역 (2025-06-15)
- 중복 경로 정리: `server/routes`와 `server/api/routes` 간 중복 제거
- 모든 라우트를 `server/api/routes`로 통합 (표준화)
- 라우터 import 경로 업데이트:
  ```python
  # 이전
  from server.routes.user import router as user_router
  from server.routes.recommendations import router as legacy_rec_router
  
  # 이후
  from server.api.routes.user import router as user_router
  from server.api.routes.recommendations import router as rec_router
  ```
- 기존 파일들은 `server/routes_backup_docs.md`에 참조용으로 보관됨

### 라우트 추가 내역 (2025-06-20)
- 하이브리드 추천 시스템 API 추가: `server/api/routes/recommendation_hybrid.py`
- 모델 로더 모듈 추가: `server/core/services/recommendation_loader.py`
- 콘텐츠 추천 서비스 활용: `server/core/services/contents_recommendation.py`
- 라우터 import 경로 추가:
  ```python
  from server.api.routes.recommendation_hybrid import router as rec_hybrid_router
  ```
- 라우터 등록:
  ```python
  app.include_router(rec_hybrid_router, prefix="", tags=["recommendation-hybrid"])
  ```

## 2. 코어 모듈 (core/)

### database.py
- SQLAlchemy 데이터베이스 연결 설정
- 세션 관리 및 의존성 주입
- Base 클래스 정의 (ORM 모델의 기반)

### firebase_auth.py
- Firebase 인증 초기화
- JWT 토큰 검증
- 사용자 인증 처리
- Firebase UID와 내부 사용자 ID 매핑

### search_engine.py
- 컨텐츠 검색 기능 구현
- 검색 인덱싱 및 쿼리 처리

### recommendation_loader.py
- ML 모델, 벡터, 인코더 및 매핑 불러오기
- 사전 훈련된 모델을 API와 통합
- `recommender_assets` 디렉토리의 모델 파일 관리
  - hybrid_vectors(genre_emotion_smry).npy
  - tfidf_vectorizer_smry.pkl
  - onehot_encoder_genre.pkl
  - emotion_dict_nrc.pkl
  - content_mapping.pkl (필요시)

### contents_recommendation.py
- 콘텐츠 기반 및 하이브리드 추천 로직
- k-최근접 이웃(KNN) 알고리즘 구현
- 코사인 유사도 기반 콘텐츠 매칭
- 필터링 기능 (성인 콘텐츠, 메인 콘텐츠 등)

## 3. 모델 (models/)

### user.py
- 사용자 계정 모델 (User)
  - Firebase UID 해시 저장 (sha2_hash)
  - 연령 및 성인 여부 관리 (age, is_adult)
  - 닉네임 및 생년월일 관리 (nick_name, birth)
- 사용자 활동 로그 (UserLog)
- VOD 시청 기록 (VodLog)
- 즐겨찾기 관리 (MyList)
- 추천 목록 관리 (RecList, RecAdultList)

### asset.py
- VOD 자산 모델 (Asset)
  - 기본 메타데이터 (asset_nm, genre, smry 등)
  - 콘텐츠 분류 (is_adult, is_movie, is_drama 등)
  - 포스터 이미지 경로 관리 (poster_path)
- 배우 정보 (Actor) 및 매핑 (ActorAsset)
- 감독 정보 (Director) 및 매핑 (DirectorAsset)
- 태그 관리 (Tag) 및 매핑 (TagAsset)
- 콘텐츠 평점 관리 (Score)

### base.py
- SQLAlchemy Base 클래스 정의
- 공통 모델 속성 및 메서드

## 4. API 라우트 (api/routes/)

### user.py
- 사용자 회원가입/로그인 처리
- Firebase 인증 연동
- 프로필 관리 API
- 시청 기록 및 즐겨찾기 관리

### asset.py
- 컨텐츠 조회 및 상세정보 API
- 카테고리별 자산 필터링
- 인기/최신 컨텐츠 조회

### search.py
- 컨텐츠 검색 API
- 필터 및 정렬 기능

### recommend_slate.py
- 사용자별 맞춤 추천 API (/recommendations/)
- 콘텐츠 유사도 기반 추천 API (/recommendations/similar/{item_id})
- 콘텐츠 추천 목록 생성 및 반환

### recommendation_test.py
- 새로운 추천 API 구현 (`/recommendation` 경로)
- 세 가지 주요 엔드포인트 구현:
  - `/recommendation/top`: 인기 추천 (ORM 사용)
  - `/recommendation/emotion`: 감정 기반 추천 (힐링 장르 필터링)
  - `/recommendation/recent`: 최근 시청 기반 추천 (년도 기반 필터링)
- 응답 스키마: `RecommendationResponse`

### recommendation_test_endpoint.py
- 테스트용 추천 API (`/recommendation/test`)
- 다양한 쿼리 파라미터 지원:
  - `n`: 가져올 아이템 수
  - `is_adult`: 성인 컨텐츠 포함 여부
  - `is_main`: 메인 추천만 표시
  - `genre`: 장르 기반 필터링

### recommendations.py (레거시)
- 기존 추천 엔드포인트 (`/recommendations`)
- 레거시 코드를 API 라우터만 남기고 내부 구현은 제거
- 새 엔드포인트로의 마이그레이션 안내 주석 포함

### recommendation_hybrid.py
- 하이브리드 추천 알고리즘 API 구현
- 주요 엔드포인트:
  - `/recommendation/similar/{asset_idx}`: 특정 콘텐츠와 유사한 콘텐츠 추천
    - 장르, 감정, 줄거리 특성을 결합한 하이브리드 벡터 활용
    - 코사인 유사도 기반 순위 결정
    - 성인 콘텐츠 필터링 옵션 제공
  - `/recommendation/hybrid/user/{user_idx}`: 사용자 맞춤 하이브리드 추천 (개발 중)
- 응답 스키마: `SimilarContentResponse`
  - 각 추천 항목은 `rank`, `idx`, `content_nm`, `similarity` 정보 포함

## 5. 추천 시스템 (recommender/)

### 추천 API 구조 개선
- 기존 레거시 API와 새로운 API 구조 병행 운영
  - 레거시: `/recommendations/` 접두사 사용
  - 신규: `/recommendation/` 접두사 사용
- 테스트 엔드포인트 구현으로 프론트엔드 개발 지원
  - `/recommendation/test`: 다양한 파라미터 지원으로 유연한 테스트
- ORM 기반 구현으로 SQL 인젝션 방지 및 코드 가독성 향상
  ```python
  # ORM 쿼리 예시
  q = (
      db.query(
          Asset.idx.label('asset_idx'),
          Asset.super_asset_nm.label('asset_nm'), 
          Asset.poster_path,
          Asset.genre,
          Asset.rlse_year.label('release_year'),
          Asset.is_movie
      )
      .filter(Asset.is_adult == is_adult, Asset.is_main == is_main)
      .filter(Asset.genre.ilike(f"%{genre}%"))
      .order_by(func.random())
      .limit(n)
  )
  ```

### 현재 구현 상태
- 임시 랜덤 추천 모델에서 실제 데이터베이스 기반 구현으로 업그레이드
  - 특정 장르 필터링을 통한 각 슬레이트별 다른 추천 제공
  - 영화/드라마 구분 및 성인 콘텐츠 필터링 지원
- 필드 이름 표준화 작업 완료
  - `full_asset_id` → `idx` (또는 `asset_idx`)로 일관되게 변경
  - 스키마와 ORM 매핑 구조 개선
- `slate_generator.py`에서 기본 슬레이트 기반 추천 로직 처리
  - 후보군 스코어링 및 다양성 적용 인터페이스 구현
- `model_inference.py`에서 ML 모델 통합 구조 마련

### 하이브리드 추천 시스템 아키텍처
- 세 가지 주요 기능 통합:
  1. 콘텐츠 기반 필터링 (장르, 줄거리 유사도)
  2. 감정 기반 필터링 (NRC 감정 사전 활용)
  3. 협업 필터링 요소 (향후 구현 예정)
  
- 하이브리드 벡터 생성 과정:
  1. 텍스트 전처리 및 TF-IDF 벡터화 (줄거리)
  2. 원-핫 인코딩 (장르)
  3. 감정 특성 추출 (NRC 감정 사전)
  4. 특성 결합 및 차원 축소
  
- 유사도 계산:
  - 코사인 유사도 기반 KNN 알고리즘
  - 맞춤형 필터링 (성인 콘텐츠, 메인 콘텐츠 등)
  
- 구현 상태:
  - 모델 학습 및 저장 완료
  - 모델 로더 구현 완료
  - FastAPI 라우터 연결 완료
  - 사용자 맞춤 추천 구현 중

## 6. API 스키마 (api/schemas/)

### user.py
- 사용자 관련 요청/응답 스키마 (UserSchema, UserCreate, UserRegister)
- 데이터 유효성 검증 로직

### asset.py
- 컨텐츠 메타데이터 스키마
- 목록 및 상세 조회용 응답 모델

### recommendation.py
- 추천 시스템 응답 스키마
```python
class RecommendationItem(BaseModel):
    """
    Recommendation item schema for a single content asset
    """
    asset_idx: int
    asset_nm: str
    poster_path: str = ""
    genre: str = ""
    release_year: Optional[int] = None
    is_movie: Optional[bool] = None
    
    # Enable ORM mode with new Pydantic v2 syntax
    model_config = ConfigDict(from_attributes=True)

class RecommendationResponse(BaseModel):
    """
    Schema for the recommendation endpoint response
    """
    items: List[RecommendationItem]
```
- `full_asset_id`에서 `idx`로 필드 변경
- Pydantic v2 문법 적용 (model_config)

### search.py
- 검색 쿼리 파라미터 모델
- 검색 결과 응답 스키마

## 7. 데이터베이스 스키마

### 사용자 관련 테이블
```sql
-- users 테이블
CREATE TABLE users (
    user_idx SERIAL PRIMARY KEY,
    sha2_hash VARCHAR(255) UNIQUE NOT NULL, -- Firebase UID 저장
    age INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    birth DATE,
    is_adult BOOLEAN DEFAULT FALSE,
    sec_password VARCHAR(10) DEFAULT '0000',
    nick_name VARCHAR(100)
);

-- user_log 테이블
CREATE TABLE user_log (
    user_log_idx SERIAL PRIMARY KEY,
    user_idx INTEGER REFERENCES users(user_idx) NOT NULL,
    action_tms TIMESTAMP NOT NULL,
    action INTEGER NOT NULL
);

-- vod_log 테이블
CREATE TABLE vod_log (
    log_idx SERIAL PRIMARY KEY,
    user_idx INTEGER REFERENCES users(user_idx) NOT NULL,
    asset_idx INTEGER REFERENCES assets(idx) NOT NULL,
    strt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    use_tms INTEGER DEFAULT 0 NOT NULL,
    feedback INTEGER DEFAULT 0 NOT NULL
);

-- my_list 테이블 (즐겨찾기)
CREATE TABLE my_list (
    user_idx INTEGER REFERENCES users(user_idx),
    asset_idx INTEGER REFERENCES assets(idx),
    action BOOLEAN NOT NULL,
    time_stamp TIMESTAMP NOT NULL,
    PRIMARY KEY (user_idx, asset_idx)
);

-- rec_list 테이블 (일반 추천)
CREATE TABLE rec_list (
    user_idx INTEGER REFERENCES users(user_idx),
    asset_idx INTEGER REFERENCES assets(idx),
    rnk INTEGER NOT NULL,
    PRIMARY KEY (user_idx, asset_idx)
);

-- rec_adult_list 테이블 (성인 콘텐츠 추천)
CREATE TABLE rec_adult_list (
    user_idx INTEGER REFERENCES users(user_idx),
    asset_idx INTEGER REFERENCES assets(idx),
    rnk INTEGER NOT NULL,
    PRIMARY KEY (user_idx, asset_idx)
);
```

### 콘텐츠 관련 테이블
```sql
-- assets 테이블 (메인 콘텐츠 정보)
CREATE TABLE assets (
    idx SERIAL PRIMARY KEY,
    full_asset_id TEXT UNIQUE NOT NULL,
    unique_asset_id TEXT NOT NULL,
    asset_nm TEXT NOT NULL,
    super_asset_nm TEXT NOT NULL,
    actr_disp TEXT,
    genre TEXT,
    degree INTEGER,
    asset_time INTEGER,
    rlse_year INTEGER,
    smry TEXT,
    epsd_no INTEGER DEFAULT 0 NOT NULL,
    is_adult BOOLEAN DEFAULT FALSE,
    is_movie BOOLEAN DEFAULT FALSE,
    is_drama BOOLEAN DEFAULT FALSE,
    is_main BOOLEAN DEFAULT FALSE,
    keyword TEXT,
    poster_path TEXT
);

-- actor 테이블 (배우 정보)
CREATE TABLE actor (
    actor_idx SERIAL PRIMARY KEY,
    actor_name TEXT NOT NULL
);

-- actorasset 테이블 (배우-콘텐츠 매핑)
CREATE TABLE actorasset (
    asset_idx INTEGER REFERENCES assets(idx),
    actor_idx INTEGER REFERENCES actor(actor_idx),
    role BOOLEAN DEFAULT FALSE NOT NULL,
    PRIMARY KEY (asset_idx, actor_idx)
);

-- director 테이블 (감독 정보)
CREATE TABLE director (
    director_idx SERIAL PRIMARY KEY,
    director_name TEXT UNIQUE NOT NULL
);

-- directorasset 테이블 (감독-콘텐츠 매핑)
CREATE TABLE directorasset (
    asset_idx INTEGER REFERENCES assets(idx),
    director_idx INTEGER REFERENCES director(director_idx),
    PRIMARY KEY (asset_idx, director_idx)
);

-- score 테이블 (콘텐츠 평점 정보)
CREATE TABLE score (
    asset_idx INTEGER REFERENCES assets(idx) PRIMARY KEY,
    cnt INTEGER NOT NULL,
    c_rate FLOAT NOT NULL,
    total_tms_use INTEGER NOT NULL
);

-- tags 테이블 (태그 정보)
CREATE TABLE tags (
    tag_idx SERIAL PRIMARY KEY,
    tag TEXT UNIQUE NOT NULL
);

-- tagasset 테이블 (태그-콘텐츠 매핑)
CREATE TABLE tagasset (
    tag_idx INTEGER REFERENCES tags(tag_idx),
    asset_idx INTEGER REFERENCES assets(idx),
    PRIMARY KEY (tag_idx, asset_idx)
);
```
