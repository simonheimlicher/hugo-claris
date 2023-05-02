/* File='scripts/claris/hugo-params.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

// Parameters read from Hugo configuration
const clarisHugoParamsInit = function() {
  window.clarisHugoParams = {
    baseURL: '{{ default "/" site.BaseURL }}',
    iconsPath: '{{ absURL (printf "%s/" (default "icons/" (strings.TrimLeft "/" (strings.TrimRight "/" site.Params.iconsDir) ) ) ) }}',
    showImagePosition: '{{ site.Params.figurePositionShow }}',
    showImagePositionLabel: '{{ site.Params.figurePositionLabel }}',

    envDevel: `{{ partialCached "claris/_functions/is-build-environment" "devel" "devel" hugo.Environment }}`,
    envProd : `{{ partialCached "claris/_functions/is-build-environment" "prod" "prod" hugo.Environment }}`,

    parentURL: window.location.protocol + "//" + window.location.host + "/",
    // The DOM element that we use to indicate properties of the browser and state of the page
    htmlRootElement: document.documentElement,

    htmlRootClassNoJavaScript: 'no-js',
    htmlRootClassModernJavaScript: 'modern-js',
    htmlRootClassNoCSSProperties: 'no-css-prop',
    htmlRootClassNoCSSGrid: 'no-css-grid',
    inline: ':inline',
  };
}();
