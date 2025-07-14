// .eleventy.js

const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {

  // =================================================================
  //  自訂過濾器 (Custom Filters)
  // =================================================================
  eleventyConfig.addFilter("sortBy", (arr, key) => {
    if (!Array.isArray(arr)) return arr;
    return arr.slice().sort((a, b) => {
      const valA = a.data ? a.data[key] : a[key];
      const valB = b.data ? b.data[key] : b[key];
      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });
  });

  eleventyConfig.addFilter("filterBy", (arr, key, value) => {
    return arr.filter(item => {
      const data = item.data || item;
      return data[key] === value;
    });
  });

  eleventyConfig.addFilter("truncate", (str, len) => {
    if (!str || typeof str !== 'string') return '';
    if (str.length <= len) return str;
    return str.substring(0, len) + '...';
  });


  // =================================================================
  //  客製化設定
  // =================================================================
  // Passthrough copy
  // 傳遞複製
  eleventyConfig.addPassthroughCopy("assets/images");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/downloads"); // 確保原始下載檔案也能被複製
  eleventyConfig.addPassthroughCopy({ "scripts": "scripts" });
  eleventyConfig.addPassthroughCopy({ "faqs": "faqs" }); // 確保原始 FAQ JSON 檔案也能被複製

  // Watch targets
  // 監聽目標
  eleventyConfig.addWatchTarget("./assets/css/styles.css"); // 監看原始CSS
  eleventyConfig.addWatchTarget("./content-json/");
  eleventyConfig.addWatchTarget("./faqs/");
  eleventyConfig.addWatchTarget("./src/_data/videos.txt"); // 監看原始影片資料
  eleventyConfig.addWatchTarget("./src/_data/downloads.txt"); // 監看原始下載資料


  // =================================================================
  //  內容集合 (Collections)
  // =================================================================
  eleventyConfig.addCollection("articlesPaginated", function(collectionApi) {
    // 獲取所有在 src/generated-articles/**/ 目錄下的 .md 檔案
    return collectionApi.getFilteredByGlob("src/generated-articles/**/*.md");
  });

  eleventyConfig.addCollection("videosPaginated", function(collectionApi) {
    // 獲取所有在 src/generated-videos/ 目錄下的 .md 檔案
    return collectionApi.getFilteredByGlob("src/generated-videos/**/*.md");
  });

  eleventyConfig.addCollection("downloadsPaginated", function(collectionApi) {
    // 獲取所有在 src/generated-downloads/ 目錄下的 .md 檔案
    return collectionApi.getFilteredByGlob("src/generated-downloads/**/*.md");
  });

  eleventyConfig.addCollection("faqsPaginated", function(collectionApi) {
    const faqs = [];
    const faqDir = path.join(__dirname, 'faqs');
    if (fs.existsSync(faqDir)) {
        const categories = fs.readdirSync(faqDir);
        for (const category of categories) {
          const categoryDir = path.join(faqDir, category);
          if (fs.statSync(categoryDir).isDirectory()) {
            const faqFile = path.join(categoryDir, 'faq.json');
            if (fs.existsSync(faqFile)) {
              const faqData = JSON.parse(fs.readFileSync(faqFile, 'utf8'));
              faqData.forEach(item => {
                // 為每個 FAQ 項目添加 category 和一個簡單的 ID
                item.category = category;
                item.id = `${category}/${item.question.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '')}`; // 創建一個簡短ID
                faqs.push(item);
              });
            }
          }
        }
    }
    return faqs;
  });


  // =================================================================
  //  Eleventy 核心設定
  // =================================================================
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
