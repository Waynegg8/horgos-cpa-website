---
layout: layouts/faq.njk
title: 常見問題
description: 解答常見的財稅問題
pagination:
  data: collections.faqsPaginated
  size: 10
  alias: items
structuredData: |
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "常見問題",
    "description": "解答常見的財稅問題"
  }
---
<h1>常見問題</h1>
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

<button id="toggle-all" class="cta-button mb-4">全部展開</button>
<div class="space-y-4">
  {% for item in items %}
    <div class="faq-item" data-track="faq:{{ item.category }}/{{ item.question }}">
      <div class="faq-question">{{ item.question }}</div>
      <div class="faq-answer hidden">{{ item.answer }}</div>
    </div>
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