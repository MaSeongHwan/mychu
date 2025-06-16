# WellList API 통신 문서

## 1. 추천 시스템 API

### 엔드포인트 구조

```javascript
const API_BASE_URL = 'http://localhost:8000';

const sliderConfigs = [
  { 
    selector: '오늘의 인기작 Top 10', 
    endpoint: '/recommendations/top'
  },
  { 
    selector: '소금님, 오늘은 따듯한 힐링 영화가 어울려요',
    endpoint: '/recommendations/emotion'
  },
  { 
    selector: '최근 시청 콘텐츠',
    endpoint: '/recommendations/recent'
  }
];
```

### API 응답 형식

각 추천 API는 다음과 같은 형식으로 응답합니다:

```javascript
{
  "items": [
    {
      "full_asset_id": "movie-1",
      "asset_nm": "영화 제목",
      "poster_path": "이미지 URL",
      "genre": "장르 정보"
    },
    // ... 더 많은 아이템
  ]
}
```

### 클라이언트 구현 (main.js)

#### 슬라이더 초기화 및 데이터 로드
```javascript
async function initializeSliders() {
  try {
    for (const cfg of sliderConfigs) {
      // 섹션 찾기
      const section = Array.from(document.querySelectorAll('.section')).find(
        sec => sec.querySelector('h2')?.textContent.includes(cfg.selector)
      );
      const slider = section?.querySelector('.slider');
      
      // API 호출
      const response = await fetch(`${API_BASE_URL}${cfg.endpoint}?n=10`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      await renderSlider(slider, data.items);
    }
  } catch (error) {
    console.error('슬라이더 초기화 실패:', error);
  }
}
```

#### 슬라이더 렌더링
```javascript
async function renderSlider(slider, items) {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';

  for (const item of items) {
    const card = createCard(item);
    cardContainer.appendChild(card);
  }

  slider.innerHTML = '';
  slider.appendChild(cardContainer);
}
```

### 서버 구현 (recommendations.py)

#### 데이터베이스 쿼리
각 추천 엔드포인트는 다음과 같은 SQL 쿼리를 사용합니다:

```sql
SELECT 
    a.full_asset_id, 
    a.asset_nm,
    COALESCE(i.poster_path, '') as poster_path,
    COALESCE(a.genre, '') as genre
FROM asset a
LEFT JOIN asset_img i ON a.full_asset_id = i.full_asset_id
ORDER BY RANDOM() 
LIMIT :n
```

#### 에러 처리 및 폴백 전략
- 데이터베이스 오류 발생 시 더미 데이터 제공
- 빈 결과 반환 시 더미 데이터로 대체
- 모든 예외 상황에서 일관된 응답 형식 유지

## 2. 데이터 모델

### Asset 모델
```python
class Asset(Base):
    __tablename__ = "asset"
    
    asset_index = Column(Integer, primary_key=True)
    full_asset_id = Column(Text, unique=True, nullable=False)
    asset_nm = Column(Text, nullable=True)
    genre = Column(Text, nullable=True)
    # ... 기타 필드
```

## 3. 성능 최적화

### 캐싱 전략
- 이미지 URL은 CDN을 통해 제공
- 데이터베이스 쿼리 결과 캐싱
- 프론트엔드에서 이미지 lazy loading 구현

### 에러 처리
- API 오류 시 사용자 친화적인 메시지 표시
- 네트워크 오류 시 자동 재시도
- 더미 데이터를 통한 우아한 실패 처리