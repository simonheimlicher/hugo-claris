module.exports = {
  plugins: [
     require("autoprefixer")({
      overrideBrowserslist: [
        '>=0.25%',
        'ie 11',
        'last 2 versions',
        'not op_mini all'
      ],
      //grid: "autoplace",
      grid: true,
     }),
     require('postcss-object-fit-images')({}),
     // FIXME: Does inject elements but does not achieve the objective
     // require('postcss-aspect-ratio-polyfill')({}),
     require('postcss-custom-properties')({
      preserve: true,
     }),
    // Source: https://purgecss.com/guides/hugo.html
    require("@fullhuman/postcss-purgecss")({
      content: ["./hugo_stats.json"],
      defaultExtractor: (content) => {
        const els = JSON.parse(content).htmlElements;
        return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
      },
      safelist: [],
    }),
  ]
};
