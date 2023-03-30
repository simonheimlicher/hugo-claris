// console.log('BEGIN theme/enhanced.js');
import {
  htmlRootElement,
  htmlRootClassModernJavaScript,
  pushClass
} from './init';

pushClass(htmlRootElement, htmlRootClassModernJavaScript);

import "./table-of-contents";
import './code';
// import './format-url';
const mediumZoomOptions = {
  container: {
    top: 48,
    right: 24,
    bottom: 48,
    left: 24
  },
  background: 'var(--bg-light)',
};

import mediumZoom from 'medium-zoom';
mediumZoom('[data-zoomable]', mediumZoomOptions);

// FIXME: The below does not appear to work
// document.addEventListener("lazybeforeunveil", e => {
//   mediumZoom("[data-zoomable]", mediumZoomOptions);
// });
// console.log('END   theme/enhanced.js');
