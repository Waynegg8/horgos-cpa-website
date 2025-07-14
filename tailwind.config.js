// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 確保這裡包含了所有您會使用 Tailwind CSS 類別的檔案路徑
  // Ensure all file paths where you use Tailwind CSS classes are included here
  content: [
    // 掃描 Eleventy 輸出目錄中的所有 HTML 檔案
    // 這會在 Eleventy 構建完成後，讓 Tailwind 能夠正確地進行 Purge
    // Scan all HTML files in the Eleventy output directory
    // This allows Tailwind to correctly purge after Eleventy build is complete
    "./_site/**/*.html", 
    // 掃描 Eleventy 原始碼目錄中的所有模板檔案
    // 這樣在開發階段或首次運行時，Tailwind 也能找到類別
    // Scan all template files in the Eleventy source directory
    // This allows Tailwind to find classes during development or initial run
    "./src/**/*.{html,njk,md,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
