# 추천 시스템 상세 설명

## 1. 개요
이 VOD 추천 시스템은 콘텐츠 기반 필터링과 협업 필터링을 결합한 하이브리드 추천 시스템을 구현합니다.

## 2. 핵심 컴포넌트

### TF-IDF 벡터라이저
- 위치: `server/models/tfidf/tfidf_vectorizer.pkl`
- 기능: 컨텐츠 설명과 메타데이터를 벡터화
- 처리 대상: 제목, 설명, 장르 등

### 특성 매트릭스
- 위치: `server/models/tfidf/tfidf_matrix.npz`
- 기능: 벡터화된 컨텐츠 특성 저장
- 활용: 컨텐츠 유사도 계산

## 3. 추천 알고리즘

### 콘텐츠 기반 필터링
```python
# server/core/services/recommendation.py의 주요 로직
- TF-IDF 특성 기반 유사도 계산
- 코사인 유사도 매트릭스 생성
- 장르 가중치 적용
```

### 사용자 기반 추천
```python
# server/routes/recommendations.py의 주요 기능
- 시청 기록 분석
- 선호 장르 파악
- 개인화된 추천 생성
```

## 4. API 엔드포인트

### 랜덤 추천
```python
@router.get("/random")
- 새로운 컨텐츠 무작위 추천
- 인기도 가중치 적용
```

### 개인화 추천
```python
@router.get("/personalized")
- 사용자 프로필 기반 추천
- 시청 기록 활용
- 선호도 분석
```

### 유사 컨텐츠
```python
@router.get("/similar/{asset_id}")
- 특정 컨텐츠와 유사한 항목 추천
- TF-IDF 유사도 활용
```

## 5. 성능 최적화

### 캐싱 전략
```python
# 추천 결과 캐싱
- Redis 캐시 활용
- 주기적 업데이트
- 캐시 무효화 정책
```

### 계산 최적화
```python
# 배치 처리
- 주기적 모델 업데이트
- 사전 계산된 유사도
- 병렬 처리 활용
```