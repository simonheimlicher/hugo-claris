// Source: https://purgecss.com/guides/hugo.html
const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
  },
  // https://github.com/gohugoio/hugo/issues/10338
  // https://discourse.gohugo.io/t/purgecss-and-highlighting/41021
  safelist: {
    greedy: [/highlight/, /chroma/, /open$/]
  },
  // variables: true,
});

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
    // FIXME: Need to pass in the environments that should enable PurgeCSS
    // as a parameter instead of hardcoding
    ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [purgecss] : []),
  ]
};
