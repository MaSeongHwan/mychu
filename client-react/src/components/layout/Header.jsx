import { useState, useEffect } from 'react';
import './Header.css';

/**
 * 글로벌 헤더 컴포넌트
 * 네비게이션, 검색 및 사용자 메뉴 포함
 */
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 검색어 변경 시 API 호출 및 결과 표시
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      try {
        // FastAPI 서버 엔드포인트 호출
        const response = await fetch(`/search/autocomplete?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('검색 결과 로드 실패:', error);
      }
    };

    // API 호출 지연 (디바운스)
    const debounceTimer = setTimeout(fetchSearchResults, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // 사용자 메뉴 토글
  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  // 검색창 외부 클릭 시 결과 숨김
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
      if (!e.target.closest('.user-menu-container') && dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // 검색 결과 항목 클릭 시 콘텐츠 페이지로 이동
  const handleResultClick = (id) => {
    window.location.href = `/contents?id=${id}`;
  };

  // 검색어 입력 시 실행
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 검색 폼 제출 시 검색 페이지로 이동
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <a href="/main" className="logo-link">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4rQcBsBRuYpHMLGMye6UjPhh3yUBKI.png" alt="WellList" className="logo-image" />
            </a>
            <nav className="main-nav">
              <a href="/main" className="nav-link">홈</a>
              <a href="/movie" className="nav-link">영화</a>
              <a href="/drama" className="nav-link">드라마</a>
              <a href="/adult" className="nav-link">성인관</a>
            </nav>
          </div>

          <div className="header-right">
            <form className="search-container" onSubmit={handleSearchSubmit}>
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="콘텐츠 검색..." 
                className="search-input" 
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off" 
                autoCorrect="off" 
                autoCapitalize="off" 
                spellCheck="false"
              />
              
              {showSuggestions && searchResults.length > 0 && (
                <div className="search-suggestions">
                  {searchResults.map(item => (
                    <div 
                      key={item.idx} 
                      className="suggestion-item"
                      onClick={() => handleResultClick(item.idx)}
                    >
                      {item.poster_path && (
                        <img 
                          src={item.poster_path} 
                          alt={item.asset_nm || item.super_asset_nm} 
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40x60?text=No+Image' }}
                        />
                      )}
                      <div className="item-info">
                        <div className="item-title">{item.asset_nm || item.super_asset_nm}</div>
                        <div className="item-meta">{item.genre || ''} {item.rlse_year ? `(${item.rlse_year})` : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>

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
