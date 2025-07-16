---
title: 常用工具
description: 提供多種實用的線上財稅計算機。
permalink: /calculators/
---

## 常用工具

這裡提供了多種我們為您準備的線上財稅計算機，希望能協助您解決日常的疑問。

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  {# 直接從 _data/calculators.json 讀取資料並建立連結 #}
  {%- for calc in calculators %}
    <a href="/calculators/{{ calc.id | slug }}/" class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
      <h3 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{{ calc.title }}</h3>
      <p class="font-normal text-gray-700">{{ calc.description }}</p>
    </a>
  {%- endfor %}
</div>