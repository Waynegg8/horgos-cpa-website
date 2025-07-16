---
title: 預約諮詢
description: 透過線上表單預約霍爾果斯會計師事務所的專業諮詢服務。
permalink: /booking/
---

## 線上預約諮詢

歡迎使用我們的線上預約系統。請填寫下方的表單，詳細說明您的需求，我們的專業團隊將在一個工作日內與您取得聯繫，安排一對一的諮詢時間。

### **預約表單**

<form action="{{ site_meta.formspreeUrl }}" method="POST" class="mt-6 space-y-4 max-w-lg mx-auto">
  <div>
    <label for="name" class="block text-sm font-medium text-gray-700">您的姓名或公司名稱</label>
    <input type="text" name="name" id="name" required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
  </div>
  <div>
    <label for="email" class="block text-sm font-medium text-gray-700">您的電子郵件</label>
    <input type="email" name="email" id="email" required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
  </div>
   <div>
    <label for="phone" class="block text-sm font-medium text-gray-700">您的聯絡電話</label>
    <input type="tel" name="phone" id="phone" required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
  </div>
  <div>
    <label for="message" class="block text-sm font-medium text-gray-700">您想諮詢的服務或問題</label>
    <textarea name="message" id="message" rows="5" required placeholder="請簡述您的情況，例如：公司設立、帳務處理、稅務規劃等..." class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
  </div>
  <div>
    <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
      送出預約
    </button>
  </div>
</form>