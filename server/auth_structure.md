# Firebase 인증 및 사용자 관리 구조

## 1. 개요
이 문서는 Firebase 인증과 사용자 관리 시스템의 통합 구조를 설명합니다. 본 시스템은 Firebase Authentication을 사용하여 사용자 인증을 처리하고, 내부 데이터베이스에 사용자 정보를 저장합니다.

## 2. 데이터베이스 구조

### users 테이블
| 필드명 | 타입 | 설명 |
|--------|------|------|
| user_idx | Integer | Primary Key |
| sha2_hash | String | Firebase UID (Unique) |
| nick_name | String | 사용자 닉네임 |
| email | String | 사용자 이메일 |
| age | Integer | 사용자 나이대 (10, 20, 30...) |
| birth | Date | 생년월일 |
| is_adult | Boolean | 성인 여부 (성인 콘텐츠 접근 권한) |
| sec_password | String | 2차 비밀번호 (기본값: "0000") |
| created_at | Timestamp | 계정 생성 시간 |
| updated_at | Timestamp | 최종 정보 갱신 시간 |

## 3. 인증 흐름

### 회원가입 프로세스
1. 클라이언트에서 Firebase Authentication으로 사용자 인증 (이메일/비밀번호)
2. Firebase JWT 토큰과 UID 획득
3. 백엔드 서버에 POST 요청 (/users/auth/register)
   - JWT 토큰을 Authorization 헤더에 포함
   - 사용자 정보(이메일, 닉네임, 생년월일 등)를 요청 본문에 포함
4. 백엔드에서 JWT 검증 후 users 테이블에 새 레코드 생성
5. 나이대(age)와 성인 여부(is_adult) 자동 계산 및 저장
6. 오류 발생 시 적절한 에러 메시지 반환 (400/500 상태 코드)
   - 클라이언트는 JSON 형식 및 일반 텍스트 형식 모두 처리 가능

### 로그인 프로세스
1. 클라이언트에서 Firebase Authentication으로 로그인
2. Firebase JWT 토큰 획득
3. 백엔드 서버에 GET 요청 (/users/auth/me)
   - JWT 토큰을 Authorization 헤더에 포함
4. 백엔드에서 JWT 검증 후 Firebase UID(sha2_hash)로 사용자 정보 조회
5. 클라이언트에 사용자 정보 반환
6. 로그인 상태 유지 기능 ("Remember me") 지원

### 오류 처리
1. 네트워크 오류: 클라이언트에서 적절한 오류 메시지 표시
2. 인증 오류: Firebase 오류 메시지를 사용자 친화적으로 표시
3. 서버 오류: 백엔드에서 반환된 오류 메시지를 파싱하여 표시

## 4. 코드 구조

### 모델과 스키마 네이밍
SQLAlchemy 모델과 Pydantic 스키마 간 네이밍 충돌을 방지하기 위해 다음과 같이 구성되어 있습니다:
- SQLAlchemy 모델: UserModel (User를 import as UserModel로 가져옴)
- Pydantic 스키마: UserSchema (User as UserSchema 또는 별도 이름 사용)

### UserModel (server/models/user.py)
```python
class User(Base):
    __tablename__ = "users"
    
    user_idx = Column(Integer, primary_key=True)
    sha2_hash = Column(String, unique=True, nullable=False, comment="Firebase UID를 저장하는 필드")
    email = Column(String, unique=True, nullable=False)
    nick_name = Column(String, nullable=False)
    # ... 기타 필드 ...
```

### 사용자 스키마 (server/api/schemas/user.py)
```python
# Pydantic 스키마
class User(BaseModel):
    user_idx: int
    sha2_hash: str
    nick_name: str
    email: str
    # ... 기타 필드 ...
    
    class Config:
        orm_mode = True
```

### 데이터베이스 초기화 (server/core/database.py)
```python
def init_db():
    """데이터베이스 초기화 및 연결 테스트"""
    from server.models.user import User as UserModel  # 함수 내부에서 임포트
    # ... 기타 모델 임포트 ...
    Base.metadata.create_all(bind=engine)
```

## 5. API 엔드포인트

### 사용자 관리
- POST /users/auth/register - 신규 사용자 등록
  - 요청 본문: UserRegister 스키마 (이메일, 닉네임, 생년월일 필수)
  - 응답: 생성된 사용자 정보 또는 오류 메시지
- GET /users/auth/me - 현재 사용자 정보 조회
  - 요청 헤더: Authorization Bearer 토큰
  - 응답: 사용자 정보 또는 오류 메시지
- GET /users/{user_id} - 특정 사용자 정보 조회
- PATCH /users/{user_id} - 사용자 정보 업데이트

### 인증 관련 클라이언트 함수
- signUpWithEmail() - 이메일 회원가입
- signInWithEmail() - 이메일 로그인
- signOut() - 로그아웃
- getCurrentUser() - 현재 인증된 사용자 정보 조회

## 6. 보안 고려사항

### 데이터 보안
- Firebase UID는 sha2_hash 필드에 안전하게 저장
- 모든 사용자 인증은 Firebase를 통해 처리
- 민감한 정보는 암호화하여 저장
- JWT 토큰 검증을 통한 API 접근 제어

### 접근 제어
- 모든 API 요청은 Firebase 토큰 검증 필요
- 사용자는 자신의 정보만 접근 가능
- 관리자 권한은 별도 관리
- 성인 콘텐츠에 대한 접근은 is_adult 필드로 제한

## 7. 오류 해결 및 디버깅

### 일반적인 오류
- 500 Internal Server Error: 서버 내부 오류, 서버 로그 확인 필요
- 400 Bad Request: 요청 형식 또는 데이터 문제
- 401 Unauthorized: 인증 토큰 누락 또는 만료
- 403 Forbidden: 권한 부족

### 네이밍 충돌 방지
- SQLAlchemy 모델은 `UserModel`로, Pydantic 스키마는 `UserSchema`로 구분
- 모델 관계 설정 시 `back_populates` 속성이 올바르게 지정되어야 함
- 예: `TagAsset` 모델의 `tag`와 `Tag` 모델의 `assets` 관계

### 클라이언트 측 오류 처리
- 모든 API 요청에는 에러 처리 로직을 포함
- 네트워크 오류, 서버 오류, 인증 오류를 별도로 처리
- JSON 파싱 오류 발생 시 raw 텍스트 응답도 처리 가능하도록 구현
