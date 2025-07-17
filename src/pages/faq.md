---
layout: layouts/base.njk
title: 常見問題
permalink: /faq/
description: 整理了關於公司設立、稅務申報等常見問題，幫助您快速找到解答。
pageScripts:
  - /assets/js/faq-toggle.js
---

<div class="bg-white py-16 sm:py-24">
  <div class="container mx-auto px-6 lg:px-8">
    
    {# 頁面標題 #}
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-3xl font-bold font-heading tracking-tight text-gray-900 sm:text-4xl">常見問題</h1>
      <p class="mt-6 text-lg leading-8 text-gray-600">我們彙整了客戶最常提出的問題，希望能為您提供即時的幫助。如果找不到您的問題，歡迎隨時與我們聯繫。</p>
    </div>

    {# FAQ 內容區 #}
    <div class="mt-16 max-w-4xl mx-auto">
      {# 按分類循環顯示 #}
      {% for category_group in faqs %}
        <div class="mb-12">
          <h2 class="text-2xl font-bold font-heading text-gray-900 border-b-2 border-brand-blue-700 pb-2 mb-6">{{ category_group.category.name }}</h2>
          <div class="space-y-4">
            {# 顯示該分類下的所有問答 #}
            {% for item in category_group.items %}
              <details class="group bg-gray-50 p-6 rounded-lg" id="{{ item.id }}">
                <summary class="flex items-center justify-between cursor-pointer list-none">
                  <span class="font-semibold text-lg text-gray-800">{{ item.question }}</span>
                  <span class="material-icons transition-transform duration-300 group-open:rotate-180">expand_more</span>
                </summary>
                <div class="mt-4 text-gray-600 leading-relaxed border-t pt-4">
                  <p>{{ item.answer | safe }}</p>
                  
                  {# 分享按鈕 #}
                  <div class="mt-4 text-right">
                    <button 
                      class="share-faq-btn inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-brand-blue-700 hover:bg-brand-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
                      data-id="{{ item.id }}"
                      data-question="{{ item.question }}">
                      <span class="material-icons mr-1 text-sm">share</span>
                      分享
                    </button>
                  </div>

                </div>
              </details>
            {% endfor %}
          </div>
        </div>
      {% endfor %}
    </div>

  </div>
</div>