// 搜尋功能腳本
// 使用 Fuse.js 執行模糊搜尋

document.addEventListener('DOMContentLoaded', () => {
  // 搜尋資料集
  const searchData = [
    {
      title: '申請公司設立流程與注意事項',
      description: '創業初期常見的公司設立申請流程說明及應注意事項。',
      url: '/services/registration/'
    },
    {
      title: '節稅策略：如何利用新創優惠政策',
      description: '介紹政府針對新創企業提供的各類稅務優惠與節稅策略。',
      url: '/articles/'
    },
    {
      title: '當年度營所稅申報全攻略',
      description: '解說公司所得稅申報流程、文件準備與常見錯誤。',
      url: '/videos/sample/'
    },
    {
      title: '創業者必讀：勞健保投保與費率介紹',
      description: '對於首次創業者，瞭解勞保與健保的投保方式及費率計算方法。',
      url: '/faq/'
    },
    {
      title: '公司成立後的財務管理重點',
      description: '公司設立完成後如何建立財務制度並進行帳務管理。',
      url: '/services/advisory/'
    }
  ];

  // 初始化 Fuse.js
  const fuse = new Fuse(searchData, {
    keys: ['title', 'description'],
    threshold: 0.4,
    includeScore: true
  });

  const inputEl = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');

  if (inputEl && resultsEl) {
    inputEl.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      // 清空當前結果
      resultsEl.innerHTML = '';
      if (query.length === 0) {
        return;
      }
      const results = fuse.search(query);
      if (results.length === 0) {
        const p = document.createElement('p');
        p.textContent = '沒有找到相關結果。';
        resultsEl.appendChild(p);
        return;
      }
      // 顯示前 10 筆搜尋結果
      results.slice(0, 10).forEach(({ item }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.title;
        const desc = document.createElement('p');
        desc.textContent = item.description;
        li.appendChild(a);
        li.appendChild(desc);
        resultsEl.appendChild(li);
      });
    });
  }
});