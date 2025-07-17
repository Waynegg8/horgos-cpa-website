// src/assets/js/search.js

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results-container'); // 這個元素會包含搜尋結果
    const paginationContainer = document.getElementById('pagination-container'); // 這個元素會包含分頁按鈕
    const initialContentContainer = document.getElementById('initial-content-container'); // 預設的內容顯示區塊 (在無搜尋時顯示)

    // 從 HTML 元素的 data 屬性中獲取每頁顯示的項目數
    const itemsPerPage = parseInt(searchResultsContainer.dataset.itemsPerPage || 10, 10);
    let allSearchableItems = []; // 儲存所有可搜尋的資料
    let currentFilteredItems = []; // 儲存當前篩選（搜尋）後的資料
    let currentPage = 1; // 當前頁碼

    // 根據頁面類型載入對應的搜尋索引
    const pageType = searchResultsContainer.dataset.pageType; // 從 HTML 獲取頁面類型，例如 'articles', 'videos', 'downloads', 'faqs'

    if (!pageType) {
        console.error("Search results container must have a 'data-page-type' attribute.");
        return;
    }

    // 載入搜尋索引
    fetch('/search_index.json')
        .then(response => response.json())
        .then(data => {
            // 根據 pageType 過濾資料
            allSearchableItems = data.filter(item => item.type === pageType);
            
            // 確保搜尋索引按發布日期降序排列作為次要排序條件
            allSearchableItems.sort((a, b) => new Date(b.date) - new Date(a.date));

            // 初始化時顯示全部內容（如果沒有搜尋詞）
            displayResults(allSearchableItems);

            // 如果有 hash，且是 FAQ 頁面，自動展開對應項目
            if (pageType === 'faqs' && window.location.hash) {
                const targetId = window.location.hash.substring(1); // 移除 #
                const targetFaq = document.getElementById(targetId);
                if (targetFaq && targetFaq.tagName === 'DETAILS') {
                    // 先收合所有 FAQ
                    document.querySelectorAll('.faq-item details').forEach(detail => {
                        detail.removeAttribute('open');
                    });
                    // 然後展開目標 FAQ
                    targetFaq.setAttribute('open', '');
                    targetFaq.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        })
        .catch(error => console.error('Error loading search index:', error));

    // 顯示結果函數 (包含分頁邏輯)
    const displayResults = (items) => {
        currentFilteredItems = items;
        const totalPages = Math.ceil(currentFilteredItems.length / itemsPerPage);

        // 如果搜尋框有內容，隱藏初始內容，顯示搜尋結果容器
        if (searchInput.value.trim().length > 0) {
            if (initialContentContainer) initialContentContainer.classList.add('hidden');
            searchResultsContainer.classList.remove('hidden');
        } else {
            // 如果搜尋框為空，顯示初始內容，隱藏搜尋結果容器
            if (initialContentContainer) initialContentContainer.classList.remove('hidden');
            searchResultsContainer.classList.add('hidden');
        }
        
        // 清空之前的結果
        searchResultsContainer.innerHTML = '';
        paginationContainer.innerHTML = '';

        if (currentFilteredItems.length === 0 && searchInput.value.trim().length > 0) {
            searchResultsContainer.innerHTML = '<p class="text-gray-600 text-center py-8">抱歉，沒有找到符合您搜尋條件的結果。</p>';
            return;
        }

        // 根據當前頁碼顯示結果
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToDisplay = currentFilteredItems.slice(startIndex, endIndex);

        // 渲染結果 - 這裡需要根據您的卡片模板來動態生成 HTML
        // 以下是概念性的 HTML 生成，您需要根據實際的 Nunjucks partials 來調整
        // 例如，您可以為每種 pageType 定義一個渲染函數
        itemsToDisplay.forEach(item => {
            let itemHtml = '';
            // 這裡簡化生成 HTML，實際應用中應使用更健壯的模板方法 (例如 Eleventy shortcodes 或 Nunjucks partials)
            // 假設這裡使用了一個簡單的卡片結構
            if (pageType === 'articles') {
                itemHtml = `
                    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                        <a href="/article/${item.slug}/">
                            <img src="${item.thumbnail_image_path || '/assets/images/default-article.jpg'}" alt="${item.thumbnail_image_alt_text || item.title}" class="w-full h-48 object-cover">
                        </a>
                        <div class="p-6">
                            <h3 class="text-xl font-heading font-bold text-brand-blue-700 mb-2"><a href="/article/${item.slug}/" class="hover:underline">${item.title}</a></h3>
                            <p class="text-gray-600 text-sm mb-3">${new Date(item.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p class="text-gray-700 text-base line-clamp-3">${item.excerpt}</p>
                        </div>
                    </div>
                `;
            } else if (pageType === 'videos') {
                 itemHtml = `
                    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                        <a href="/video/${item.slug}/">
                            <img src="${item.thumbnailUrl || '/assets/images/default-video.jpg'}" alt="${item.title}" class="w-full h-48 object-cover">
                        </a>
                        <div class="p-6">
                            <h3 class="text-xl font-heading font-bold text-brand-blue-700 mb-2"><a href="/video/${item.slug}/" class="hover:underline">${item.title}</a></h3>
                            <p class="text-gray-600 text-sm mb-3">${new Date(item.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p class="text-gray-700 text-base line-clamp-3">${item.excerpt}</p>
                        </div>
                    </div>
                `;
            } else if (pageType === 'downloads') {
                 itemHtml = `
                    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                        <h3 class="text-xl font-heading font-bold text-brand-blue-700 mb-2"><a href="${item.downloadUrl}" target="_blank" class="hover:underline">${item.title}</a></h3>
                        <p class="text-gray-600 text-sm mb-3">${new Date(item.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p class="text-gray-700 text-base line-clamp-3">${item.excerpt}</p>
                        <a href="${item.downloadUrl}" target="_blank" class="mt-4 inline-flex items-center text-brand-blue-600 hover:text-brand-blue-800 font-semibold">
                            立即下載 <span class="material-icons ml-1 text-lg">download</span>
                        </a>
                    </div>
                `;
            } else if (pageType === 'faqs') {
                // FAQ 項目假設使用 details/summary 結構，並需特別處理分享按鈕
                itemHtml = `
                    <div class="faq-item bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <details id="faq-item-${item.id}">
                            <summary class="flex justify-between items-center cursor-pointer text-xl font-heading font-semibold text-brand-blue-700">
                                ${item.question}
                                <span class="material-icons ml-2">expand_more</span>
                            </summary>
                            <div class="prose max-w-none text-gray-800 mt-4 pt-4 border-t border-gray-200">
                                ${item.answer}
                            </div>
                            <div class="mt-4 text-right">
                                <button class="share-faq-btn bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-sm py-2 px-4 rounded-md transition-colors duration-200" data-faq-id="${item.id}" data-faq-question="${item.question}">
                                    分享此問答
                                </button>
                            </div>
                        </details>
                    </div>
                `;
            }
            searchResultsContainer.insertAdjacentHTML('beforeend', itemHtml);
        });

        // 渲染分頁按鈕
        renderPagination(totalPages);

        // 如果是 FAQ 頁面，重新綁定分享按鈕事件
        if (pageType === 'faqs') {
            bindFaqShareButtons();
        }
    };

    // 渲染分頁按鈕函數
    const renderPagination = (totalPages) => {
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHtml = '<nav class="flex justify-center items-center space-x-2 mt-8">';

        // Previous button
        paginationHtml += `
            <button class="pagination-btn bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
                <span class="material-icons">chevron_left</span>
            </button>
        `;

        // Page numbers
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            paginationHtml += `<button class="pagination-btn bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHtml += `<span class="px-2">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <button class="pagination-btn py-2 px-4 rounded-lg transition-colors duration-200 ${currentPage === i ? 'bg-brand-blue-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += `<span class="px-2">...</span>`;
            }
            paginationHtml += `<button class="pagination-btn bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200" data-page="${totalPages}">${totalPages}</button>`;
        }


        // Next button
        paginationHtml += `
            <button class="pagination-btn bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
                <span class="material-icons">chevron_right</span>
            </button>
        `;

        paginationHtml += '</nav>';
        paginationContainer.innerHTML = paginationHtml;

        // 為新的分頁按鈕添加事件監聽器
        paginationContainer.querySelectorAll('.pagination-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const newPage = parseInt(e.currentTarget.dataset.page, 10);
                if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
                    currentPage = newPage;
                    displayResults(currentFilteredItems);
                    // 平滑捲動到結果頂部
                    searchResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    };

    // 搜尋輸入框事件監聽
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            currentPage = 1; // 搜尋時重置頁碼

            if (query === '') {
                // 如果搜尋框為空，顯示所有項目 (或初始內容)
                displayResults(allSearchableItems);
            } else {
                const filtered = allSearchableItems.filter(item =>
                    item.title.toLowerCase().includes(query) ||
                    item.excerpt.toLowerCase().includes(query) ||
                    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) ||
                    (item.question && item.question.toLowerCase().includes(query)) || // For FAQs
                    (item.answer && item.answer.toLowerCase().includes(query)) // For FAQs
                );

                // 搜尋結果預設按相關性（匹配度）降序排列，次要條件按發布日期降序。
                filtered.sort((a, b) => {
                    let scoreA = 0;
                    let scoreB = 0;

                    const searchFields = ['title', 'excerpt', 'question', 'answer'];
                    searchFields.forEach(field => {
                        if (a[field] && a[field].toLowerCase().includes(query)) scoreA++;
                        if (b[field] && b[field].toLowerCase().includes(query)) scoreB++;
                    });
                    if (a.tags) a.tags.forEach(tag => { if (tag.toLowerCase().includes(query)) scoreA++; });
                    if (b.tags) b.tags.forEach(tag => { if (tag.toLowerCase().includes(query)) scoreB++; });

                    if (scoreA !== scoreB) {
                        return scoreB - scoreA; // 按相關性降序
                    }
                    // 次要條件按發布日期降序
                    return new Date(b.date) - new Date(a.date);
                });

                displayResults(filtered);
            }
        });
    }

    // 將 FAQ 分享按鈕的邏輯從 faq-toggle.js 整合過來，確保在動態生成內容後也能綁定事件
    const bindFaqShareButtons = () => {
        document.querySelectorAll('.share-faq-btn').forEach(button => {
            button.onclick = null; // 避免重複綁定
            button.addEventListener('click', () => {
                const faqId = button.dataset.faqId;
                const faqQuestion = button.dataset.faqQuestion;
                const faqUrl = `${window.location.origin}/faq/#faq-item-${faqId}`; // 假設 FAQ 頁面路徑

                // Line 分享 URL
                const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(faqUrl)}&text=${encodeURIComponent(faqQuestion)}`;
                
                window.open(lineShareUrl, '_blank');
            });
        });
    };
});