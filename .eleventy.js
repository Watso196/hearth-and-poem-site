const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports = function (eleventyConfig) {
  let poemsCache = []; // store poems for afterBuild

  // Pass through assets
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addWatchTarget("src/assets/css/");

  // Build CSS before Eleventy runs
  eleventyConfig.on("beforeBuild", () => {
    return new Promise((resolve, reject) => {
      fs.rmSync("dist", { recursive: true, force: true });
      const distCssDir = path.join("dist", "css");
      fs.mkdirSync(distCssDir, { recursive: true });

      exec("npx postcss src/assets/css/main.css -o dist/css/main.css", (err, stdout, stderr) => {
        if (err) {
          console.error(stderr);
          reject(err);
        } else {
          console.log(stdout);
          resolve();
        }
      });
    });
  });

  // Date filter
  eleventyConfig.addFilter("date", (dateObj, format = "long") => {
    if (!(dateObj instanceof Date)) {
      dateObj = new Date(dateObj);
    }
    let options;
    switch (format) {
      case "long":
        options = { year: "numeric", month: "long", day: "numeric" };
        break;
      case "short":
        options = { year: "numeric", month: "short", day: "numeric" };
        break;
      default:
        options = { year: "numeric", month: "numeric", day: "numeric" };
    }
    return new Intl.DateTimeFormat("en-US", options).format(dateObj);
  });

  // Poems collection — only store inputPath for later reading
  eleventyConfig.addCollection("poems", function (collectionApi) {
    const poems = collectionApi
      .getFilteredByGlob("src/poems/*.md")
      .sort((a, b) => b.date - a.date)
      .map(poem => {
        // Attach the file path for later
        poem.data._sourcePath = poem.inputPath;
        return poem;
      });

    poemsCache = poems; // store for afterBuild
    return poems;
  });

  // After build, read excerpts and write search.json
  eleventyConfig.on("afterBuild", () => {
    const data = poemsCache.map(poem => {
      // Read raw markdown from disk (for line splits)
      const raw = fs.readFileSync(poem.data._sourcePath, "utf8");
      const body = raw.replace(/^---[\s\S]*?---/, "").trim();

      const firstLinesArray = body
        .split(/\r?\n/)
        .filter(Boolean)
        .slice(0, 2);

      // Also keep full rendered text for search indexing
      const textContent = poem.templateContent.replace(/<[^>]+>/g, "");
      const firstLinesText = firstLinesArray.join(" ");

      return {
        title: poem.data.title,
        url: poem.url,
        date: new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(poem.date),
        tags: poem.data.tags || [],
        excerpt: firstLinesText,          // keep existing string for compatibility
        excerptLines: firstLinesArray,    // NEW: array of first lines
        content: textContent,
      };
    });

    fs.writeFileSync(path.join("dist", "search.json"), JSON.stringify(data, null, 2));
    console.log("✅ search.json generated!");
  });


  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "layouts",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
