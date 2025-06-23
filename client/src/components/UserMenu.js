// 사용자 메뉴 관련 기능
export function initializeUserMenu() {
  const userMenuButton = document.querySelector('.user-menu-button');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (userMenuButton && userDropdown) {
    setupDropdownToggle(userMenuButton, userDropdown);
    setupClickOutside(userMenuButton, userDropdown);
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

// 로그아웃 처리
export function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // 로그아웃 로직 추가 가능
      window.location.href = '/login';
    });
  }
}
