import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SliderApp from './SliderApp';
import Slider from './components/Slider';
import Home from './pages/Home';

// Sample data for demonstration
const sampleItems = [
  {
    idx: '1',
    asset_nm: '샘플 영화 1',
    genre: '액션',
    poster_path: 'https://placehold.co/300x450?text=Movie+1'
  },
  {
    idx: '2',
    asset_nm: '샘플 영화 2',
    genre: '드라마',
    poster_path: 'https://placehold.co/300x450?text=Movie+2'
  },
  {
    idx: '3',
    asset_nm: '샘플 영화 3',
    genre: '코미디',
    poster_path: 'https://placehold.co/300x450?text=Movie+3'
  },
  {
    idx: '4',
    asset_nm: '샘플 영화 4',
    genre: '스릴러',
    poster_path: 'https://placehold.co/300x450?text=Movie+4'
  },
  {
    idx: '5',
    asset_nm: '샘플 영화 5',
    genre: 'SF',
    poster_path: 'https://placehold.co/300x450?text=Movie+5'
  },
  {
    idx: '6',
    asset_nm: '샘플 영화 6',
    genre: '로맨스',
    poster_path: 'https://placehold.co/300x450?text=Movie+6'
  },
  {
    idx: '7',
    asset_nm: '샘플 영화 7',
    genre: '판타지',
    poster_path: 'https://placehold.co/300x450?text=Movie+7'
  }
];

function App() {
  const [mode, setMode] = useState('full'); // 'full', 'single', 'demo'

  return (
    <Router>
      <Routes>
        {/* 새로운 React 홈페이지 라우트 */}
        <Route path="/react" element={<Home />} />
        
        {/* 컴포넌트 개발 및 테스트 페이지 */}
        <Route path="/components" element={
          <div className="app-container">
            <header className="app-header">
              <h1>WellList React 컴포넌트</h1>
              <div className="mode-selector">
                <button 
                  onClick={() => setMode('full')}
                  className={mode === 'full' ? 'active' : ''}
                >
                  전체 슬라이더 앱
                </button>
                <button 
                  onClick={() => setMode('single')}
                  className={mode === 'single' ? 'active' : ''}
                >
                  단일 슬라이더
                </button>
                <button 
                  onClick={() => setMode('demo')}
                  className={mode === 'demo' ? 'active' : ''}
                >
                  데모 슬라이더
                </button>
              </div>
            </header>

            <main className="app-content">
              {mode === 'full' && (
                <div className="full-app-mode">
                  <h2>전체 슬라이더 앱</h2>
                  <p>이 모드는 다양한 종류의 콘텐츠 슬라이더를 화면에 표시합니다.</p>
                  <SliderApp />
                </div>
              )}
              
              {mode === 'single' && (
                <div className="single-slider-mode">
                  <h2>단일 슬라이더</h2>
                  <p>이 모드는 하나의 슬라이더 컴포넌트만 표시합니다. 이 컴포넌트는 기존 HTML 페이지에 삽입하여 사용할 수 있습니다.</p>
                  <div id="react-slider-mount" data-title="단일 슬라이더 예시">
                    <Slider items={sampleItems} title="단일 슬라이더 예시" />
                  </div>
                </div>
              )}
              
              {mode === 'demo' && (
                <div className="demo-mode">
                  <h2>데모 슬라이더</h2>
                  <p>이 모드는 샘플 데이터를 사용한 슬라이더의 동작을 보여줍니다.</p>
                  <Slider items={sampleItems} title="샘플 콘텐츠" sliderId="demo-slider" />
                </div>
              )}
            </main>

            <footer className="app-footer">
              <p>WellList React 컴포넌트 | 2025</p>
            </footer>
          </div>
        } />
        
        {/* 기본 경로 - 홈페이지로 리다이렉트 */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
