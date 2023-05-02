// console.log('BEGIN claris-body');

import 'scripts/claris/theme/minimal';
import 'scripts/claris/theme/enhanced';

// import 'lazysizes';

// Since we use CSS attribute 'object-fit', lazy loading cannot infer
// the size of the displayed image from the <img> element.
// The plugin 'parant-fit' could take care of this gap but probably requires
// some changes to the partial 'claris/responsive-image' to work properly.
// https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/parent-fit
// https://github.com/aFarkas/lazysizes/issues/508#issuecomment-397545775
// import 'lazysizes/plugins/parent-fit/ls.parent-fit';

/*
(async () => {
  if ('loading' in HTMLImageElement.prototype) {
    console.log('claris-body: Browser supports native lazy loading');
    const images = document.querySelectorAll("img.lazyload");
      images.forEach(img => {
        img.srcset = img.dataset.srcset;
        img.src = img.dataset.src;
      });
  } else {
      // Dynamically import the LazySizes library
      const lazySizesLib = await import('lazysizes');
      // Initiate LazySizes (reads data-src & class=lazyload)
      lazySizes.init(); // lazySizes works off a global.
      console.log('claris-body: Browser does not support native lazy loading. Imported lazySizes=', lazySizes);
    }
})();
*/

// Source: https://alistairshepherd.uk/writing/image-lazyload-conditional-polyfill/
let polyfillLoadingLoaded = false;
// in a function so we cn re-run if data is added dynamically
window.loadingPolyfill = () => {
  // check if loading attribute supported
  if ('loading' in HTMLImageElement.prototype) {
    // get all <img> and <source> elements
    const images = document.querySelectorAll('img[data-src]');
    const sources = document.querySelectorAll('source[data-srcset]');

    // loop through <img>s setting the src attribute and srcset and sizes if present
    for (let img of images) {
      img.src = img.getAttribute('data-src');
      const srcset = img.getAttribute('data-srcset');
      if (srcset) {
        img.srcset = srcset;
      }
      const sizes = img.getAttribute('data-sizes');
      if (sizes) {
        img.sizes = sizes;
      }
    }

    // loop through <source>s setting the srcset attribute and sizes if present
    for (let source of sources) {
      source.srcset = source.getAttribute('data-srcset');
      const sizes = source.getAttribute('data-sizes');
      if (sizes) {
        source.sizes = sizes
      }
    }

  // if loading attribute is not supported
  } else {
    // check we haven't already loaded the library
    if (!polyfillLoadingLoaded) {
      // create script element with src pointing to our library and add to document
      const lazySizesScript = document.createElement('script');
      lazySizesScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
      document.body.appendChild(lazySizesScript);

      const lazySizesParentFitScript = document.createElement('script');
      lazySizesParentFitScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/plugins/parent-fit/ls.parent-fit.min.js';
      document.body.appendChild(lazySizesParentFitScript);

      // console.log('claris-body: Browser does not support native lazy loading. Imported lazySizes=', lazySizesScript);

      // mark library as loaded
      polyfillLoadingLoaded = true;

    // lazyloading library has already been loaded
    } else {
      // depending on your library you may need to run findNewItems() or something along
      // those lines to adapt new content. Some libraries including lazysizes don't need this.
    }
  }
}
// run our loading polyfill
window.loadingPolyfill();

// console.log('END   claris-body');
