# 部署指南

本指南將協助您將 Hugo 蘋果風格會計事務所網站部署到 Cloudflare Pages，並設定相關服務。

## 📋 部署前準備

### 1. 環境需求

- GitHub 帳號
- Cloudflare 帳號
- 網域名稱 (可選)

### 2. 專案準備

確保您的專案已經：
- [ ] 所有內容已完成
- [ ] 主題和樣式已設定
- [ ] 配置檔案已正確設定
- [ ] 已測試本地建置

## 🚀 Cloudflare Pages 部署

### 步驟 1: 推送到 GitHub

1. 建立 GitHub 倉庫
2. 推送您的專案代碼

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 步驟 2: 連接 Cloudflare Pages

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 進入 **Pages** 頁面
3. 點擊 **Create a project**
4. 選擇 **Connect to Git**
5. 選擇您的 GitHub 倉庫

### 步驟 3: 設定建置參數

在 Cloudflare Pages 設定頁面：

```
Framework preset: Hugo
Build command: hugo --minify
Build output directory: public
Environment variables:
  HUGO_VERSION: 0.120.4
  HUGO_ENV: production
```

### 步驟 4: 部署

點擊 **Save and Deploy**，Cloudflare 將自動建置並部署您的網站。

## ☁️ Cloudflare Workers 設定

### 步驟 1: 安裝 Wrangler CLI

```bash
npm install -g wrangler
wrangler auth login
```

### 步驟 2: 建立 KV 命名空間

```bash
# 建立生產環境 KV
wrangler kv:namespace create "APPOINTMENTS"
wrangler kv:namespace create "CONTACTS" 
wrangler kv:namespace create "COMMENTS"

# 建立預覽環境 KV
wrangler kv:namespace create "APPOINTMENTS" --preview
wrangler kv:namespace create "CONTACTS" --preview
wrangler kv:namespace create "COMMENTS" --preview
```

### 步驟 3: 更新 wrangler.toml

將產生的 KV namespace ID 更新到 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "APPOINTMENTS"
id = "your-actual-namespace-id"
preview_id = "your-actual-preview-id"
```

### 步驟 4: 部署 Workers

```bash
cd workers
wrangler deploy
```

### 步驟 5: 設定路由

在 Cloudflare Dashboard 中：
1. 進入您的網域設定
2. 前往 **Workers Routes**
3. 新增路由: `your-domain.com/api/*` → `your-worker-name`

## 🌐 自訂網域設定

### 步驟 1: 在 Cloudflare Pages 中新增自訂網域

1. 進入 Pages 專案設定
2. 點擊 **Custom domains**
3. 新增您的網域

### 步驟 2: DNS 設定

如果您的網域在 Cloudflare 管理：
- DNS 記錄會自動建立

如果在其他 DNS 服務商：
- 建立 CNAME 記錄指向您的 Pages 網址

## 📧 郵件服務設定 (可選)

### 使用 EmailJS

1. 註冊 [EmailJS](https://www.emailjs.com/)
2. 建立郵件範本
3. 在 Workers 中整合 EmailJS API

### 使用 Cloudflare Email Workers

1. 設定 Cloudflare Email Workers
2. 設定 DKIM 和 SPF 記錄
3. 更新 Workers 代碼以發送郵件

## 🔒 安全性設定

### SSL/TLS 憑證

Cloudflare 會自動提供 SSL 憑證，確保：
- SSL/TLS 加密模式設為 **Full (strict)**
- 啟用 **Always Use HTTPS**

### 安全標頭

在 `netlify.toml` 或 Pages 設定中加入安全標頭：

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
```

## 📊 監控和分析

### Google Analytics

1. 建立 Google Analytics 帳號
2. 在 `config.toml` 中設定 tracking ID:

```toml
[params]
  googleAnalytics = "G-XXXXXXXXXX"
```

### Cloudflare Analytics

在 Cloudflare Dashboard 中啟用：
- Web Analytics
- Speed Insights
- Core Web Vitals 監控

## 🔄 持續部署

### 自動部署

Cloudflare Pages 會自動偵測 GitHub 推送並重新部署。

### 分支部署

- `main` 分支 → 生產環境
- 其他分支 → 預覽環境

### 建置快取

Cloudflare 會快取建置結果，加速後續部署。

## 🐛 故障排除

### 常見問題

1. **建置失敗**
   - 檢查 Hugo 版本
   - 確認所有檔案路徑正確
   - 查看建置日誌

2. **頁面 404**
   - 檢查 baseURL 設定
   - 確認頁面路徑正確

3. **Workers 錯誤**
   - 檢查 KV 命名空間設定
   - 確認路由配置
   - 查看 Workers 日誌

### 除錯工具

- Cloudflare Dashboard 日誌
- Hugo 本地除錯: `hugo server -D --debug`
- Wrangler 本地測試: `wrangler dev`

## 📞 支援

如遇到問題，請：
1. 查看相關文件
2. 檢查 GitHub Issues
3. 聯絡技術支援

---

**重要提醒**: 部署前請務必在本地環境完整測試，確保所有功能正常運作。
