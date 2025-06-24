// /src/components/loadHeader.js
export async function loadHeader() {
  const res = await fetch('/components/header.html');
  const html = await res.text();

  const temp = document.createElement('div');
  temp.innerHTML = html;

  // header 삽입
  const headerElement = temp.querySelector('header');
  if (headerElement) {
    document.body.insertBefore(headerElement, document.body.firstChild);
  }

  // CSS도 동적으로 로딩 (중복 방지)
  const cssPath = '/components/header.css';
  if (!document.querySelector(`link[href="${cssPath}"]`)) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = cssPath;
    document.head.appendChild(css);
  }
}

function renderSuggestions(results, container, query) {
  container.innerHTML = '';
  results.forEach(item => {
    const thumbnail = item.poster_path || 'https://via.placeholder.com/40x60?text=No+Image';
    const html = `
      <div class="suggestion-item" data-id="${item.idx}">
        <img src="${thumbnail}" alt="Poster" />
        <div class="item-info">
          <div class="item-title">${item.super_asset_nm || ''}</div>
          <div class="item-meta">${item.genre || ''}</div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

loadHeader().then(() => {
  const searchInput = document.querySelector('.search-input');
  const suggestionsContainer = document.getElementById('search-suggestions');

  searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length < 1) {
      suggestionsContainer.innerHTML = '';
      return;
    }

    const res = await fetch(`/search?query=${encodeURIComponent(query)}&limit=10`);
    if (!res.ok) {
      suggestionsContainer.innerHTML = '<div class="suggestion-item">검색 결과를 불러올 수 없습니다.</div>';
      return;
    }
    const data = await res.json();
    if (!data.results) {
      suggestionsContainer.innerHTML = '<div class="suggestion-item">검색 결과가 없습니다.</div>';
      return;
    }
    renderSuggestions(data.results, suggestionsContainer, query);
  });
});
