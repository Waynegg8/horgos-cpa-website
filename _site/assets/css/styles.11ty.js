// assets/css/styles.11ty.js
module.exports = class {
  data() {
    return {
      permalink: "/assets/css/styles.css",
      // 將此檔案從 Eleventy 集合中排除
      // Exclude this file from Eleventy collections
      eleventyExcludeFromCollections: true, 
      // 將此檔案視為原始檔案，不對其內容進行 Nunjucks 處理
      // Treat this file as a raw file, do not process its content with Nunjucks
      rawFileTemplate: true 
    };
  }

  async render() {
    // 這裡不再執行 Tailwind CSS 命令。
    // 'build:css' 腳本將直接將編譯後的 CSS 寫入 './_site/assets/css/styles.css'。
    // 因此，這個 render 方法可以返回一個空字串，Eleventy 只需知道這個路徑的存在。
    // Tailwind CSS command is no longer executed here.
    // The 'build:css' script will directly write the compiled CSS to './_site/assets/css/styles.css'.
    // Therefore, this render method can return an empty string; Eleventy just needs to know the path exists.
    return ""; 
  }
};
