# Hugo 會計事務所網站

這是一個使用 Hugo 框架建立的會計事務所網站，具有完整的前後端功能、SEO 優化和內容管理系統。

## 技術架構

- **前端框架**：Hugo Extended v0.147.0
- **主題**：基於 Mainroad 主題客製化
- **後端服務**：Cloudflare Workers
- **資料存儲**：Cloudflare KV Storage
- **部署平台**：Cloudflare Pages
- **內容管理**：Sveltia CMS

## 功能特色

- 響應式設計，支援桌面、平板和手機等多種裝置
- 完整的內容管理系統，可輕鬆更新文章、影片、FAQ 和下載資源
- 預約諮詢表單，包含 reCAPTCHA 驗證和自動郵件通知
- 討論區功能，整合 Disqus 留言系統
- 營業狀態動態顯示，支援台北時區和國定假日
- SEO 優化，包含結構化資料、sitemap 和自定義 meta 標籤
- 無障礙設計，符合 WCAG 2.1 AA 標準

## 目錄結構

```
.
├── archetypes/          # 內容模板
├── assets/              # 需要處理的資源文件
│   ├── js/              # JavaScript 文件
│   └── scss/            # SCSS 樣式文件
├── content/             # 網站內容
├── data/                # 網站資料
├── layouts/             # 模板文件
├── static/              # 靜態文件
│   ├── admin/           # CMS 管理介面
│   └── uploads/         # 上傳的媒體文件
├── themes/              # 主題
├── workers/             # Cloudflare Workers 代碼
├── .github/             # GitHub Actions 配置
├── scripts/             # 測試和部署腳本
├── hugo.toml            # Hugo 配置文件
└── README.md            # 專案說明
```

## 開發指南

### 環境要求

- Node.js 18+
- Hugo Extended v0.147.0+
- Git

### 安裝步驟

1. 複製專案：
   ```bash
   git clone https://github.com/username/hugo-accounting.git
   cd hugo-accounting
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

4. 建置網站：
   ```bash
   npm run build
   ```

### 測試

```bash
# 效能測試
npm run test:performance

# 無障礙測試
npm run test:accessibility

# 最終檢查
npm run test:final

# 執行所有測試
npm run test
```

### 部署

```bash
# 部署到 Cloudflare Pages
npm run deploy
```

## 內容管理

1. 訪問管理介面：`https://hugo-accounting.com/admin`
2. 使用 GitHub 帳號登入
3. 編輯內容並發布

## 相關文件

- [專案建置日誌](project_build_log.md)
- [需求文件](hugo-requirements-final-updated.txt)

## 授權

© 2024 Hugo會計師事務所 版權所有