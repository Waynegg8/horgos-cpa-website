---
layout: layouts/videos.njk
title: 影片總覽
permalink: /videos/
description: 觀看我們的財稅教學影片
pagination:
  data: collections.videosPaginated # Reverted to use pagination for individual video pages
  size: 10
  alias: items
structuredData: |
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "影片總覽",
    "description": "觀看我們的財稅教學影片"
  }
---
<h1>影片總覽</h1>
<div class="mb-8">
  <input type="text" id="search-input" placeholder="搜尋文章、影片或常見問題..." class="p-2 border rounded-md w-full mb-4">
  <div class="flex space-x-4">
    <select id="category-select" class="p-2 border rounded-md">
      <option value="">所有分類</option>
      <option value="articles">文章</option>
      <option value="videos">影片</option>
      <option value="faqs">常見問題</option>
    </select>
    <select id="tag-select" class="p-2 border rounded-md">
      <option value="">所有標籤</option>
      <option value="記帳技巧">記帳技巧</option>
      <option value="公司設立">公司設立</option>
      <option value="稅務">稅務</option>
    </select>
    <input type="date" id="date-input" class="p-2 border rounded-md">
  </div>
  <div id="search-results" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"></div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {% for item in items %} {# Loop through paginated collection items #}
    <a href="{{ item.url }}" class="card" data-track="video:{{ item.data.slug }}">
      <img src="{{ item.data.image or '/assets/images/videos/default-video-thumbnail.webp' }}" alt="{{ item.data.title }}" class="w-full h-48 object-cover rounded-t-lg">
      <div class="p-4">
        <h3 class="text-lg font-semibold">{{ item.data.title }}</h3>
        <p class="text-gray-600">{{ item.data.description }}</p>
      </div>
    </a>
  {% endfor %}
</div>

  <div class="pagination">
    {% if pagination.previousPageLink %}
      <a href="{{ pagination.previousPageLink }}" class="pagination-button">上一頁</a>
    {% else %}
      <span class="pagination-button" disabled>上一頁</span>
    {% endif %}
    {% for pageLink in pagination.pages %}
      <a href="{{ pageLink }}" class="pagination-button {% if pageLink == pagination.hrefs.last %}bg-yellow-600{% endif %}">{{ loop.index }}</a>
    {% endfor %}
    {% if pagination.nextPageLink %}
      <a href="{{ pagination.nextPageLink }}" class="pagination-button">下一頁</a>
    {% else %}
      <span class="pagination-button" disabled>下一頁</span>
    {% endif %}
  </div>


<a href="/booking" class="cta-button mt-8 inline-block">預約諮詢</a>
