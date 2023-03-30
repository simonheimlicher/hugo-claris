// variables read from your hugo configuration
{{- $s := site }}
{{- $p := site.Params }}
export const baseURL = '{{ default "/" $s.BaseURL }}';
export const iconsPath = '{{ default "icons/" $p.iconsDir }}';
export const showImagePosition = "{{ $p.figurePositionShow }}";
export const showImagePositionLabel = '{{ $p.figurePositionLabel }}';

export const htmlRootClassNoJavaScript = 'no-js';
export const htmlRootClassModernJavaScript = 'modern-js';
export const htmlRootClassNoCSSProperties = 'no-css-prop';
export const htmlRootClassNoCSSGrid = 'no-css-grid';
export const pageHasLoaded = 'DOMContentLoaded';
export const inline = ":inline";