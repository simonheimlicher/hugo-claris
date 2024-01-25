// Source: https://purgecss.com/guides/hugo.html
const cssElementsKeepRegex = [/highlight/, /chroma/, /open$/,
  /medium-zoom/, // medium-zomm.js
  /table_of_contents/, // table-of-contents.js
  /footnotes/, /footnotes-accessible/, /:target/, /fnref/, /visually-hidden/, // footnotes-accessible.js
  /link_yank/, // link-anchor.js
  /scrollable-table/, // scrollable-table.js
  /taxonomy-overlay/, // taxonomy-overlay.js
  /color-scheme/, // color-scheme.js
];
const cssCustomPropertiesKeepRegex = [
  /highlight-bg-yellow/, // footnotes-accessible.js
  /color-scheme/, // color-scheme.js
  /note-bg/, // shortcode note
]
const purgeCSS = require("@fullhuman/postcss-purgecss")({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
  },
  // https://github.com/gohugoio/hugo/issues/10338
  // https://discourse.gohugo.io/t/purgecss-and-highlighting/41021
  safelist: {
    greedy: cssElementsKeepRegex,
    variables: cssCustomPropertiesKeepRegex,
  },
  variables: true,
  // fontFace: true,
});

const varOptimize = require('postcss-var-optimize')({
  blacklist: cssCustomPropertiesKeepRegex
});

// Cannot use `postcss-prune-var` if CSS custom properties are used in JavaScript
// We manipulate custom properties via JavaScript for `--color-scheme`, hence cannot use this plugin
/*
const pruneVar = require('postcss-prune-var')({
  skip: ['node_modules/**']
});
*/

module.exports = {
  plugins: [
    require("autoprefixer")({}),
    // FIXME: Should pass the name of the environments in which to enable CSS purging
    // as a parameter instead of hardcoding it as an array below
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [purgeCSS] : []),
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [varOptimize] : []),
    ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [varOptimize, purgeCSS] : []),
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [purgeCSS, varOptimize] : []),
  ]
};
