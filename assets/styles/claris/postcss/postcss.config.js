module.exports = {
  plugins: [
    //  require("autoprefixer")({}),
    // Source: https://purgecss.com/guides/hugo.html
    require("@fullhuman/postcss-purgecss")({
      content: ["./hugo_stats.json"],
      defaultExtractor: (content) => {
        const els = JSON.parse(content).htmlElements;
        return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
      },
      safelist: [],
      // variables: true,
    }),
  ]
};
