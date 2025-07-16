const { DateTime } = require("luxon");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { EleventyI18nPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const yaml = require("js-yaml");

module.exports = function(eleventyventyConfig) {

  // --- Plugins ---
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "zh-TW",
  });

  // --- Passthrough Copy ---
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/downloads");
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // --- Filters ---
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).setLocale('zh-TW').toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // --- Shortcodes ---
  eleventyConfig.addShortcode("ctaButton", function(text, url) {
    return `<a href="${url}" class="inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300">${text}</a>`;
  });

  // --- Markdown It ---
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

  // --- Data Extensions ---
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // --- Watch Targets ---
  eleventyConfig.addWatchTarget("./src/js/");

  // --- Return an object of options ---
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