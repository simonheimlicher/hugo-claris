// Source: https://purgecss.com/guides/hugo.html
const purgeCSS = require("@fullhuman/postcss-purgecss")({
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
  variables: true,
  // fontFace: true,
});

const varOptimize = require('postcss-var-optimize');

const pruneVar = require('postcss-prune-var')({
  skip: ['node_modules/**']
});


module.exports = {
  plugins: [
    require("autoprefixer")({}),
    // FIXME: Should pass the name of the environments in which to enable CSS purging
    // as a parameter instead of hardcoding it as an array below
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [purgeCSS, varOptimize, pruneVar] : []),
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [pruneVar, purgeCSS, varOptimize] : []),
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [pruneVar, varOptimize, purgeCSS] : []),
    ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [varOptimize, pruneVar, purgeCSS] : []),
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [purgeCSS] : []),
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [varOptimize] : []),
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [pruneVar, purgeCSS] : []),
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [varOptimize, purgeCSS] : []),
    // ...(['stage', 'prod', 'production'].includes(process.env.HUGO_ENVIRONMENT) ? [varOptimize, pruneVar] : []),
  ]
};
