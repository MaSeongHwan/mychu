import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './UserMenu.css';

/**
 * 사용자 메뉴 드롭다운 컴포넌트
 * 계정 설정, 내 목록, 로그아웃 등 사용자 관련 메뉴 제공
 */
const UserMenu = ({ isLoggedIn = true, username = "사용자" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 메뉴 토글
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // 로그아웃 처리
  const handleLogout = () => {
    // TODO: 실제 로그아웃 로직 구현
    console.log('로그아웃 처리');
    setIsOpen(false);
  };
  
  return (
    <div className="user-menu-container" ref={menuRef}>
      <button className="user-menu-button" onClick={toggleMenu} aria-label="사용자 메뉴">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
      
      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="menu-header">
            <span className="user-greeting">안녕하세요, {username}님</span>
          </div>
          
          <div className="menu-items">
            <Link to="/account" className="menu-item" onClick={() => setIsOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              계정 설정
            </Link>
            
            <Link to="/mylist" className="menu-item" onClick={() => setIsOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              내 보관함
            </Link>
            
            <Link to="/history" className="menu-item" onClick={() => setIsOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              시청 기록
            </Link>
            
            <div className="menu-divider"></div>
            
            <button className="menu-item logout-button" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
