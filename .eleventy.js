const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // --- Markdown 設定 ---
  const md = markdownIt({ html: true });
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addFilter("markdownify", (markdownString) => {
    return md.render(markdownString);
  });
  
  // --- Passthrough Copy ---
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/downloads");
  eleventyConfig.addPassthroughCopy("src/assets/videos");
  eleventyConfig.addPassthroughCopy("src/search_index.json");

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