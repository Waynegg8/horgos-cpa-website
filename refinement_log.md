# 專案精煉待辦清單 (Project Refinement To-Do List)

## 任務核心目標
本清單旨在將專案的 **使用者體驗 (UX)** 與 **視覺設計 (UI)** 從當前「功能完整」的狀態，提升至完全符合 `linear.app` 美學標準的「業界頂尖」水準。所有任務將圍繞 `STYLE_GUIDE.md` 中定義的新設計語言展開。

---

## [P0] 核心視覺系統重構 (Core Visual System Refactor)
*此為最高優先級，後續所有任務的基礎。*

- **[X] 任務 1：實施 `STYLE_GUIDE.md`**
  - **描述**：將 `STYLE_GUIDE.md` 中定義的所有 SCSS 變數、混合、基礎樣式應用到 `assets/scss/` 的對應檔案中 (`_variables.scss`, `_buttons.scss`, `_cards.scss` 等)。
  - **狀態**：✅ **已完成**

- **[X] 任務 2：全站模板稽核與類別替換**
  - **描述**：全面稽核 `layouts/` 目錄下的所有 `.html` 模板與 `partials`，將舊的、自訂的樣式類別替換為 `STYLE_GUIDE.md` 中定義的標準化元件類別 (如 `.btn`, `.card` 等)。
  - **狀態**：✅ **已完成**
  - **驗收標準**：模板中不再存在廢棄的樣式類別，所有元素均採用新設計系統。

---
...(其餘任務不變)
