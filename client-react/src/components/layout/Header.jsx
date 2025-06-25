import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Search from '../search/Search';
import './Header.css';

/**
 * 글로벌 헤더 컴포넌트
 * 네비게이션, 검색 및 사용자 메뉴 포함
 */
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 사용자 메뉴 토글
  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container') && dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <Link to="/main" className="logo-link">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4rQcBsBRuYpHMLGMye6UjPhh3yUBKI.png" alt="WellList" className="logo-image" />
            </Link>
            <nav className="main-nav">
              <Link to="/main" className="nav-link">홈</Link>
              <Link to="/movie" className="nav-link">영화</Link>
              <Link to="/drama" className="nav-link">드라마</Link>
              <Link to="/adult" className="nav-link">성인관</Link>
            </nav>
          </div>

          <div className="header-right">
            <Search placeholder="콘텐츠 검색..." />

            <div className="user-menu-container">
              <button className="icon-button user-menu-button" onClick={toggleDropdown}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="user-name">소금님</span>
                  </div>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="/mylist" className="dropdown-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                        마이페이지
                      </a>
                    </li>
                    <li>
                      <a href="/account" className="dropdown-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        설정
                      </a>
                    </li>
                    <li className="dropdown-divider"></li>
                    <li>
                      <a href="/" className="dropdown-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        로그아웃
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
