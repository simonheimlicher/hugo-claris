/* File='scripts/claris/hugo-params.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

// Parameters read from Hugo configuration
window.clarisHugoParams = {
  baseURL: '{{ default "/" site.BaseURL }}',
  iconsPath: '{{ absURL (printf "%s/" (default "icons/" (strings.TrimLeft "/" (strings.TrimRight "/" site.Params.iconsDir) ) ) ) }}',
  showImagePosition: '{{ site.Params.figurePositionShow }}',
  showImagePositionLabel: '{{ site.Params.figurePositionLabel }}',

  parentURL: window.location.protocol + "//" + window.location.host + "/",
  // The DOM element that we use to indicate properties of the browser and state of the page
  htmlRootElement: document.documentElement,

  htmlRootClassNoJavaScript: 'no-js',
  htmlRootClassModernJavaScript: 'modern-js',
  htmlRootClassNoCSSProperties: 'no-css-prop',
  htmlRootClassNoCSSGrid: 'no-css-grid',
  inline: ':inline',
};
// const baseURL = clarisHugoParams.baseURL;
// const iconsPath = clarisHugoParams.iconsPath;
// const showImagePosition = clarisHugoParams.showImagePosition;
// const showImagePositionLabel = clarisHugoParams.showImagePositionLabel;

// const doc = document.documentElement;
// const parentURL = clarisHugoParams.parentURL;
// const htmlRootElement = clarisHugoParams.htmlRootElement;

// const htmlRootClassNoJavaScript = clarisHugoParams.htmlRootClassNoJavaScript;
// const htmlRootClassModernJavaScript = clarisHugoParams.htmlRootClassModernJavaScript;
// const htmlRootClassNoCSSProperties = clarisHugoParams.htmlRootClassNoCSSProperties;
// const htmlRootClassNoCSSGrid = clarisHugoParams.htmlRootClassNoCSSGrid;
// const inline = clarisHugoParams.inline;
