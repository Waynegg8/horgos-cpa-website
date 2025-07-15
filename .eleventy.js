const { DateTime } = require("luxon");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {

  // --- PLUGINS ---
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);

  // --- CUSTOM FILTERS ---
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("yyyy-LL-dd");
  });
  eleventyConfig.addFilter("year", (dateObj) => {
    return new Date(dateObj).getFullYear();
  });
  eleventyConfig.addFilter("sortBy", (arr, key) => {
    if (!Array.isArray(arr)) return arr;
    return arr.slice().sort((a, b) => {
      const valA = a[key] || (a.data && a.data[key]);
      const valB = b[key] || (b.data && b.data[key]);
      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });
  });
  eleventyConfig.addFilter("filterBy", (arr, key, value) => {
    return arr.filter(item => {
      const val = item[key] || (item.data && item.data[key]);
      return val === value;
    });
  });
  eleventyConfig.addFilter("limit", (arr, limit) => {
    return arr.slice(0, limit);
  });

  // --- SHORTCODES ---
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // --- COLLECTIONS ---
  eleventyConfig.addCollection("articlesPaginated", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/generated-articles/**/*.md").reverse();
  });
  eleventyConfig.addCollection("videosPaginated", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/generated-videos/**/*.md").reverse();
  });
  
  // --- THIS IS THE FINAL FIX for FAQs ---
  eleventyConfig.addCollection("faqsPaginated", function() {
    const faqDir = path.join(__dirname, 'faqs');
    let allFaqs = [];
    try {
      if (fs.existsSync(faqDir)) {
        const categories = fs.readdirSync(faqDir);
        for (const category of categories) {
          const categoryDir = path.join(faqDir, category);
          if (fs.statSync(categoryDir).isDirectory()) {
            const faqFile = path.join(categoryDir, 'faq.json');
            if (fs.existsSync(faqFile)) {
              const faqData = JSON.parse(fs.readFileSync(faqFile, 'utf8'));
              if (Array.isArray(faqData)) {
                // 為每個 FAQ 項目添加 category
                const faqsWithCategory = faqData.map(faq => ({
                  ...faq,
                  category: category
                }));
                allFaqs = allFaqs.concat(faqsWithCategory);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Error processing FAQ collection:", e);
      return []; // Return empty array on error
    }
    return allFaqs;
  });

  // --- PASSTHROUGH COPY ---
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("faqs");

  // --- DIRECTORY CONFIGURATION ---
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};