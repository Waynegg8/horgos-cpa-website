---
layout: layouts/page.njk
title: 關於我們
permalink: /team/
description: 認識霍爾果斯會計師事務所的專業團隊。我們由經驗豐富的會計師、經理與專員組成，致力於為您的事業提供最優質的服務。
---

{# 頂部區塊 #}
<div class="max-w-3xl mx-auto text-center mb-16">
  <h1 class="text-3xl font-bold font-heading tracking-tight text-gray-900 sm:text-4xl">我們的專業團隊</h1>
  <p class="mt-6 text-lg leading-8 text-gray-600">我們深信，專業的服務來自於專業的人才。霍爾果斯的每一位成員都具備豐富的實務經驗與熱忱，我們不僅是您的會計師，更是能與您共同成長的夥伴。</p>
</div>

{# 團隊成員列表，迴圈變數已更新為 'team' #}
<div class="space-y-12">
  {% for member in team %}
    <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12 {% if loop.index is odd %}md:flex-row-reverse{% endif %}">
      
      {# 成員照片 #}
      <div class="w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
        <img class="w-full h-full object-cover rounded-full shadow-lg" src="{{ member.imageUrl }}" alt="{{ member.name }}">
      </div>
      
      {# 成員資訊 #}
      <div>
        <h3 class="text-2xl font-bold font-heading text-gray-900">{{ member.name }}</h3>
        <p class="text-lg font-semibold text-brand-blue-700">{{ member.title }}</p>
        <p class="mt-4 text-gray-600 leading-relaxed">{{ member.bio }}</p>
      </div>

    </div>
  {% endfor %}
</div>

{# 頁尾行動呼籲 (CTA) #}
<div class="mt-24 text-center border-t border-gray-200 pt-12">
  <h2 class="text-3xl font-bold font-heading tracking-tight text-gray-900">準備好讓您的事業更上一層樓了嗎？</h2>
  <p class="mt-4 text-lg leading-8 text-gray-600">讓我們的專業團隊成為您堅實的後盾。</p>
  <div class="mt-8">
    <a href="/appointment/" class="inline-block bg-brand-blue-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-blue-800 transition-colors duration-300">
      立即預約免費諮詢
    </a>
  </div>
</div>