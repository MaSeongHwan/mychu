# WellList API 통신 문서

## 0. API 사용 가이드라인 (폴더 구조 & 활용법)

### 1) API 관련 JS 파일 위치
- 모든 API 호출 함수는 `client/src/api/` 폴더에 분리해서 작성합니다.
  - 예: `client/src/api/requests.js`, `client/src/api/search.js`, `client/src/api/recommendation_test.js`
- 각 기능별로 파일을 나누고, 공통 fetch 함수는 `requests.js`에 작성해두면 재사용성이 높아집니다.

### 2) API 함수 작성/호출 패턴
- 각 API 함수는 export 하여, 실제 페이지/컴포넌트 JS에서 import해서 사용합니다.
- 예시: `client/src/api/search.js`
```js
// search.js
import { API_BASE_URL } from './config';

export async function searchFiltered(query, limit = 10) {
  const params = new URLSearchParams({ query, limit });
  const res = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
  if (!res.ok) throw new Error('검색 실패');
  const { results } = await res.json();
  return results;
}
```

- 실제 사용 예시 (search.html에서):
```js
import { searchFiltered } from '../src/api/search.js';

async function handleSearch() {
  const query = document.getElementById('search-input').value;
  const results = await searchFiltered(query);
  renderResults(results);
}
```

---

## [초보자 맞춤] 자바스크립트로 API를 실제로 적용하는 방법

### 1. HTML과 JS 파일 연결하기
- HTML 파일에 `<script src="...">` 태그로 JS 파일을 연결해야 합니다.
- 예시: `public/search.html` 하단에 추가
```html
<!-- ... HTML 코드 ... -->
<script type="module" src="../src/pages/search.js"></script>
</body>
</html>
```
- `type="module"`을 꼭 붙여야 import/export가 동작합니다.

### 2. 검색 버튼 클릭 시 API 호출해서 결과 보여주기
- HTML 예시:
```html
<input id="search-input" type="text" placeholder="검색어 입력">
<button id="search-btn">검색</button>
<ul id="result-list"></ul>
```
- JS 예시(`src/pages/search.js`):
```js
import { searchFiltered } from '../api/search.js';

document.getElementById('search-btn').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value;
  try {
    const results = await searchFiltered(query);
    renderResults(results);
  } catch (e) {
    alert('검색 중 오류 발생: ' + e.message);
  }
});

function renderResults(results) {
  const list = document.getElementById('result-list');
  list.innerHTML = '';
  results.forEach(item => 
    const li = document.createElement('li');
    li.textContent = item.asset_nm + ' (' + item.genre + ')';
    list.appendChild(li);
  });
}
```

### 3. API 함수 import/export란?
- `export`는 함수를 다른 파일에서 쓸 수 있게 내보내는 것
- `import`는 다른 파일의 함수를 불러오는 것
- 예시:
```js
// src/api/search.js
export async function searchFiltered(query) { ... }

// src/pages/search.js
import { searchFiltered } from '../api/search.js';
```

### 4. fetch 함수란?
- fetch는 자바스크립트에서 서버(백엔드)로 데이터를 요청하는 함수입니다.
- 예시:
```js
fetch('http://localhost:8000/search?query=영화')
  .then(res => res.json())
  .then(data => console.log(data));
```
- 보통은 async/await로 더 쉽게 씁니다:
```js
const res = await fetch('http://localhost:8000/search?query=영화');
const data = await res.json();
```

### 5. 에러 처리
- API 호출이 실패하면 try/catch로 에러를 잡아 안내 메시지를 띄웁니다.
```js
try {
  const results = await searchFiltered(query);
  renderResults(results);
} catch (e) {
  alert('검색 중 오류 발생: ' + e.message);
}
```

### 6. 파일 위치와 경로
- HTML에서 JS를 불러올 때 경로가 맞아야 합니다.
  - 예: `public/search.html` → `src/pages/search.js` → `src/api/search.js`
- import 경로는 항상 현재 파일 기준 상대경로로 작성합니다.

