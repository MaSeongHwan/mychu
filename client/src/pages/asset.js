import React, { useEffect, useState } from 'react';
import { fetchAssets } from './api/requests';

function App() {
  // 1. 상태 선언
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. 데이터 fetch (컴포넌트 마운트 시 1회)
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await fetchAssets();
        setAssets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className="landing-page">
      <section className="hero-section">
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