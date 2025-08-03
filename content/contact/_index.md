---
title: "聯絡我們"
description: "Hugo會計師事務所聯絡資訊、地址、營業時間"
date: 2024-05-24
seo_title: "聯絡Hugo會計師事務所 - 地址、電話與營業時間"
seo_description: "Hugo會計師事務所聯絡資訊、地址、營業時間與交通指南。歡迎透過電話、LINE或親臨諮詢，我們將提供專業會計稅務服務。立即聯絡 https://hugo-accounting.com/contact/"
---

# 聯絡我們

歡迎透過以下方式與Hugo會計師事務所聯繫，我們的專業團隊將竭誠為您提供優質的會計、稅務與商業諮詢服務。無論您有任何財務問題或需求，都可以透過電話、LINE或親臨諮詢，我們將盡快回覆您的詢問。

## 聯絡資訊

<div class="contact-cards">
  <div class="contact-card">
    <i class="fas fa-phone-alt"></i>
    <h3>電話聯絡</h3>
    <p>代表號：<a href="tel:+886223456789">02-2345-6789</a></p>
    <p>專線：<a href="tel:+886223456780">02-2345-6780</a></p>
    <p>傳真：02-2345-6788</p>
  </div>
  
  <div class="contact-card">
    <i class="fab fa-line"></i>
    <h3>LINE官方帳號</h3>
    <p>LINE ID: @hugoaccounting</p>
    <p><a href="https://line.me/R/ti/p/@hugoaccounting" class="line-btn">加入LINE好友</a></p>
  </div>
  
  <div class="contact-card">
    <i class="fas fa-map-marker-alt"></i>
    <h3>公司地址</h3>
    <p>台北市信義區松仁路100號10樓</p>
    <p>郵遞區號：11073</p>
    <p><a href="https://maps.google.com/?q=台北市信義區松仁路100號10樓" target="_blank">在Google地圖開啟</a></p>
  </div>
  
  <div class="contact-card">
    <i class="fas fa-clock"></i>
    <h3>營業狀態</h3>
    <div id="business-status">
      <p class="status-indicator"><span class="status-dot"></span><span id="status-text">載入中...</span></p>
      <p>營業時間：</p>
      <p>週一至週五 08:30–12:30、13:30–17:30</p>
      <p>週六、週日及國定假日休息</p>
    </div>
  </div>
</div>

## 地圖位置

<div class="map-container">
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.7635725087626!2d121.56442287605861!3d25.033632877778995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abb6e9d7f17d%3A0xd508f7b3aa02d539!2zMTEw5Y-w5YyX5biC5L-h576p5Y2A5p2-5LuB6LevMTAw6Jmf!5e0!3m2!1szh-TW!2stw!4v1716534000000!5m2!1szh-TW!2stw" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>

## 交通資訊

### 大眾運輸

**捷運：**
- 捷運信義線「台北101/世貿站」2號出口，步行約5分鐘
- 捷運板南線「市政府站」1號出口，步行約10分鐘

**公車：**
- 搭乘20、22、28、202、207、266、277、281、282、288、292、537、612、621、650、651、665、669、902、903、905、906、909、913、敦化幹線至「松智路口站」下車，步行約3分鐘
- 搭乘33、37、270、270區、281、282、286、286區、521、521區、612、612區、669、902、903、905、906、909、913、敦化幹線至「市政府站」下車，步行約10分鐘

### 開車路線

**北部地區：**
- 走國道1號（中山高）→ 圓山交流道下→ 建國高架→ 信義路出口→ 松仁路

**東部地區：**
- 走國道3號（北二高）→ 汐止系統交流道→ 堤頂交流道下→ 松仁路

**南部地區：**
- 走國道1號（中山高）→ 永福交流道下→ 福和橋→ 和平東路→ 信義路→ 松仁路

### 停車資訊

**大樓停車場：**
- 地下停車場每小時收費50元

