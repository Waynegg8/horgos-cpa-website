---
layout: layouts/list.njk
title: 最新文章
permalink: /articles/
pagination:
  data: articles
  size: 6
  alias: articlesOnPage
  reverse: true # 因為我們的資料是按日期降序，為了讓分頁第一頁是最新文章，需要反轉
pageScripts:
  - https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js
  - /assets/js/search.js
---

{# 搜尋框 #}
<div class="mb-8">
  <input type="search" id="search-input" data-page-type="文章" placeholder="搜尋文章..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500">
</div>

{# 搜尋結果容器 #}
<div id="search-results-container"></div>

{# 預設的文章列表與分頁 #}
<div id="default-list-container">
  {# 文章卡片列表 #}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {# ▼▼▼ 修正點：迴圈變數現在直接就是文章物件 ▼▼▼ #}
    {% for article in articlesOnPage %}
      {% include "partials/card-article.njk" %}
    {% endfor %}
  </div>

  {# 分頁導航 #}
  <nav class="mt-12 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
    <div class="flex w-0 flex-1">{% if pagination.href.previous %}<a href="{{ pagination.href.previous }}" class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"><span class="material-icons mr-3">arrow_back</span>上一頁</a>{% endif %}</div>
    <div class="hidden md:flex">{% for pageEntry in pagination.pages %}<a href="{{ pagination.hrefs[loop.index0] }}" class="{% if page.url == pagination.hrefs[loop.index0] %}border-brand-blue-500 text-brand-blue-600{% else %}border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300{% endif %} inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium">{{ loop.index }}</a>{% endfor %}</div>
    <div class="flex w-0 flex-1 justify-end">{% if pagination.href.next %}<a href="{{ pagination.href.next }}" class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">下一頁<span class="material-icons ml-3">arrow_forward</span></a>{% endif %}</div>
  </nav>
</div>