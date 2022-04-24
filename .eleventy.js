const tinycolor = require("tinycolor2");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("totalEntries", (colors) => {
    return colors.reduce((prev, current) => prev + current.count, 0);
  });

  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  eleventyConfig.addFilter("unloved", function (colors, allColors) {
    const unlovedNames = allColors.filter(
      (color) => !colors.find((c) => c.color === color)
    );

    const unlovedColors = [];
    for (const color of unlovedNames) {
      let contrastColor = tinycolor
        .mostReadable(color, ["#fff"], {
          includeFallbackColors: true,
          level: "AA",
          size: "large",
        })
        .toHexString();
      unlovedColors.push({ color, contrastColor });
    }

    unlovedColors.sort((a, b) => a.color.localeCompare(b.color));

    return unlovedColors;
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
