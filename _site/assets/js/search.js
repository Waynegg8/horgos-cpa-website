document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results-container');
  const defaultContainer = document.getElementById('default-list-container');
  
  if (!searchInput) {
    return;
  }

  // ▼▼▼ 新增：從搜尋框的 data-* 屬性取得當前頁面類型 ▼▼▼
  const pageType = searchInput.dataset.pageType;
  if (!pageType) {
    console.error('Search input is missing a data-page-type attribute.');
    return;
  }
  // ▲▲▲ 新增 ▲▲▲

  let fuse;

  fetch('/search_index.json')
    .then(response => response.json())
    .then(data => {
      // ▼▼▼ 新增：根據頁面類型過濾資料 ▼▼▼
      const filteredData = data.filter(item => item.type === pageType);
      // ▲▲▲ 新增 ▲▲▲

      // 設定 Fuse.js，現在使用過濾後的資料
      const options = {
        keys: ['title', 'tags', 'excerpt'],
        includeScore: true,
        threshold: 0.4,
        minMatchCharLength: 2,
      };
      fuse = new Fuse(filteredData, options); // 使用 filteredData
    })
    .catch(error => console.error('Error fetching search index:', error));

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    // 確認 fuse 已被初始化
    if (!fuse) return;

    if (query.length < 2) {
      resultsContainer.innerHTML = '';
      resultsContainer.style.display = 'none';
      defaultContainer.style.display = 'block';
      return;
    }

    const searchResults = fuse.search(query);
    
    displayResults(searchResults);
  });

  function displayResults(results) {
    defaultContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p class="text-center text-gray-500">找不到相符的結果。</p>';
      return;
    }

    const resultsList = document.createElement('div');
    resultsList.className = 'grid grid-cols-1 gap-8';
    
    results.sort((a, b) => new Date(b.item.date) - new Date(a.item.date));

    results.forEach(({ item }) => {
      // 根據不同類型，可以產生不同的卡片樣式，但我們先用統一格式
      // 未來可以將卡片 HTML 模板化
      const cardHTML = `
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="p-6">
            <div class="uppercase tracking-wide text-sm text-brand-blue-700 font-semibold">${item.type}</div>
            <a href="${item.url}" class="block mt-1 text-lg leading-tight font-bold text-gray-900 hover:underline">${item.title}</a>
            <p class="mt-2 text-gray-500">${item.excerpt}</p>
            <div class="mt-4 text-xs text-gray-400">
              <span>${new Date(item.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      `;
      resultsList.innerHTML += cardHTML;
    });

    resultsContainer.appendChild(resultsList);
  }
});