<script src="../src/main.js"></script>

const sliderConfigs = [
  { selector: '오늘의 인기작', type: 'movie' },
  { selector: '감정 기반', type: 'emotion' },
  { selector: '최근 시청', type: 'recent' }
];

sliderConfigs.forEach(cfg => {
  const section = Array.from(document.querySelectorAll('.section')).find(
    sec => sec.querySelector('h2')?.textContent.includes(cfg.selector)
  );
  const slider = section?.querySelector('.slider');
  if (!slider) return;
//   fetch(`http://localhost:8000/recommendations/random?count=10&type=${cfg.type}`)
//     .then(res => res.json())
//     .then(data => {
//       slider.innerHTML = '';
//       data.forEach(item => {
//         const card = document.createElement('div');
//         card.className = 'card';
//         card.innerHTML = `
//           <img src="${item.poster_path}" alt="${item.asset_nm}" />
//           <div class="info">
//             <div class="title">${item.asset_nm}</div>
//             <div class="genre">${item.genre}</div>
//             <div class="director">${item.actr_disp}</div>
//           </div>
//         `;
//         slider.appendChild(card);
//       });
//     });
// });

// main.js

document.addEventListener("DOMContentLoaded", () => {
  const mypageButton = document.getElementById('mypageButton');
  const mypageMenu = document.getElementById('mypageMenu');
  const mypageWrapper = document.querySelector('.mypage-wrapper');

  console.log('mypageButton:', mypageButton);  // 로그 추가
  console.log('mypageMenu:', mypageMenu);      // 로그 추가

  // 마우스 올렸을 때 메뉴 열기
  mypageButton.addEventListener('mouseenter', () => {
    console.log('마우스 들어옴');
    mypageMenu.style.display = 'block';
  });

  // 마우스 떠나면 메뉴 닫기
  mypageWrapper.addEventListener('mouseleave', () => {
    console.log('마우스 나감');
    mypageMenu.style.display = 'none';
  });
});
