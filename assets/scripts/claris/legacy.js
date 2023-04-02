// console.log('BEGIN legacy.js');
import objectFitImages from 'object-fit-images';
function initializeObjectFitImages() {
    // CSS rules
    const objectFitImagesRules = ".object-fit-cover { font-family: 'object-fit: cover; object-position: center center;' }";

    const css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet) css.styleSheet.cssText = objectFitImagesRules; // Support for IE
    else css.appendChild(document.createTextNode(objectFitImagesRules)); // Support for the rest
    document.getElementsByTagName("head")[0].appendChild(css);
    objectFitImages();
}
window.addEventListener("DOMContentLoaded", initializeObjectFitImages);

import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

// polyfills
/*
import 'lazysizes/plugins/respimg/ls.respimg';

if (!('object-fit' in document.createElement('a').style)) {
	require('lazysizes/plugins/object-fit/ls.object-fit');
}
*/

import 'scripts/claris/theme/minimal';
// console.log('END   legacy.js');
