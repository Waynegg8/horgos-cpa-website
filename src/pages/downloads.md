---
layout: layouts/downloads.njk
title: 下載中心
description: 下載實用的財稅資源
# No pagination for downloads, as it's a single list page
# 下載沒有分頁，因為它是一個單一列表頁面
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
  {# Loop directly through the processed_downloads data, which is available via Eleventy's data cascade #}
  {# 直接遍歷 processed_downloads 數據，這些數據可通過 Eleventy 的數據層訪問 #}
  {% for item in processed_downloads %}
    <a href="{{ item.url }}" class="card" data-track="download:{{ item.filename }}">
      <div class="p-4">
        <h3 class="text-lg font-semibold">{{ item.title }}</h3>
        <p class="text-gray-600">{{ item.description }}</p>
        <p class="text-sm text-gray-500">檔案名稱: {{ item.filename }}</p>
      </div>
    </a>
  {% endfor %}
</div>
{# Removed pagination HTML as it's a single list page now #}
{# 已移除分頁 HTML，因為現在是單一列表頁面 #}

<a href="/booking" class="cta-button mt-8 inline-block">預約諮詢</a>
