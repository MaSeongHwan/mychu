import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './MainLayout.css';

/**
 * 메인 레이아웃 컴포넌트
 * 모든 페이지에서 공통으로 사용되는 헤더와 푸터를 포함한 레이아웃
 */
const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
