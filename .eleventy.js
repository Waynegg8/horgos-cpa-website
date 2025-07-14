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
  // Passthrough copy - 我們不再需要複製或忽略 assets/css
  eleventyConfig.addPassthroughCopy("assets/images");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/downloads");
  eleventyConfig.addPassthroughCopy({ "scripts": "scripts" });

  // Watch targets
  eleventyConfig.addWatchTarget("./assets/css/styles.css"); // 監看原始CSS
  eleventyConfig.addWatchTarget("./content-json/");
  eleventyConfig.addWatchTarget("./faqs/");


  // =================================================================
  //  內容集合 (Collections)
  // =================================================================
  eleventyConfig.addCollection("articlesPaginated", function(collectionApi) {
    const articles = [];
    const contentDirs = ['content-json/entrepreneurship-tax', 'content-json/company-setup', 'content-json/standalone'];
    for (const contentDir of contentDirs) {
      const sourceFileName = contentDir.includes('standalone') ? 'articles.json' : 'series.json';
      const jsonFilePath = path.join(__dirname, contentDir, sourceFileName);
      if (fs.existsSync(jsonFilePath)) {
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        for (const article of jsonData) {
          const categorySlug = contentDir.split('/').pop();
          article.url = `/articles/${categorySlug}/${article.slug}/`;
          articles.push({ data: article, url: article.url });
        }
      }
    }
    return articles;
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
                item.category = category;
                item.id = `${category}/${item.question.slice(0, 10)}`;
                faqs.push(item);
              });
            }
          }
        }
    }
    return faqs;
  });

  eleventyConfig.addCollection("videosPaginated", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/videos/**/*.md").filter(item => item.inputPath !== './src/pages/videos/videos.md');
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