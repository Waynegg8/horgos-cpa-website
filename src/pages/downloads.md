---
layout: layouts/list.njk
title: 資源下載
permalink: /downloads/
pagination:
  data: downloads
  size: 10
  alias: downloadsOnPage
pageScripts:
  - https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js
  - /assets/js/search.js
---

{# 搜尋框 #}
<div class="mb-8">
  <input type="search" id="search-input" data-page-type="下載" placeholder="搜尋資源..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500">
</div>

{# 搜尋結果容器 #}
<div id="search-results-container"></div>

{# 預設的下載列表與分頁 #}
<div id="default-list-container">
  <div class="space-y-6">
    {% for item in downloadsOnPage %}
      <div class="p-6 bg-white rounded-xl shadow-md flex items-center justify-between space-x-4">
        <div class="flex-1">
          <h3 class="font-bold text-lg text-gray-900">{{ item.title }}</h3>
          <p class="text-gray-500 mt-1">{{ item.excerpt }}</p>
          <p class="text-xs text-gray-400 mt-2">發布日期：{{ item.date | formatDate }}</p>
        </div>
        <div class="flex-shrink-0">
          <a href="{{ item.downloadUrl }}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue-700 hover:bg-brand-blue-800">
            <span class="material-icons mr-2">download</span>
            下載
          </a>
        </div>
      </div>
    {% endfor %}
  </div>

  {# 分頁導航 (與 articles.md 相同) #}
  <nav class="mt-12 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
    <div class="flex w-0 flex-1">{% if pagination.href.previous %}<a href="{{ pagination.href.previous }}" class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"><span class="material-icons mr-3">arrow_back</span>上一頁</a>{% endif %}</div>
    <div class="hidden md:flex">{% for pageEntry in pagination.pages %}<a href="{{ pagination.hrefs[loop.index0] }}" class="{% if page.url == pagination.hrefs[loop.index0] %}border-brand-blue-500 text-brand-blue-600{% else %}border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300{% endif %} inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium">{{ loop.index }}</a>{% endfor %}</div>
    <div class="flex w-0 flex-1 justify-end">{% if pagination.href.next %}<a href="{{ pagination.href.next }}" class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">下一頁<span class="material-icons ml-3">arrow_forward</span></a>{% endif %}</div>
  </nav>
</div>