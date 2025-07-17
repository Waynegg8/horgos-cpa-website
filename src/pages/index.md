---
layout: layouts/base.njk
title: 首頁
permalink: /
description: 霍爾果斯會計師事務所，您在台中最可靠的財稅夥伴。我們提供專業的公司設立、稅務申報、審計與諮詢服務。
pageScripts:
  - /assets/js/testimonial-slider.js
---

{# Hero Section: 形象影片區塊 #}
<div class="relative h-96 flex items-center justify-center text-white text-center p-4 overflow-hidden">
  
  {# 背景影片 #}
  <video 
    autoplay 
    loop 
    muted 
    playsinline 
    poster="/assets/images/hero-video-poster.jpg"
    class="absolute z-0 w-auto min-w-full min-h-full max-w-none">
    <source src="/assets/videos/hero-video.mp4" type="video/mp4">
    您的瀏覽器不支援影片標籤。
  </video>

  {# 疊加在影片上方的內容 #}
  <div class="z-10 relative">
    <h1 class="text-4xl md:text-6xl font-extrabold font-heading tracking-tight">專業領航，財稅無憂</h1>
    <p class="mt-4 text-lg md:text-xl max-w-2xl">霍爾果斯會計師事務所，您在台中最堅實的後盾</p>
    <a href="/appointment/" class="mt-8 inline-block bg-brand-blue-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-blue-800 transition-colors duration-300 shadow-xl">立即預約諮詢</a>
  </div>
  
  {# 深色疊加層，確保文字清晰可見 #}
  <div class="absolute inset-0 bg-black opacity-50 z-0"></div>

</div>

{# About Us Section: 關於我們區塊 #}
<div class="bg-white py-24 sm:py-32">
  <div class="container mx-auto max-w-4xl text-center px-6 lg:px-8">
    <h2 class="text-3xl font-bold font-heading tracking-tight text-gray-900 sm:text-4xl">您事業上的最佳夥伴</h2>
    <p class="mt-6 text-lg leading-8 text-gray-600">在台中打拼事業，需要可靠的台中會計師事務所支援。霍爾果斯會計師事務所深耕台中在地，精通法規，我們不僅僅是處理數字，更是您事業藍圖中不可或缺的策略夥伴，致力於透過專業服務，助您在台中穩健成長，財稅無憂。</p>
  </div>
</div>

{# Services Section: 服務介紹區塊 #}
<div class="bg-gray-50 py-24 sm:py-32">
  <div class="container mx-auto px-6 lg:px-8">
    <div class="max-w-2xl mx-auto lg:text-center">
      <h2 class="text-base font-semibold leading-7 text-brand-blue-700">我們的服務</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-heading">為您的企業量身打造</p>
      <p class="mt-6 text-lg leading-8 text-gray-600">從繁瑣的行政程序到複雜的稅務規劃，我們提供全方位的專業服務，讓您能專注於核心業務的發展。</p>
    </div>
    <div class="mt-16 max-w-2xl mx-auto sm:mt-20 lg:mt-24 lg:max-w-none">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
        {% for service in services_overview %}
        <div class="flex flex-col">
          <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
            <span class="material-icons text-white bg-brand-blue-700 rounded-lg p-1">{{ service.icon }}</span>
            {{ service.title }}
          </dt>
          <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
            <p class="flex-auto">{{ service.description }}</p>
            <p class="mt-6">
              <a href="{{ service.link }}" class="text-sm font-semibold leading-6 text-brand-blue-700">了解更多 <span aria-hidden="true">→</span></a>
            </p>
          </dd>
        </div>
        {% endfor %}
      </dl>
    </div>
  </div>
</div>

{# Testimonials Section: 客戶見證區塊 #}
<div class="bg-white py-24 sm:py-32">
  <div class="container mx-auto px-6 lg:px-8 relative">
    <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-heading">客戶的聲音</h2>
        <p class="mt-6 text-lg leading-8 text-gray-600">我們的專業與承諾，體現在每一位客戶的滿意回饋中。</p>
    </div>
    
    <div class="mt-10 relative max-w-3xl mx-auto">
      {# 輪播容器 #}
      <div id="testimonial-container" class="relative h-48">
        {% for testimonial in testimonials %}
        <figure class="testimonial-slide absolute inset-0 transition-opacity duration-500 ease-in-out opacity-0" data-index="{{ loop.index0 }}">
          <blockquote class="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
            <p>“{{ testimonial.content }}”</p>
          </blockquote>
          <figcaption class="mt-10">
            <div class="mt-4 flex items-center justify-center space-x-3 text-base">
              <div class="font-semibold text-gray-900">{{ testimonial.clientName }}</div>
            </div>
          </figcaption>
        </figure>
        {% endfor %}
      </div>
      
      {# 控制按鈕 #}
      <button id="prev-testimonial" class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
        <span class="sr-only">Previous testimonial</span>
        <span class="material-icons">chevron_left</span>
      </button>
      <button id="next-testimonial" class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
        <span class="sr-only">Next testimonial</span>
        <span class="material-icons">chevron_right</span>
      </button>
    </div>
  </div>
</div>

{# Latest Articles Section: 最新文章區塊 #}
<div class="bg-gray-50 py-24 sm:py-32">
  <div class="container mx-auto px-6 lg:px-8">
    <div class="max-w-2xl mx-auto lg:text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-heading">最新財稅資訊</h2>
        <p class="mt-6 text-lg leading-8 text-gray-600">掌握最新法規動態與實務解析，讓您的企業資訊同步，決策領先一步。</p>
    </div>
    <div class="mt-16 grid max-w-2xl grid-cols-1 gap-8 mx-auto lg:max-w-none lg:grid-cols-3">
      {# 
        這個迴圈會從 Eleventy 的 collections 中，找出最新的三篇文章來顯示
        我們使用 slice(0, 3) 來只選取前三項
      #}
      {% for item in collections.articles | reverse | slice(0, 3) %}
        {% set article = item.data %}
        {% include "partials/card-article.njk" %}
      {% endfor %}
    </div>
  </div>
</div>