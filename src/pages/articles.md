<main>
  {# 搜尋欄 #}
  <div class="search-bar-wrapper">
    {% include "partials/search-bar.njk" %} {# 您的搜尋欄 partial #}
  </div>

  <div class="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
    {# 初始內容區塊 (無搜尋時顯示) #}
    <div id="initial-content-container" class="w-full lg:w-3/4">
      {# 這裡放置文章總覽的原始內容，例如 Eleventy Collection 的分頁迴圈 #}
      {# 這是 Eleventy 生成的原始文章列表 #}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {% for article in collections.articles %} {# 假設 Eleventy 已經為您設定了分頁 #}
          {% include "partials/card-article.njk", item: article %}
        {% endfor %}
      </div>
      {# Eleventy 內建的分頁控制（如果 collections.articles 是分頁集合）#}
      {% include "partials/pagination.njk" %}
    </div>

    {# 搜尋結果顯示區塊 (有搜尋時顯示) #}
    <div id="search-results-container" class="w-full lg:w-3/4 hidden" data-page-type="articles" data-items-per-page="10">
      {# 這裡的內容將由 search.js 動態填充 #}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {# 搜尋結果卡片將在這裡由 JavaScript 插入 #}
      </div>
    </div>

    {# 側邊欄 #}
    <aside class="w-full lg:w-1/4 lg:sticky lg:top-8 self-start">
      {% include "partials/sidebar.njk" %} {# 您的側邊欄 partial #}
    </aside>
  </div>

  {# 分頁按鈕容器 (由 search.js 控制) #}
  <div id="pagination-container" class="mt-8">
    {# 分頁按鈕將由 JavaScript 插入 #}
  </div>
</main>