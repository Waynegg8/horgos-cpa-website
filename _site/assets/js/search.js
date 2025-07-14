document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const tagSelect = document.getElementById('tag-select');
  const dateInput = document.getElementById('date-input');
  const resultsContainer = document.getElementById('search-results');

  async function fetchData() {
    const articles = await fetch('/content-json/articles.json').then(res => res.json());
    const videos = await fetch('/src/_data/videos.txt').then(res => res.text()).then(text => 
      text.split('
').filter(line => line.trim()).map(line => {
        const [title, description, url, date, category, image, clicks] = line.split('|');
        return { title, description, url, date, category, image, clicks: parseInt(clicks) || 0 };
      })
    );
    const faqs = await fetch('/faqs/all.json').then(res => res.json());
    return { articles, videos, faqs };
  }

  function displayResults(results) {
    resultsContainer.innerHTML = '';
    results.forEach(item => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="w-full h-32 object-cover rounded-t-lg">
        <div class="p-4">
          <h3 class="text-lg font-semibold">${item.title}</h3>
          <p class="text-gray-600">${item.description}</p>
        </div>
      `;
      resultsContainer.appendChild(div);
    });
  }

  function filterResults(data, query, category, tag, date) {
    let results = [];
    if (!category || category === 'articles') {
      results.push(...data.articles.filter(a => 
        a.title.includes(query) || a.description.includes(query) || 
        (tag && a.tags.includes(tag)) || (date && a.publish_date === date)
      ));
    }
    if (!category || category === 'videos') {
      results.push(...data.videos.filter(v => 
        v.title.includes(query) || v.description.includes(query) || 
        (tag && v.tags.includes(tag)) || (date && v.date === date)
      ));
    }
    if (!category || category === 'faqs') {
      results.push(...data.faqs.filter(f => 
        f.question.includes(query) || f.answer.includes(query) || 
        (tag && f.tags.includes(tag))
      ));
    }
    return results;
  }

  searchInput.addEventListener('input', async () => {
    const data = await fetchData();
    const query = searchInput.value;
    const category = categorySelect.value;
    const tag = tagSelect.value;
    const date = dateInput.value;
    const results = filterResults(data, query, category, tag, date);
    displayResults(results);
  });
});
