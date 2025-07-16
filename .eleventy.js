// 引入所有需要的套件
const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { EleventyI18nPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {

  // --- Plugins (外掛) ---
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "zh-TW",
  });

  // --- Passthrough Copy (靜態資源複製) ---
  eleventyConfig.addPassthroughCopy("assets"); 
  eleventyConfig.addPassthroughCopy("src/downloads");
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // --- Filters (篩選器) ---
  eleventyConfig.addFilter("sortBy", (arr, key) => {
    if (!Array.isArray(arr)) return arr;
    return arr.slice().sort((a, b) => {
      const valA = a.data[key];
      const valB = b.data[key];
      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });
  });

  eleventyConfig.addFilter("filterBy", (arr, key, value) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => {
      const data = item.data || item;
      return data[key] === value;
    });
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).setLocale('zh-TW').toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // --- Shortcodes (自訂標籤) ---
  
  // ✨ 新增 year Shortcode ✨
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // 圖片處理 shortcode
  eleventyConfig.addNunjucksAsyncShortcode("image", async function(src, alt, sizes = "100vw") {
    if (alt === undefined) {
      throw new Error(`Missing \`alt\` on image from: ${src}`);
    }
    let fullSrc = `./src${src}`;
    let metadata = await Image(fullSrc, {
      widths: [400, 800, 1200],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "./_site/img/",
      urlPath: "/img/",
    });
    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };
    return Image.generateHTML(metadata, imageAttributes);
  });

  // 按鈕 shortcode
  eleventyConfig.addShortcode("ctaButton", function(text, url) {
    return `<a href="${url}" class="inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300">${text}</a>`;
  });

  // --- Markdown It (Markdown 處理) ---
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      class: "direct-link",
      symbol: "#",
      level: [1,2,3,4],
    }),
    slugify: eleventyConfig.getFilter("slugify")
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // --- Data Extensions (資料擴充) ---
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // --- Watch Targets (監看目標) ---
  eleventyConfig.addWatchTarget("./src/js/");

  // --- Eleventy 核心設定 ---
  return {
    templateFormats: [ "md", "njk", "html", "liquid" ],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};