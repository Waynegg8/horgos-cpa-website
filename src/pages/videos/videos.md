---
layout: layouts/videos.njk
title: 影片總覽
description: 觀看我們的財稅知識影片
pagination:
  data: collections.videosPaginated
  size: 10
  alias: items
---
<h1>影片總覽</h1>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {% for item in items %}
    {# --- 這是關鍵的修正 --- #}
    {# 在使用 video_url 之前，先檢查它是否存在且包含 'v=' #}
    {% if item.data.video_url and item.data.video_url.includes('v=') %}
      <a href="{{ item.url }}" class="card" data-track="video:{{ item.data.title }}">
        {# 確認 video_url 存在後，才安全地使用它來組合圖片網址 #}
        <img src="https://img.youtube.com/vi/{{ item.data.video_url.split('v=')[1] }}/hqdefault.jpg" alt="{{ item.data.title }}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-semibold">{{ item.data.title }}</h3>
        </div>
      </a>
    {% endif %}
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