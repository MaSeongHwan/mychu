import React, { useEffect, useState } from 'react';

function App() {
  // 1. 상태 선언
  const [assets, setAssets] = useState([]);

  // 2. 데이터 fetch (컴포넌트 마운트 시 1회)
  useEffect(() => {
    fetch('http://127.0.0.1:8000/assets')
      .then(res => res.json())
      .then(data => {
        // 필요하다면 여기서 가공(정제) 가능
        setAssets(data);
      });
  }, []);

  return (
    <div className="landing-page">
      {/* ...기존 코드 생략... */}
      <section className="hero-section">
        {/* ...기존 코드 생략... */}
      </section>

      {/* 오늘의 인기작 Top 10 섹션 */}
      <div className="section">
        <h2>오늘의 인기작 Top 10</h2>
        <div className="slider">
          {assets.slice(0, 10).map((asset, idx) => (
            <div className="card" key={idx}>
              <strong>{asset.asset_nm || '제목 없음'}</strong><br />
              <span>{asset.genre || '장르 미상'}</span><br />
              <span>{asset.actr_disp || '출연자 정보 없음'}</span>
            </div>
          ))}
        </div>
      </div>
      {/* ...나머지 섹션... */}
    </div>
  );
}

export default App;