**附近停車場：**
- 信義商圈地下停車場（步行約5分鐘）
- 台北101購物中心停車場（步行約7分鐘）
- 信義威秀停車場（步行約10分鐘）

### 附近地標

- 台北101（步行約7分鐘）
- 信義威秀影城（步行約10分鐘）
- 台北市政府（步行約10分鐘）
- 新光三越信義店（步行約8分鐘）

## 立即聯繫我們

<div class="cta-buttons">
  <a href="/appointment/" class="btn btn-primary">立即預約諮詢</a>
  <a href="https://line.me/R/ti/p/@hugoaccounting" class="btn btn-secondary">加入Line諮詢</a>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  updateBusinessStatus();
  setInterval(updateBusinessStatus, 60000); // 每分鐘更新一次
});

function updateBusinessStatus() {
  const now = new Date();
  const taipeiTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);
  
  const day = now.getDay(); // 0 = 週日, 1-5 = 週一至週五, 6 = 週六
  const hour = parseInt(taipeiTime.split(':')[0]);
  const minute = parseInt(taipeiTime.split(':')[1]);
  const currentTime = hour * 60 + minute; // 轉換為分鐘計算
  
  const morningStart = 8 * 60 + 30; // 08:30
  const morningEnd = 12 * 60 + 30;  // 12:30
  const afternoonStart = 13 * 60 + 30; // 13:30
  const afternoonEnd = 17 * 60 + 30;  // 17:30
  
  const statusText = document.getElementById('status-text');
  const statusDot = document.querySelector('.status-dot');
  
  // 判斷是否為工作日
  if (day >= 1 && day <= 5) {
    // 判斷是否在營業時間內
    if ((currentTime >= morningStart && currentTime < morningEnd) || 
        (currentTime >= afternoonStart && currentTime < afternoonEnd)) {
      statusText.textContent = '營業中';
      statusDot.classList.add('open');
      statusDot.classList.remove('closed');
    } else if (currentTime >= morningEnd && currentTime < afternoonStart) {
      statusText.textContent = '午休中 (13:30恢復營業)';
      statusDot.classList.add('lunch');
      statusDot.classList.remove('open', 'closed');
    } else if (currentTime < morningStart) {
      statusText.textContent = '休息中 (今日08:30開始營業)';
      statusDot.classList.add('closed');
      statusDot.classList.remove('open', 'lunch');
    } else {
      statusText.textContent = '休息中 (明日08:30開始營業)';
      statusDot.classList.add('closed');
      statusDot.classList.remove('open', 'lunch');
    }
  } else {
    statusText.textContent = '休息中 (週一08:30開始營業)';
    statusDot.classList.add('closed');
    statusDot.classList.remove('open', 'lunch');
  }
}
</script>

<style>
.contact-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.contact-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.contact-card i {
  font-size: 2rem;
  color: #204B6E;
  margin-bottom: 1rem;
}

.contact-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.contact-card p {
  margin-bottom: 0.5rem;
}

.contact-card a {
  color: #204B6E;
  text-decoration: none;
}

.contact-card a:hover {
  text-decoration: underline;
}

.qrcode {
  margin-top: 1rem;
}

.qrcode img {
  max-width: 150px;
  height: auto;
}

.map-container {
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.status-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.status-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-dot.open {
  background-color: #10B981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
}

.status-dot.closed {
  background-color: #EF4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
}

.status-dot.lunch {
  background-color: #F59E0B;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  text-align: center;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #204B6E;
  color: white;
}

.btn-primary:hover {
  background-color: #2C5F7F;
}

.btn-secondary {
  background-color: #00B900;
  color: white;
}

.btn-secondary:hover {
  background-color: #00a000;
}

.line-btn {
  display: inline-block;
  background-color: #00B900;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.line-btn:hover {
  background-color: #00a000;
  color: white;
  text-decoration: none;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .contact-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .contact-cards {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
}
</style>