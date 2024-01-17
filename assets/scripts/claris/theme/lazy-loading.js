/*
NOTE: Lazy loading of images, i.e., loading them only when they are about to
enter the viewport, is supported in recent browsers:
https://caniuse.com/loading-lazy-attr

However, the crux of the matter is the following: To provide a fallback for
older browsers without lazy loading, we need to keep them from loading images
eagerly, i.e., immeadiately on page load. This is accomplished by not setting
`src` and `srcset` to valid values. Instead, we provide some placeholder in the
`src` attribute.

The sad consequence of this is that now we need JavaScript to enable images for
browsers that support native lazy loading. So the approach is as follows:

Detect if the browser supports native lazy loading and proceed accordingly.

YES: Replace the value of the `src` attribute with the value of `data-src` and
the value of `srcset` with the value of `data-srcset`

NO: Load lazysizes from a CDN and let it take care of lazyloading using the
value in the `data` attributes

FIXME: Safari 16.4 does not reliably load images lazily when the `src` attribute
is set after 'DOMContentLoaded'. therefore, we additionally fire a second time
on 'load'.

*/

import {
  deb,
} from './functions';

// Source: https://alistairshepherd.uk/writing/image-lazyload-conditional-polyfill/
let lazyLoadingInitDone = false;
// in a function so we can re-run if data is added dynamically
export function lazyLoadingInit() {
  // check if loading attribute supported
  if ('loading' in HTMLImageElement.prototype) {
    // FIXME: Safari 16.4 does not respond to swapping in new value for `src`, therefore we schedule a
    // second execution after the load event
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') <= -1;

    // get all <img> and <source> elements
    const images = document.querySelectorAll('img[data-src]');
    const sources = document.querySelectorAll('source[data-srcset]');

    if (!lazyLoadingInitDone) {
      deb('claris/theme/lazy-loading: Browser supports native lazy loading. Swap in value of attribute `data-src` for `src` and `data-srcset` for `srcset`');
    }
    else {
      deb('claris/theme/lazy-loading: Second round');
    }

    // loop through <img>s setting the src attribute and srcset and sizes if present
    // but only if there is no data-media attribute
    for (let img of images) {
      if (!img.dataset.media || !img.dataset.media.includes('prefers-color-scheme')) {
        // deb('Swapping in src for ', img);
        try {
          img.src = img.dataset.src;
          if (!isSafariBrowser || lazyLoadingInitDone) {
            delete img.dataset.src;
          }
          const srcset = img.dataset.srcset;
          if (srcset) {
            deb('Swapping in srcset for ', img);
            img.srcset = srcset;
            if (!isSafariBrowser || lazyLoadingInitDone) {
              delete img.dataset.srcset;
            }
          }
          const sizes = img.dataset.sizes;
          if (sizes) {
            img.sizes = sizes;
            if (!isSafariBrowser || lazyLoadingInitDone) {
              delete img.dataset.sizes;
            }
          }
        }
        catch (e) {
          deb('Failed to swap in src or srcset for img=', img, '\nException: ', e);
        }
      }
    }

    // loop through <source>s setting the srcset attribute and sizes if present
    // but only if there is no data-media attribute
    for (let source of sources) {
      if (!source.dataset.media || !source.dataset.media.includes('prefers-color-scheme')) {
        try {
          source.srcset = source.dataset.srcset;
          if (!isSafariBrowser || lazyLoadingInitDone) {
            delete source.dataset.srcset;
          }
          const sizes = source.dataset.sizes;
          if (sizes) {
            source.sizes = sizes;
            if (!isSafariBrowser || lazyLoadingInitDone) {
              delete source.dataset.sizes;
            }
          }
        }
        catch (e) {
          deb('Failed to swap in srcset for source=', source, '\nException: ', e);
        }
      }
    }

    if (isSafariBrowser && ! lazyLoadingInitDone) {
      deb('claris/theme/lazy-loading: Schedule a second round of swapping in values for `src` and `srcset`');
      window.addEventListener('load', lazyLoadingInit);
      if (document.readyState === "loaded") {
        // If the `load` event has already fired, let's just execute again right now
        deb('claris/theme/lazy-loading: document.readyState='
          + document.readyState + '. Call init initLazyLoading again right now');
        lazyLoadingInit();
      }
    }

  // if loading attribute is not supported
  } else {
    // check we haven't already loaded the library
    if (!lazyLoadingInitDone) {
      // create script element with src pointing to our library and add to document
      const lazySizesScript = document.createElement('script');
      lazySizesScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
      document.body.appendChild(lazySizesScript);

      const lazySizesParentFitScript = document.createElement('script');
      lazySizesParentFitScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/plugins/parent-fit/ls.parent-fit.min.js';
      document.body.appendChild(lazySizesParentFitScript);

      deb('claris/theme/lazy-loading: Browser does not support native lazy loading. Imported lazySizes=', lazySizesScript);
    }
  }
  lazyLoadingInitDone = true;
}
