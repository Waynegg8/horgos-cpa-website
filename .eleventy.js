const markdownIt = require("markdown-it");
const Image = require("@11ty/eleventy-img"); // 新增：引入 eleventy-img

module.exports = function(eleventyConfig) {
  // --- Markdown 設定 ---
  const md = markdownIt({ html: true });
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addFilter("markdownify", (markdownString) => {
    return md.render(markdownString);
  });
  
  // --- Passthrough Copy ---
  // eleventyConfig.addPassthroughCopy("src/assets/js"); // JavaScript 會通過 shortcode 處理，或根據需求延遲載入
  eleventyConfig.addPassthroughCopy("src/assets/css"); // 確保 CSS 檔案被複製
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/downloads");
  eleventyConfig.addPassthroughCopy("src/assets/videos");
  eleventyConfig.addPassthroughCopy("src/search_index.json");
  // 移除 images 的 passthrough copy，因為 eleventy-img 將處理它們
  // eleventyConfig.addPassthroughCopy("src/assets/images");

  // --- Image Optimization with @11ty/eleventy-img ---
  eleventyConfig.addNunjucksAsyncShortcode("image", async (src, alt, widths = [null], sizes = "100vw", loading = "lazy", decoding = "async", className = "") => {
    let metadata = await Image(src, {
      widths: widths,
      formats: ["webp", "jpeg"], // 優先生成 WebP，其次是 JPEG
      outputDir: "./_site/assets/images/optimized/", // 優化圖片的輸出路徑
      urlPath: "/assets/images/optimized/", // 網站上圖片的 URL 路徑
    });

    let imageAttributes = {
      alt,
      sizes,
      loading,
      decoding,
      class: className,
    };

    // return Image.generateHTML(metadata, imageAttributes); // 舊版用法
    return Image.generateHTML(metadata, imageAttributes, {
      whitespace: "conservative"
    });
  });

  // --- Custom Filters ---
  eleventyConfig.addFilter("getYear", () => new Date().getFullYear());
  eleventyConfig.addFilter("formatDate", (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // --- Collections (我們不再需要它們了) ---
  // eleventyConfig.addCollection("articles", ...);
  // eleventyConfig.addCollection("videos", ...);
  
  // --- Base Config ---
  return {
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};