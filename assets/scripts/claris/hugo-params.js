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
