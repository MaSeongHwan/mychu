// 슬라이더 렌더링 관련 기능
export async function renderSlider(slider, items) {
  slider.innerHTML = '';
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';

  for (const item of items) {
    const card = await createCard(item);
    cardContainer.appendChild(card);
  }

  slider.appendChild(cardContainer);
}

// 카드 생성 함수
async function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  
  const posterPath = await loadImage(item.poster_path);
  
  card.innerHTML = `
    <img src="${posterPath}" 
         alt="${item.asset_nm}" 
         loading="lazy" />
    <div class="card-info">
      <h3 class="card-title">${item.asset_nm}</h3>
    </div>
  `;

  // 여기서 item.id를 활용해서 이동
  card.addEventListener('click', () => {
    window.location.href = `/contents?id=${item.id}`;
  });

  return card;
}

// 이미지 로드 체크
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve('https://via.placeholder.com/300x450?text=No+Image');
    img.src = src || 'https://via.placeholder.com/300x450?text=No+Image';
  });
}
