# 霍爾果斯會計師事務所網站

這是一個採用 **Hugo** 建立的靜態網站專案，提供稅務、創業與財務相關資訊。專案採用現代化風格、最佳化效能並內建 Netlify CMS 以便管理內容。

## 環境需求

* [Hugo Extended](https://gohugo.io/getting-started/installing/) 版本 ≥ `0.115.0`。建議安裝 Extended 版以支援 SCSS/資產管線功能。
* Git 用於版本控制與與 CMS 的 Git Gateway。

## 安裝步驟

1. 下載或 clone 此專案：

   ```bash
   git clone <你的倉庫位址>
   cd horgos-cpa-website-master
   ```

2. 在本機啟動預覽伺服器：

   ```bash
   hugo server -D
   ```

   `-D` 選項會包含草稿文章。啟動後瀏覽器將在 `http://localhost:1313` 呈現網站。

3. 建立正式環境版本：

   ```bash
   hugo --minify -b "https://你的網域/"
   ```

   產出檔案將位於 `public/` 目錄，可直接部署至 Cloudflare Pages、Netlify 等靜態網站服務。

## 專案結構簡介

| 目錄 / 檔案        | 說明                                                |
|--------------------|-------------------------------------------------------|
| `config.toml`      | Hugo 站點設定，包括描述、導航、影像處理等             |
| `content/`         | Markdown 內容：文章、常見問題、影音、下載與頁面       |
| `layouts/`         | 頁面模板，包含列表頁、單篇頁、頁首、頁腳等            |
| `static/assets/`   | 靜態資源：CSS、JavaScript、圖檔                       |
| `static/admin/`    | Netlify CMS 配置，包含登入介面與後端設定            |
| `static/_headers`  | Cloudflare / Netlify 平台的安全與快取標頭設定          |
| `static/_redirects`| Cloudflare / Netlify 的 URL 重定向規則                |

## 調整網站設定

* **Google Analytics**：編輯 `config.toml` 中的 `params.ga_id`，填入你的 GA4 測量 ID，例如 `G-XXXXXYYY`。GA 代碼會自動嵌入每個頁面。
* **影像處理**：`config.toml` 的 `[imaging]` 與 `[params.imaging]` 區塊可以調整圖片品質、WebP 與 Lazy Loading 設定。
* **網站描述**：`config.toml` 中的 `params.description` 用於 meta description 與結構化資料。

## 編輯內容

建議透過 Netlify CMS （詳見 `CMS.md`）管理文章、常見問題、影音與下載，這樣可以避免直接編輯 Markdown 檔案造成格式錯誤。如果需要手動調整，可在 `content/` 目錄中新增或編輯相應的 `.md` 檔案。

## 授權

本專案的源碼與內容僅用於示範與教學用途，請勿未經授權將其用於商業部署。若需商業使用，請洽詢原作者取得授權。