# Hugo 蘋果風格會計事務所網站

專業的會計事務所網站，採用 Hugo 靜態網站生成器和蘋果風格設計。

## 🚀 快速開始

### 環境需求

- Hugo Extended v0.120.0 或以上版本
- Node.js 18+ (用於開發工具)
- Git

### 安裝與運行

1. **克隆專案**
   ```bash
   git clone https://github.com/your-username/hugo-accounting-site.git
   cd hugo-accounting-site
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **本地開發**
   ```bash
   npm run dev
   ```
   
   網站將在 http://localhost:1313 開啟

4. **建置網站**
   ```bash
   npm run build
   ```

## 📁 專案結構

```
hugo-accounting-site/
├── content/              # 內容檔案
│   ├── articles/        # 知識文章
│   ├── videos/          # 影音專區
│   ├── faq/             # 常見問題
│   └── downloads/       # 下載專區
├── data/                # 資料檔案
│   ├── series/          # 系列管理
│   └── tags.yml         # 標籤管理
├── layouts/             # 模板檔案
├── static/              # 靜態資源
│   ├── admin/           # CMS 管理介面
│   ├── uploads/         # 上傳檔案
│   └── images/          # 圖片資源
├── themes/              # 主題
│   └── apple-style/     # 自訂蘋果風格主題
└── workers/             # Cloudflare Workers
    └── src/             # Worker 原始碼
```

## 🎨 設計特色

- **蘋果風格設計**: 採用蘋果設計語言，簡潔優雅
- **深色導航欄**: 深色背景配白色 Logo 和文字
- **響應式設計**: 完美支援桌面、平板、手機
- **快速搜尋**: 即時搜尋建議和結果高亮
- **系列管理**: 智慧的內容系列組織
- **預約發布**: 支援內容預約發布功能

## ⚙️ 功能特色

- **內容管理**: Decap CMS 易用管理介面
- **多媒體支援**: 文章、影片、下載檔案
- **討論功能**: Cloudflare Workers 驅動的留言系統
- **表單處理**: 預約諮詢和聯絡表單
- **SEO 優化**: 完整的 SEO 配置
- **高效能**: 靜態網站，載入速度極快

## 🔧 開發指南

### 新增內容

1. **使用 CMS 管理介面**: 訪問 `/admin` 進行內容管理
2. **手動建立**: 在對應的 `content/` 目錄下建立 Markdown 檔案

### 客製化主題

主題檔案位於 `themes/apple-style/`，包含：
- `layouts/`: HTML 模板
- `assets/`: SCSS 和 JS 原始檔
- `static/`: 靜態資源

### 部署

詳細部署指南請參考 `docs/deployment-guide.md`

## 📖 更多文件

- [部署指南](docs/deployment-guide.md)
- [CMS 使用手冊](docs/cms-guide.md)
- [Cloudflare 設定](docs/cloudflare-setup.md)
- [自訂指南](docs/customization-guide.md)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個專案。

## 📄 授權

MIT License - 詳情請參考 LICENSE 檔案
