---
layout: layouts/base.njk
title: 會計諮詢服務 - 霍爾果斯會計師事務所
description: 霍爾果斯會計師事務所提供專業的財務管理、成本控制、內部控制等會計諮詢服務，助您提升營運效率。
permalink: /services/consulting/
eleventyComputed:
  # 從 _data/services.json 中獲取該服務的數據
  serviceData: "{{ services.services | findbyone('id', 'consulting') }}"
  # 設置頁面圖片
  image: "/assets/images/services/service-sample-image.jpg"
---

<main class="container mx-auto px-4 py-12 md:py-16">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl md:text-4xl font-heading font-bold text-brand-blue-700 mb-8">{{ serviceData.title }}</h1>

    {% for section in serviceData.sections %}
      {% if section.type == 'generic-text-block' %}
        <section class="mb-10">
          {% if section.heading %}<h2 class="text-2xl font-heading font-bold text-gray-800 mb-4">{{ section.heading }}</h2>{% endif %}
          {% if section.content %}
            {% if section.content is string %}
              <p class="text-gray-700 text-lg leading-relaxed mb-4">{{ section.content }}</p>
            {% else %}
              {% for paragraph in section.content %}
                <p class="text-gray-700 text-lg leading-relaxed mb-4">{{ paragraph }}</p>
              {% endfor %}
            {% endif %}
          {% endif %}
        </section>
      {% elif section.type == 'process-steps' %}
        <section class="mb-10">
          {% include "components/process-steps.njk", title: section.heading, data: section.data %}
        </section>
      {% elif section.type == 'pricing-card-list' %}
        <section class="mb-10">
          {% include "components/pricing-card-list.njk", title: section.heading, data: section.data %}
        </section>
      {% elif section.type == 'highlight-quote' %}
        <section class="mb-10">
          {% include "components/highlight-quote.njk", data: section.data %}
        </section>
      {% elif section.type == 'custom-table' %}
        <section class="mb-10">
          {% include "components/custom-table.njk", data: section.data %}
        </section>
      {% endif %}
    {% endfor %}

    {# 相關連結區塊 #}
    {% if serviceData.relatedLinks and serviceData.relatedLinks.length %}
    <div class="mt-12 pt-8 border-t border-gray-200">
      <h3 class="text-2xl font-heading font-bold text-brand-blue-700 mb-4">相關資訊</h3>
      <ul class="list-disc list-inside space-y-2 text-lg text-gray-700">
        {% for link in serviceData.relatedLinks %}
          <li><a href="{{ link.url }}" class="text-brand-blue-600 hover:underline">{{ link.text }}</a></li>
        {% endfor %}
      </ul>
    </div>
    {% endif %}

  </div>
</main>