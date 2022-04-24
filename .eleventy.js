module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("totalEntries", (colors) => {
    return colors.reduce((prev, current) => prev + current.count, 0);
  });

  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
