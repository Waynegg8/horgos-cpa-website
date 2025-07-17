---
layout: layouts/base.njk
title: "{{ content_source.services.tax.title }}"
permalink: "/services/{{ content_source.services.tax.slug }}/"
---

{# 
  我們先在這裡，用 'set' 將我們需要的資料從全局資料中指定給一個簡短的變數 'serviceData'，
  這樣在後面的模板中就能方便地使用它。
#}
{% set serviceData = content_source.services.tax %}

<div class="bg-white py-16 sm:py-24">
  <div class="container mx-auto max-w-4xl px-6 lg:px-8">
    
    {# 頁面主標題 #}
    <div class="text-center">
      <h1 class="text-3xl font-bold font-heading tracking-tight text-gray-900 sm:text-4xl">{{ serviceData.title }}</h1>
    </div>

    {# 動態載入區塊 #}
    <div class="mt-12 space-y-16">
      {% for section in serviceData.sections %}
        <section>
          <h2 class="text-2xl font-bold font-heading text-gray-800">{{ section.heading }}</h2>
          
          {# 判斷區塊類型 #}
          {% if section.type == 'generic' %}
            <div class="mt-4 text-lg text-gray-600 leading-relaxed">
              <p>{{ section.content }}</p>
            </div>
          {% elif section.type == 'process-steps' %}
            {# 
              最穩定的 include 方式：
              1. 先用 'set' 把資料存到 'data' 變數中。
              2. 再直接 include 組件。
            #}
            {% set data = section.data %}
            {% include "components/process-steps.njk" %}
          {% endif %}
        </section>
      {% endfor %}
    </div>

    {# 相關連結 #}
    <div class="mt-16 text-center border-t pt-8">
       <h3 class="text-xl font-semibold">下一步</h3>
       <div class="mt-4 space-x-4">
        {% for link in serviceData.relatedLinks %}
          <a href="{{ link.url }}" class="inline-block bg-brand-blue-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-blue-800 transition-colors duration-300">
            {{ link.text }}
          </a>
        {% endfor %}
       </div>
    </div>

  </div>
</div>