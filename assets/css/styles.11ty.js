// assets/css/styles.11ty.js

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

// a string of CSS that we'll empty and then fill with our processed CSS
const css = fs.readFileSync(path.join(__dirname, "styles.css"));

module.exports = class {
  // a function to return the data that we need
  async data() {
    const rawCss = css;

    return {
      // the permalink is where the file will be saved
      permalink: "/assets/css/styles.css",
      // the raw CSS that we'll process
      rawCss: rawCss,
      // Tailwind config
      tailwindConfig: "./tailwind.config.js",
    };
  }

  // a function to render the CSS
  async render({ rawCss, tailwindConfig }) {
    return await postcss([
        // require the tailwindcss plugin
        tailwindcss(tailwindConfig),
        // require the autoprefixer plugin
        autoprefixer,
    ])
    .process(rawCss)
    .then((result) => {
        // return the processed CSS
        return result.css;
    });
  }
};