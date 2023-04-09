// console.log('BEGIN legacy.js');
// import 'object-fit-images'; // Not sufficient. Need to call objectFitImages()
import objectFitImages from 'object-fit-images';
function initializeObjectFitImages() {
  objectFitImages();
}
window.addEventListener("DOMContentLoaded", initializeObjectFitImages);

import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

// LazySizes polyfills
// FIXME: no effect in IE 11 visible
// import 'lazysizes/plugins/respimg/ls.respimg';

// FIXME: no effect in IE 11 visible
// if (!('object-fit' in document.createElement('a').style)) {
//   require('lazysizes/plugins/object-fit/ls.object-fit');
// }


// import 'picturefill';

import 'scripts/claris/theme/minimal';
// console.log('END   legacy.js');
