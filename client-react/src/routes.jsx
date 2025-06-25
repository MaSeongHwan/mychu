import { Route, Routes, Navigate } from 'react-router-dom';

// 페이지 컴포넌트 가져오기
import HomePage from './pages/home/HomePage';
import SearchPage from './pages/search/SearchPage';
import MoviePage from './pages/movie/MoviePage';
import DramaPage from './pages/drama/DramaPage';
import MyListPage from './pages/mylist/MyListPage';
import AccountPage from './pages/account/AccountPage';
import ContentDetailsPage from './pages/contents/ContentDetailsPage';

// 레이아웃 컴포넌트
import MainLayout from './components/layout/MainLayout';

/**
 * 애플리케이션 경로 정의
 * 레이아웃 구성요소와 함께 모든 경로를 정의
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* 메인 레이아웃이 적용된 경로 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie" element={<MoviePage />} />
        <Route path="/drama" element={<DramaPage />} />
        <Route path="/mylist" element={<MyListPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/content/:id" element={<ContentDetailsPage />} />
      </Route>
      
      {/* 레이아웃이 없는 특수 경로 또는 리다이렉션 */}
      <Route path="/login" element={<Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
