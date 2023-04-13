/* File='scripts/claris/hugo-params.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

// Parameters read from Hugo configuration
export const baseURL = '{{ default "/" site.BaseURL }}';
export const iconsPath = '{{ absURL (printf "%s/" (default "icons/" (strings.TrimLeft "/" (strings.TrimRight "/" site.Params.iconsDir) ) ) ) }}';
export const showImagePosition = '{{ site.Params.figurePositionShow }}';
export const showImagePositionLabel = '{{ site.Params.figurePositionLabel }}';

export const htmlRootClassNoJavaScript = 'no-js';
export const htmlRootClassModernJavaScript = 'modern-js';
export const htmlRootClassNoCSSProperties = 'no-css-prop';
export const htmlRootClassNoCSSGrid = 'no-css-grid';
export const pageHasLoaded = 'DOMContentLoaded';
export const inline = ":inline";

// export const HugoParams = {
//   baseURL: '{{ default "/" site.BaseURL }}',
//   iconsPath: '{{ absURL (printf "%s/" (default "icons/" (strings.TrimLeft "/" (strings.TrimRight "/" site.Params.iconsDir) ) ) ) }}',
//   showImagePosition: '{{ site.Params.figurePositionShow }}',
//   showImagePositionLabel: '{{ site.Params.figurePositionLabel }}',

//   htmlRootClassNoJavaScript: 'no-js',
//   htmlRootClassModernJavaScript: 'modern-js',
//   htmlRootClassNoCSSProperties: 'no-css-prop',
//   htmlRootClassNoCSSGrid: 'no-css-grid',
//   pageHasLoaded: 'DOMContentLoaded',
//   inline: ':inline',
// };

import {
  elem,
  pushClass,
  deleteClass
} from 'scripts/claris/theme/functions';

export const doc = document.documentElement;
export const parentURL = window.location.protocol + "//" + window.location.host + "/";
export const htmlRootElement = elem('html');

const grid_supported = typeof document.createElement('div').style.grid === 'string';
if ( ! grid_supported) {
  pushClass(htmlRootElement, htmlRootClassNoCSSGrid);
}

const css_properties_supported = window.CSS && CSS.supports('color', 'var(--CSS-property-support-validation)');
if ( ! css_properties_supported) {
  pushClass(htmlRootElement, htmlRootClassNoCSSProperties);
}

deleteClass(htmlRootElement, htmlRootClassNoJavaScript);

