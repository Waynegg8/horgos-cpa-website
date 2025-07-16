const { DateTime } = require("luxon");
const path = require("path");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const criticalCss = require("eleventy-critical-css");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes = "100vw") {
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` on responsive image from: ${src}`);
  }
  let metadata = await Image(src, {
    widths: [300, 600, 900, null], 
    formats: ["webp", "jpeg"],
    outputDir: "./_site/assets/images/generated/",
    urlPath: "/assets/images/generated/"
  });
  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];
  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
      <img
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/downloads");

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("yyyy-LL-dd");
  });
  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });
  
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addCollection("articlesPaginated", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/generated-content/articles/*.md").reverse();
  });
  eleventyConfig.addCollection("videosPaginated", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/generated-content/videos/*.md").reverse();
  });
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    let tagSet = new Set();
    collectionApi.getAll().forEach(function(item) {
      if( "tags" in item.data ) {
        let tags = item.data.tags;
        tags = tags.filter(item => !["all", "nav", "post", "posts"].includes(item));
        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });
    return [...tagSet];
  });
  
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginNavigation);

  if (process.env.NODE_ENV === 'production') {
    eleventyConfig.addPlugin(criticalCss, {
      css: '_site/assets/css/styles.css',
    });
  }

  eleventyConfig.addWatchTarget("./src/_data/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
      // === 修改點: 我們在這裡徹底移除了 layouts: "_includes/layouts" 這一行 ===
    },
    templateFormats: ["html", "md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};