// console.log('BEGIN claris-head');

import 'lazysizes';

// Since we use CSS attribute 'object-fit', lazy loading cannot infer
// the size of the displayed image from the <img> element.
// The plugin 'parant-fit' could take care of this gap but probably requires
// some changes to the partial 'claris/responsive-image' to work properly.
// https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/parent-fit
// https://github.com/aFarkas/lazysizes/issues/508#issuecomment-397545775
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

// console.log('END   claris-head');
