// Parameters read from Hugo configuration
import * as params from '@params';

export function clarisHugoParamsInit() {
  // console.log(`clarisHugoParamsInit: params:`, params);
  window.clarisHugoParams = window.clarisHugoParams || clarisHugoParams;
}

export const clarisHugoParams = {

  // Params passed to Hugo in the asset pipeline in `claris/_functions/script-bundles.html`
  baseURL: params.baseURL,
  iconsPath: params.iconsPath,
  envDevel: params.envDevel,
  envProd: params.envProd,

  // Params to be defined and re-used in other modules
  parentURL: window.location.protocol + "//" + window.location.host + "/",
  // The DOM element that we use to indicate properties of the browser and state of the page
  htmlRootElement: document.documentElement,

  htmlRootClassNoJavaScript: 'no-js',
  htmlRootClassModernJavaScript: 'modern-js',
  htmlRootClassNoCSSProperties: 'no-css-prop',
  htmlRootClassNoCSSGrid: 'no-css-grid',
  inline: ':inline',
};
