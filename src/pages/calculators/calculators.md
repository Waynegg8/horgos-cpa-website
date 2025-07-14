---
layout: layouts/base.njk
title: 常用工具
permalink: /calculators/ # 修改這裡：從 /calculators/calculators/ 改為 /calculators/
description: 實用的財稅計算工具
structuredData: |
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "常用工具",
    "description": "實用的財稅計算工具"
  }
---
<h1>常用工具</h1>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {% for calculator in calculators %}
    <a href="{{ calculator.url }}" class="card" data-track="calculator:{{ calculator.name }}">
      <div class="p-4">
        <h3 class="text-lg font-semibold">{{ calculator.name }}</h3>
        <p class="text-gray-600">{{ calculator.description }}</p>
      </div>
    </a>
  {% endfor %}
</div>

<a href="/booking" class="cta-button mt-8 inline-block">預約諮詢</a>
