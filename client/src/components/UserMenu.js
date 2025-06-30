// 사용자 메뉴 관련 기능
export function initializeUserMenu() {
  const userMenuButton = document.querySelector('.user-menu-button');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (userMenuButton && userDropdown) {
    console.log('UserMenu: Initializing dropdown functionality');
    
    // Get user data from localStorage if available
    const userData = getUserData();
    updateUserInfo(userData);
    
    setupDropdownToggle(userMenuButton, userDropdown);
    setupClickOutside(userMenuButton, userDropdown);
  } else {
    console.warn('UserMenu: Could not find user menu elements');
  }
}

function setupDropdownToggle(button, dropdown) {
  button.addEventListener('click', () => {
    dropdown.classList.toggle('show');
  });
}

function setupClickOutside(button, dropdown) {
  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}

// Get user data from local storage
function getUserData() {
  try {
    const userDataString = localStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : { nick_name: '사용자' };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return { nick_name: '사용자' };
  }
}

// Update user info in the dropdown
function updateUserInfo(userData) {
  const userNameElement = document.querySelector('.user-dropdown .user-name');
  if (userNameElement) {
    userNameElement.textContent = `${userData.nick_name || '사용자'}님`;
  }
}

// 로그아웃 처리
export function setupLogout() {
  const logoutButtons = document.querySelectorAll('.dropdown-item:last-child');
  
  logoutButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Clear user data from localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      
      // Redirect to login page
      window.location.href = '/login.html';
    });
  });
}
