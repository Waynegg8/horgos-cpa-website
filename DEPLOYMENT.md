# Cloudflare Pages 部署指南

本專案已針對 Cloudflare Pages 進行最佳化設定，包含安全標頭、靜態資源快取以及單頁應用（SPA）回退規則。以下步驟將協助你將 Hugo 網站部署到 Cloudflare。

## 1. 建立 Cloudflare Pages 專案

1. 登入 [Cloudflare](https://dash.cloudflare.com/) 控制台，於 **Pages** 頁面按下 **Create a project**。
2. 選擇你儲存程式碼的 Git 倉庫，並授權 Cloudflare 存取。
3. 在 **Build settings** 中：
   - **Framework preset** 選擇 **Hugo** 或 **Other**（若使用 Hugo 0.115 以上，建議選擇 Other）。
   - **Build command** 輸入：

     ```bash
     hugo --minify -b $CF_PAGES_URL
     ```

   - **Build output directory** 設定為 `public`。
   - 若需要使用特定 Hugo 版本，可以在 **Environment variables** 中新增 `HUGO_VERSION`。

4. 建立完成後，Cloudflare 會開始第一次構建並部署網站。

## 2. 快取與安全標頭設定

此專案在 `static/_headers` 檔案中定義了一系列 HTTP 標頭，用來加強安全性與效能：

* **X‑Frame‑Options: DENY**：防止網站被嵌入到 iframe 中，以降低點擊劫持風險。
* **X‑Content‑Type‑Options: nosniff**：阻止瀏覽器嘗試猜測 MIME 類型。
* **Referrer‑Policy: strict-origin-when-cross-origin**：僅在同源請求時傳送完整 referrer。
* **Permissions‑Policy**：關閉攝影機、麥克風與地理位置權限。
* 對 `.css`、`.js`、圖片等檔案設定長時間快取：`Cache-Control: public, max-age=31536000, immutable`，提升載入速度。

部署到 Cloudflare Pages 後，這些標頭會自動生效。若需修改，請編輯 `static/_headers` 並重新部署。

## 3. URL 重定向與 SPA 回退

`static/_redirects` 檔案包含兩條規則：

```
/admin/* /admin/index.html 200
/* /index.html 200
```

* 第一條用於 Netlify CMS 後台，將 `/admin` 下的任何路徑都重新導向至 `admin/index.html`。
* 第二條是 SPA fallback，在使用前端路由時將未知路徑全部回退至首頁（`index.html`）。

這些規則確保在 Cloudflare Pages 上也能正常使用 CMS 與前端路由。

## 4. Google Analytics 與環境變數

Google Analytics 4 的測量 ID 由 `config.toml` 中的 `params.ga_id` 控制。你可以透過 Cloudflare Pages 的環境變數或直接編輯 `config.toml` 來設定。例如在 Pages 的 **Environment variables** 新增 `HUGO_PARAMS_GA_ID=G-XXXXXXX`，即可在建置時覆寫 `params.ga_id`。

## 5. 影像與資產最佳化

專案啟用了 Hugo 圖像處理：

* `[imaging]` 區塊設定了 `resampleFilter = "lanczos"` 及 `quality = 85`，確保圖片縮放時保持品質並降低檔案大小。
* `[params.imaging]` 中的 `webp = true` 與 `lazyload = true` 使圖片自動產生 WebP 格式並啟用 `loading="lazy"` 屬性。

部署後建議使用 [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) 檢測效能，調整圖片或資產配置以達成桌面版 ≥ 90 分、行動版 ≥ 85 分。

## 6. 常見問題

* **如何變更網域？** 在 Cloudflare Pages 控制台中新增自訂網域，並指向專案。不要忘記在 Hugo 建置時指定 `-b` 或在 `config.toml` 設定 `baseURL`。
* **CMS 發佈後看不到更新？** Netlify CMS 透過 Git Gateway 提交更新，需要重新部署才能看到改動。可以開啟自動部署或手動觸發 Pages rebuild。
* **只有首頁顯示？** 如果你的網站使用前端路由或 SPA，請確認 `_redirects` 檔案存在並已正確部署。