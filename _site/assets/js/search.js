document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const tagSelect = document.getElementById('tag-select');
  const dateInput = document.getElementById('date-input');
  const resultsContainer = document.getElementById('search-results');

  // 更改為從統一的 all-content.json 獲取資料
  // Change to fetch data from the unified all-content.json
  async function fetchData() {
    const allContent = await fetch('/content-json/all-content.json').then(res => res.json());
    // 返回一個包含所有內容的結構，方便後續篩選
    // Return a structure containing all content for easier filtering
    return { all: allContent };
  }

  function displayResults(results) {
    resultsContainer.innerHTML = '';
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p class="text-center text-gray-600">找不到相關內容。</p>';
      return;
    }
    results.forEach(item => {
      const div = document.createElement('div');
      div.className = 'card';
      // 根據內容類型調整連結和圖片來源
      // Adjust links and image sources based on content type
      let itemUrl = item.url;
      let itemImage = item.image || ''; // 預設為空字串，如果沒有圖片
                                        // Default to empty string if no image
      let itemDescription = item.description;

      if (item.category === 'faqs') {
          itemUrl = item.url; // FAQ 連結可能是錨點
                              // FAQ link might be an anchor
          itemImage = '/assets/images/faq-default.webp'; // FAQ 的預設圖片
                                                         // Default image for FAQ
          itemDescription = item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description;
      } else if (item.category === 'videos' && !itemImage) {
          itemImage = '/assets/images/videos/default-video-thumbnail.webp'; // 影片的預設圖片
                                                                             // Default image for videos
      } else if (item.category === 'downloads' && !itemImage) {
          itemImage = '/assets/images/downloads/default-download-thumbnail.webp'; // 下載的預設圖片
                                                                                 // Default image for downloads
      }

      div.innerHTML = `
        <a href="${itemUrl}" class="block">
          ${itemImage ? `<img src="${itemImage}" alt="${item.title}" class="w-full h-32 object-cover rounded-t-lg">` : ''}
          <div class="p-4">
            <h3 class="text-lg font-semibold">${item.title}</h3>
            <p class="text-gray-600">${itemDescription}</p>
            <p class="text-sm text-blue-600 mt-2">查看更多 &raquo;</p>
          </div>
        </a>
      `;
      resultsContainer.appendChild(div);
    });
  }

  function filterResults(data, query, category, tag, date) {
    let results = data.all.filter(item => {
      const matchesQuery = !query || 
                           item.title.includes(query) || 
                           item.description.includes(query) ||
                           (item.tags && item.tags.includes(query)); // 搜尋標籤
                                                                       // Search tags

      const matchesCategory = !category || item.category === category;
      const matchesTag = !tag || (item.tags && item.tags.includes(tag));
      const matchesDate = !date || item.date === date; // 假設日期格式一致
                                                        // Assuming consistent date format

      return matchesQuery && matchesCategory && matchesTag && matchesDate;
    });
    return results;
  }

  // 修改事件監聽器以使用新的 fetchData 和 filterResults 邏輯
  // Modify event listeners to use the new fetchData and filterResults logic
  const performSearch = async () => {
    const data = await fetchData();
    const query = searchInput.value;
    const category = categorySelect.value;
    const tag = tagSelect.value;
    const date = dateInput.value;
    const results = filterResults(data, query, category, tag, date);
    displayResults(results);
  };

  searchInput.addEventListener('input', performSearch);
  categorySelect.addEventListener('change', performSearch);
  tagSelect.addEventListener('change', performSearch);
  dateInput.addEventListener('change', performSearch);

  // 初始化搜尋結果
  // Initialize search results
  performSearch();
});
