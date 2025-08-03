# 視覺風格施工圖 (Style Guide)

本文件旨在定義專案的視覺設計語言，其核心目標是深入學習並轉譯 `https://linear.app` 的設計精髓，以確保最終產出具備業界頂尖的質感與使用者體驗。所有程式碼範例均為實現此目標的施工藍圖。

---

## 1. 色彩系統 (Color System)

色彩是建立品牌氛圍的基石。我們將採用 `linear.app` 的深邃暗色系，搭配高對比度的文字與一個清晰的互動主色，營造專業、專注的視覺感受。

### SCSS 變數 (`/assets/scss/utils/_variables.scss`)
```scss
// 1. 背景色彩系統
$color-bg-primary: #0A0A0A;      // 主背景 (近乎純黑)
$color-bg-secondary: #141414;   // 次要背景 (用於卡片、容器)

// 2. 文字色彩階層
$color-text-primary: #F0F0F0;     // 主要文字 (高對比米白)
$color-text-secondary: #A1A1A1;  // 次要文字 (用於描述、輔助資訊)
$color-text-tertiary: #525252;   // 淡化文字 (用於不重要的標籤)

// 3. 邊框與分隔線
$color-border-primary: #262626;  // 低調的深灰色邊框

// 4. 主要互動色彩
$color-accent-primary: #5E5CEE;   // 主色調 (優雅紫，用於主要按鈕、連結懸停、焦點)
$color-accent-highlight: #22c55e; // 強調色 (綠色，用於次要CTA)

// 5. 狀態指示色彩
$color-status-success: #10B981;  // 成功
$color-status-warning: #F59E0B;  // 警告
$color-status-error: #EF4444;    // 錯誤
$color-status-info: #3B82F6;     // 資訊
```

---

## 2. 字體排印 (Typography)

清晰、優雅的字體排印是提升閱讀體驗的關鍵。

### SCSS 變數 (`/assets/scss/utils/_variables.scss`)
```scss
// 字體棧
$font-family-sans: "Inter", "Noto Sans TC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

// 字體大小階層
$font-size-h1: 2.5rem;    // 40px
$font-size-h2: 2rem;      // 32px
$font-size-h3: 1.5rem;    // 24px
$font-size-h4: 1.25rem;   // 20px
$font-size-base: 1rem;      // 16px
$font-size-small: 0.875rem; // 14px

// 行高
$line-height-base: 1.7;
$line-height-heading: 1.3;

// 基礎文字樣式 (`/assets/scss/base/_typography.scss`)
body {
  font-family: $font-family-sans;
  font-size: $font-size-base;
  line-height: $line-height-base;
  color: $color-text-primary;
  background-color: $color-bg-primary;
}

h1, h2, h3, h4 {
  line-height: $line-height-heading;
  color: $color-text-primary;
}
```

---

## 3. 按鈕 (Buttons)

按鈕是核心互動元件，必須提供清晰的視覺回饋。

### HTML 結構
```html
<button class="btn btn-primary">主要按鈕</button>
<button class="btn btn-secondary">次要按鈕</button>
<a href="#" class="btn btn-outline">外框按鈕</a>
```

### SCSS 樣式 (`/assets/scss/components/_buttons.scss`)
```scss
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem; // 12px 24px
  font-size: $font-size-base;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid $color-accent-primary;
    outline-offset: 2px;
  }
}

.btn-primary {
  background-color: $color-accent-primary;
  color: #FFFFFF;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($color-accent-primary, 0.3);
  }
}

.btn-secondary {
  background-color: $color-bg-secondary;
  color: $color-text-primary;
  border: 1px solid $color-border-primary;

  &:hover {
    background-color: darken($color-bg-secondary, 5%);
    border-color: lighten($color-border-primary, 5%);
  }
}

.btn-outline {
  background-color: transparent;
  color: $color-text-secondary;
  border: 1px solid $color-border-primary;

  &:hover {
    color: $color-text-primary;
    border-color: $color-text-secondary;
  }
}
```

---

## 4. 卡片 (Cards)

卡片是承載內容的主要容器，需要簡潔、一致的風格。

### HTML 結構
```html
<div class="card">
  <div class="card-header">
    <h3>卡片標題</h3>
  </div>
  <div class="card-body">
    <p>這是卡片的內容區域。</p>
  </div>
  <div class="card-footer">
    <a href="#" class="btn btn-primary">了解更多</a>
  </div>
</div>
```

### SCSS 樣式 (`/assets/scss/components/_cards.scss`)
```scss
.card {
  background-color: $color-bg-secondary;
  border: 1px solid $color-border-primary;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease-out;

  &:hover {
    transform: translateY(-4px);
    border-color: lighten($color-border-primary, 10%);
  }

  .card-header,
  .card-body,
  .card-footer {
    padding: 1.5rem; // 24px
  }

  .card-header {
    border-bottom: 1px solid $color-border-primary;
  }
  
  .card-footer {
    border-top: 1px solid $color-border-primary;
    background-color: darken($color-bg-secondary, 2%);
  }
}
```

---

## 5. 導航欄下拉選單 (Navbar Dropdown)

下拉選單是體現網站精緻度的重要細節。我們將採用 `linear.app` 的毛玻璃效果。

### HTML 結構
```html
<nav class="main-nav">
  <ul>
    <li><a href="#">關於我們</a></li>
    <li class="has-dropdown">
      <a href="#">服務項目</a>
      <div class="dropdown-menu">
        <a href="#" class="dropdown-item">工商登記</a>
        <a href="#" class="dropdown-item">稅務申報</a>
        <a href="#" class="dropdown-item">財稅簽證</a>
      </div>
    </li>
  </ul>
</nav>
```

### SCSS 樣式 (`/assets/scss/layouts/_navigation.scss`)
```scss
.has-dropdown {
  position: relative;

  .dropdown-menu {
    position: absolute;
    top: 120%;
    left: 0;
    width: 220px;
    padding: 0.5rem; // 8px
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid $color-border-primary;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transform: translateY(10px);
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover > .dropdown-menu {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
  }
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem; // 12px 16px
  color: $color-text-secondary;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: $color-text-primary;
    background-color: rgba(255, 255, 255, 0.05);
  }
}
```