### 7. 슬라이더/추천 등 다른 API도 동일 패턴
- 예시: 메인 추천 슬라이더
```js
// src/pages/main.js
import { fetchTopRecommendations } from '../api/recommendation_test.js';

async function initSlider() {
  const items = await fetchTopRecommendations();
  renderSlider(document.getElementById('top-slider'), items);
}

function renderSlider(container, items) {
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.asset_nm;
    container.appendChild(div);
  });
}
```

---

이렇게 하면 HTML, CSS만 알던 사람도 자바스크립트로 API를 불러와서 실제로 데이터를 화면에 그릴 수 있습니다. 궁금한 점이 있으면 언제든 질문하세요!

---

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

## 2. 데이터 모델 (assets 테이블 최신화)

### Asset 모델 (최신 DDL 기준)
```python
class Asset(Base):
    __tablename__ = "assets"
    idx = Column(Integer, primary_key=True)
    full_asset_id = Column(Text, unique=True, nullable=False)
    unique_asset_id = Column(Text, nullable=False)
    asset_nm = Column(Text, nullable=False)
    super_asset_nm = Column(Text, nullable=False)
    actr_disp = Column(Text, nullable=True)
    genre = Column(Text, nullable=True)
    degree = Column(Integer, nullable=True)
    asset_time = Column(Integer, nullable=True)
    rlse_year = Column(BigInteger, nullable=True)
    smry = Column(Text, nullable=True)
    epsd_no = Column(Integer, default=0, nullable=False)
    is_adult = Column(Boolean, default=False, nullable=False)
    is_movie = Column(Boolean, default=False, nullable=False)
    is_drama = Column(Boolean, default=False, nullable=False)
    is_main = Column(Boolean, default=False, nullable=False)
    keyword = Column(Text, nullable=True)
    poster_path = Column(Text, nullable=True)
    smry_shrt = Column(Text, nullable=True)
```

- 주요 변경점:
  - rlse_year: Integer → BigInteger
  - smry_shrt: 컬럼 추가
  - 각 컬럼의 nullable/default/unique 조건 DDL과 일치

### API 응답 예시 (assets)
```json
{
  "items": [
    {
      "idx": 1,
      "full_asset_id": "movie-1",
      "unique_asset_id": "unique-1",
      "asset_nm": "영화 제목",
      "super_asset_nm": "상위 영화 제목",
      "actr_disp": "배우1, 배우2",
      "genre": "드라마",
      "degree": 12,
      "asset_time": 120,
      "rlse_year": 2023,
      "smry": "상세 설명 ...",
      "epsd_no": 0,
      "is_adult": false,
      "is_movie": true,
      "is_drama": false,
      "is_main": true,
      "keyword": "감동, 힐링",
      "poster_path": "/images/poster1.jpg",
      "smry_shrt": "짧은 요약 ..."
    }
  ]
}
```

- 모든 API 응답/예시/모델 설명에서 위 필드가 반영되어야 하며, 누락된 필드는 추가, 타입/옵션은 DDL과 일치하게 고쳐야 합니다.

### 쿼리 예시 (assets)
```sql
SELECT 
    idx, full_asset_id, unique_asset_id, asset_nm, super_asset_nm, actr_disp, genre, degree, asset_time, rlse_year, smry, epsd_no, is_adult, is_movie, is_drama, is_main, keyword, poster_path, smry_shrt
FROM assets
WHERE ...
```

---

# 이하 기존 내용 유지 (엔드포인트, 사용법 등)

## 3. 성능 최적화

### 캐싱 전략
- 이미지 URL은 CDN을 통해 제공
- 데이터베이스 쿼리 결과 캐싱
- 프론트엔드에서 이미지 lazy loading 구현

### 에러 처리
- API 오류 시 사용자 친화적인 메시지 표시
- 네트워크 오류 시 자동 재시도
- 더미 데이터를 통한 우아한 실패 처리

# /client/public 폴더 구조 및 전체적인 프론트엔드 흐름

## 폴더/파일 구조