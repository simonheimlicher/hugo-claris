// console.log('BEGIN theme/enhanced.js');
import {
  pushClass
} from './functions';

const themeEnhancedInit = function () {
  const htmlRootElement = clarisHugoParams.htmlRootElement;
  const htmlRootClassModernJavaScript = clarisHugoParams.htmlRootClassModernJavaScript;
    pushClass(htmlRootElement, htmlRootClassModernJavaScript);
};
window.addEventListener('DOMContentLoaded', themeEnhancedInit);

import "./table-of-contents";
import './code';
// import './format-url';

import './qrcode-svg';

import mediumZoom from 'medium-zoom';
const mediumZoomInit = function () {
  const mediumZoomOptions = {
    container: {
      top: 48,
      right: 24,
      bottom: 48,
      left: 24
    },
    background: 'inherit',
  };

  mediumZoom('[data-zoomable]', mediumZoomOptions);
}
document.addEventListener('DOMContentLoaded', mediumZoomInit);

// FIXME: The below does not appear to work
// document.addEventListener("lazybeforeunveil", e => {
//   mediumZoom("[data-zoomable]", mediumZoomOptions);
// });

import './web-vitals-analytics';

// console.log('END   theme/enhanced.js');
