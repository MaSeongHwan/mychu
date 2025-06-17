// client/src/components/Dropdown.js

export function initDropdown() {
  console.log('Initializing dropdown...');
  
  const dropdownBtn = document.querySelector('.dropdown-btn');
  const dropdownContent = document.querySelector('.dropdown-content');

  if (!dropdownBtn || !dropdownContent) {
    console.error('Dropdown elements not found:', { dropdownBtn, dropdownContent });
    return;
  }

  console.log('Dropdown elements found:', { dropdownBtn, dropdownContent });

  function toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Dropdown button clicked');
    
    const isOpen = dropdownContent.classList.contains('show');
    console.log('Current dropdown state:', isOpen ? 'open' : 'closed');
    
    if (isOpen) {
      dropdownContent.classList.remove('show');
      console.log('Dropdown closed');
    } else {
      dropdownContent.classList.add('show');
      console.log('Dropdown opened');
    }
  }

  function closeDropdown(event) {
    if (!dropdownBtn.contains(event.target) && !dropdownContent.contains(event.target)) {
      dropdownContent.classList.remove('show');
      console.log('Dropdown closed by outside click');
    }
  }

  dropdownBtn.addEventListener('click', toggleDropdown);
  document.addEventListener('click', closeDropdown);
} 