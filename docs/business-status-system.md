# 營業狀態系統

## 概述

營業狀態系統是一個實時顯示公司營業狀態的功能，包括營業時間、午休時間、假日處理等功能。

## 功能特點

### 1. 實時狀態顯示
- **營業中**：綠色指示燈，顯示當前正在營業
- **午休中**：橙色指示燈，顯示午休時間
- **休息中**：紅色指示燈，顯示非營業時間

### 2. 營業時間設定
- **平日營業時間**：週一至週五
- **早上時段**：08:30 - 12:30
- **午休時間**：12:30 - 13:30
- **下午時段**：13:30 - 17:30
- **週末休息**：週六、週日

### 3. 假日處理
- **國定假日**：自動識別並顯示休息狀態
- **補班日**：支援補班日設定，在假日時段正常營業
- **假日名稱顯示**：在休息狀態下顯示假日名稱

### 4. 智能提示
- **下次營業時間**：顯示下次開始營業的時間
- **下次關閉時間**：顯示下次休息的時間
- **動態更新**：每分鐘自動更新狀態

## 技術實現

### 前端組件

#### 1. HTML 模板
位置：`layouts/partials/business-status.html`

```html
<div class="business-status-container">
  <div class="business-status" id="business-status">
    <div class="status-indicator">
      <span class="status-dot" id="status-dot"></span>
      <span class="status-text" id="status-text">載入中...</span>
    </div>
    <div class="business-hours">
      <p>營業時間：週一至週五 08:30–12:30、13:30–17:30</p>
    </div>
    <div class="next-status" id="next-status"></div>
  </div>
</div>
```

#### 2. CSS 樣式
位置：`assets/scss/pages/_contact.scss`

```scss
.status-dot {
  &.open {
    background-color: #10B981; // 綠色 - 營業中
  }
  
  &.closed {
    background-color: #EF4444; // 紅色 - 休息中
  }
  
  &.lunch {
    background-color: #F59E0B; // 橙色 - 午休中
  }
}
```

#### 3. JavaScript 邏輯
- **API 調用**：從 Cloudflare Workers 獲取營業狀態
- **預設邏輯**：當 API 不可用時的備用計算
- **自動更新**：每分鐘更新一次狀態

### 後端 API

#### 1. Cloudflare Workers
位置：`workers/src/handlers/business-status.js`

**主要功能：**
- 計算當前營業狀態
- 處理假日邏輯
- 提供 RESTful API

**API 端點：**
- `GET /api/business-status`：獲取當前營業狀態
- `GET /api/admin/holidays`：獲取所有假日（管理員）
- `POST /api/admin/holidays`：新增假日（管理員）
- `PUT /api/admin/holidays`：更新假日（管理員）
- `DELETE /api/admin/holidays`：刪除假日（管理員）

#### 2. 假日數據
位置：`data/holidays/2024.json`

```json
{
  "date": "2024-01-01",
  "name": "元旦",
  "type": "national",
  "isWorkday": false
}
```

### 數據存儲

#### 1. Cloudflare KV
- **鍵格式**：`holidays:YYYY`（年份）
- **值格式**：假日數組
- **數據結構**：
  - `date`：日期（YYYY-MM-DD）
  - `name`：假日名稱
  - `type`：假日類型（national/makeup）
  - `isWorkday`：是否為工作日

## 使用方式

### 1. 在頁面中引入
```html
{{ partial "business-status.html" . }}
```

### 2. 自定義樣式
可以通過修改 CSS 變數來自定義外觀：

```scss
// 狀態指示燈顏色
$status-open-color: #10B981;
$status-closed-color: #EF4444;
$status-lunch-color: #F59E0B;
```

### 3. 管理假日
使用管理員 API 來管理假日：

```javascript
// 新增假日
fetch('/api/admin/holidays', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: '2024-12-25',
    name: '聖誕節',
    type: 'national',
    isWorkday: false
  })
});
```

## 測試

### 1. 運行測試腳本
```bash
node scripts/test-business-status.js
```

### 2. 測試內容
- 不同時間點的營業狀態
- 假日邏輯處理
- API 響應格式

## 部署注意事項

### 1. Cloudflare Workers 配置
- 確保 KV 命名空間已創建
- 設置環境變數 `ADMIN_API_KEY`
- 部署 Workers 代碼

### 2. 假日數據初始化
運行初始化腳本：
```bash
node scripts/init-holidays.js
```

### 3. 環境變數
```bash
# Cloudflare Workers 環境變數
ADMIN_API_KEY=your_admin_api_key
HOLIDAYS_KV=your_kv_namespace
```

## 故障排除

### 1. API 請求失敗
- 檢查 Workers 是否正確部署
- 確認 API 端點路徑
- 檢查網絡連接

### 2. 假日不顯示
- 確認假日數據已載入到 KV
- 檢查日期格式是否正確
- 驗證 `isWorkday` 字段

### 3. 時間不準確
- 確認時區設定為 `Asia/Taipei`
- 檢查客戶端時間同步
- 驗證時間計算邏輯

## 未來改進

### 1. 功能擴展
- 支援多個營業地點
- 自定義營業時間
- 節假日自動更新

### 2. 性能優化
- 客戶端緩存
- API 響應優化
- 減少不必要的請求

### 3. 用戶體驗
- 動畫效果
- 更豐富的狀態信息
- 多語言支援 