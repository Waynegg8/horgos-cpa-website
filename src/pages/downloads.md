---
layout: layouts/downloads.njk
title: 下載中心
description: 下載實用的財稅資源
pagination:
  data: collections.downloadsPaginated
  size: 10
  alias: items
structuredData: |
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "下載中心",
    "description": "下載實用的財稅資源"
  }
---
<h1>下載中心</h1>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {% for item in items %}
    <a href="{{ item.url }}" class="card" data-track="download:{{ item.data.slug }}">
      <div class="p-4">
        <h3 class="text-lg font-semibold">{{ item.data.title }}</h3>
        <p class="text-gray-600">{{ item.data.description }}</p>
        <p class="text-sm text-gray-500">檔案名稱: {{ item.data.filename }}</p>
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
