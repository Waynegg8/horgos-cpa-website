---
layout: layouts/page.njk
title: 線上預約諮詢
permalink: /appointment/
description: 填寫表單以預約我們的專業會計諮詢服務。我們將在一個工作日內與您聯繫，安排最適合您的時間。
pageScripts:
  - /assets/js/appointment.js
---

{# 頁面標題 #}
<div class="max-w-2xl mx-auto text-center mb-12">
  <h1 class="text-3xl font-bold font-heading tracking-tight text-gray-900 sm:text-4xl">線上預約諮詢</h1>
  <p class="mt-6 text-lg leading-8 text-gray-600">請填寫以下表單，我們的專業團隊將盡快與您聯繫，安排一對一的諮詢時間。我們期待為您的事業助力。</p>
</div>

{# 表單 #}
<div class="max-w-2xl mx-auto">
  <form id="appointment-form" novalidate>
    <div class="space-y-6">
      
      {# 業務類型按鈕 #}
      <div>
        <label class="text-base font-semibold text-gray-900">您想諮詢的業務類型？</label>
        <fieldset class="mt-4">
          <legend class="sr-only">業務類型</legend>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {% set businessTypes = ["公司設立", "稅務申報", "審計服務", "專業諮詢", "其他諮詢"] %}
            {% for type in businessTypes %}
            <div>
              <label class="group relative bg-white border rounded-lg py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 cursor-pointer">
                <input type="radio" name="business-type" value="{{ type }}" class="sr-only" aria-labelledby="label-business-type-{{ loop.index }}">
                <span id="label-business-type-{{ loop.index }}">{{ type }}</span>
                <span class="absolute -inset-px rounded-lg border-2 pointer-events-none" aria-hidden="true"></span>
              </label>
            </div>
            {% endfor %}
          </div>
        </fieldset>
      </div>

      {# 姓名 #}
      <div>
        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">您的姓名</label>
        <div class="mt-2">
          <input type="text" name="name" id="name" autocomplete="name" required class="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue-600 sm:text-sm sm:leading-6">
        </div>
      </div>
      
      {# Email #}
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">電子郵件</label>
        <div class="mt-2">
          <input type="email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue-600 sm:text-sm sm:leading-6">
        </div>
      </div>

      {# 電話 #}
      <div>
        <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">聯絡電話</label>
        <div class="mt-2">
          <input type="tel" name="phone" id="phone" autocomplete="tel" required placeholder="例如：0912-345678" class="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue-600 sm:text-sm sm:leading-6">
        </div>
      </div>
      
      {# 備註 #}
       <div>
        <label for="message" class="block text-sm font-medium leading-6 text-gray-900">您的問題或備註（非必填）</label>
        <div class="mt-2">
          <textarea name="message" id="message" rows="4" class="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue-600 sm:text-sm sm:leading-6"></textarea>
        </div>
      </div>

      {# 隱私權同意 #}
      <div class="flex gap-x-3">
        <div class="flex h-6 items-center">
          <input id="privacy-policy" name="privacy-policy" type="checkbox" required class="h-4 w-4 rounded border-gray-300 text-brand-blue-600 focus:ring-brand-blue-600">
        </div>
        <div class="text-sm leading-6">
          <label for="privacy-policy" class="font-medium text-gray-900">我已閱讀並同意</label>
          <a href="{{ site.legalLinks[0].url }}" class="font-semibold text-brand-blue-600 hover:text-brand-blue-500">隱私權政策</a>。
        </div>
      </div>

    </div>

    {# 錯誤訊息容器 #}
    <div id="form-errors" class="mt-6 text-sm text-red-600"></div>

    {# 提交按鈕 #}
    <div class="mt-10">
      <button type="submit" id="submit-button" class="block w-full rounded-md bg-brand-blue-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-600">送出預約</button>
    </div>
  </form>
</div>