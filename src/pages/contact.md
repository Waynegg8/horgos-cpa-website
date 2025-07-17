---
layout: layouts/base.njk
title: 聯絡我們
permalink: /contact/
description: 隨時歡迎您與霍爾果斯會計師事務所聯繫。您可以透過電話、Line 或親臨本所，我們期待為您服務。
---

<div class="bg-white py-16 sm:py-24">
  <div class="container mx-auto px-6 lg:px-8">
    
    {# 頁面標題 #}
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-3xl font-bold font-heading tracking-tight text-gray-900 sm:text-4xl">與我們聯繫</h1>
      <p class="mt-6 text-lg leading-8 text-gray-600">我們期待能為您提供專業的財稅服務。無論您是需要設立公司、稅務申報或是專業諮詢，都歡迎透過以下方式找到我們。</p>
    </div>

    {# 資訊卡片與地圖的左右網格佈局 #}
    <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">

      {# 左側：聯絡資訊卡片 #}
      <div class="bg-gray-50 rounded-xl shadow-lg p-8 space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <span class="material-icons mr-2 text-brand-blue-700">location_on</span>
            事務所地址
          </h3>
          <p class="mt-2 text-gray-600">{{ contact.address }}</p>
        </div>

        <div class="border-t border-gray-200"></div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <span class="material-icons mr-2 text-brand-blue-700">call</span>
            聯絡電話
          </h3>
          <p class="mt-2 text-gray-600">{{ contact.phone }}</p>
        </div>

        <div class="border-t border-gray-200"></div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <span class="material-icons mr-2 text-brand-blue-700">schedule</span>
            營業時間
          </h3>
          <ul class="mt-2 space-y-1 text-gray-600">
            {% for item in contact.businessHours %}
              <li>{{ item.day }}: {{ item.time }}</li>
            {% endfor %}
          </ul>
        </div>
        
        <div class="border-t border-gray-200"></div>

        <div>
           <a href="{{ contact.lineUrl }}" class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-500 hover:bg-green-600">
            <span class="font-bold">透過 Line 聯繫</span>
          </a>
        </div>
      </div>

      {# 右側：嵌入地圖 #}
      <div class="w-full h-96 md:h-full rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="{{ contact.mapEmbedUrl }}"
          width="100%"
          height="100%"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    </div>

    {# 下方：預約按鈕與交通資訊 #}
    <div class="mt-16 text-center">
      <a href="/appointment/" class="inline-block bg-brand-blue-700 text-white font-bold py-4 px-10 rounded-lg hover:bg-brand-blue-800 transition-colors duration-300 text-lg">
        前往線上預約
      </a>
      <div class="mt-8 text-gray-600">
        <h3 class="text-xl font-semibold">交通資訊</h3>
        <p class="mt-2">（交通資訊說明文字...）</p>
      </div>
    </div>

  </div>
</div>