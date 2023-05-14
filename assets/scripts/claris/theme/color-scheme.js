import {
  deb,
  eventTarget,
  elem,
  pushClass,
  containsClass,
  elemAttribute,
} from './functions';

const initColorScheme = function () {
  var bank;
  try {
    var storage = window.localStorage;
    var x = 'test_localstorage_available_' + Date.now();
    storage.setItem(x, x);
    var y = storage.getItem(x);
    storage.removeItem(x);
    if (x !== y) {
      throw new Error();
    }
    bank = storage; // Yippee, all is fine!
  }
  catch (exception) {
    bank = undefined
  }

  /**
   * Make <picture> <source> elements with media="(prefers-color-scheme:)"
   * respect custom theme preference overrides.
   * Otherwise the `media` preference will only respond to the OS-level setting
   * Unfortunately, if the user overrides the preferred color scheme,
   * the image resource for the preferred color scheme will already have been requested
   * by the time JavaScript is executed. Therefore, we need to initially put a
   * placeholder in the srcset attribute and then switch over to the correct image
   * in the function below.
   * Source: https://larsmagnus.co/blog/how-to-make-images-react-to-light-and-dark-scheme
   */
  function updateSourceMedia(scheme) {
    const pictures = document.querySelectorAll('picture');
    pictures.forEach((picture) => {
      let variantStyleAttr = null;

      const sources = picture.querySelectorAll(`
          source[media*="prefers-color-scheme"],
          source[data-media*="prefers-color-scheme"]
        `);

      sources.forEach((source) => {
        // Preserve the source `media` as a data-attribute
        // to be able to switch between preferences
        if (source?.media.includes('prefers-color-scheme')) {
          source.dataset.media = source.media;
        }

        // If argument 'scheme' is defined, we override the behavior of the browser
        if (scheme) {
          // If the source element `media` target is the `preference`,
          // override the 'media' attribute to 'all' to show the image
          // or remove the 'srcset' attribute to hide the image
          if (source?.dataset.media.includes(scheme)) {
            source.media = source.dataset.media.replace(/(\s*and\s*)?\(\s*prefers-color-scheme[^)]+\)(\s*and\s*)?/, '');
            source.srcset = source.dataset.srcset;
            variantStyleAttr = source.dataset.style;
          } else if (source.srcset) {
            source.media = source.dataset.media;
            source.srcset = [];
          }
        }
        // Otherwise, we let the browser decide which image to load
        else {
          source.media = source.dataset.media;
          source.srcset = source.dataset.srcset;
          variantStyleAttr = source.dataset.style;
        }
      });

      if (variantStyleAttr) {
        const imgs = picture.querySelectorAll(`img[style]`);
        imgs.forEach((img) => {
          if (img?.style) {
            img.dataset.style = img.style;
          }
          img.style = variantStyleAttr;
        });
      }
    });

}

  function updateDocumentColorScheme(scheme) {
    elemAttribute(document.documentElement, 'data-color-scheme', scheme);
  }

  function updateColorScheme(scheme) {
    updateDocumentColorScheme(scheme);
    updateSourceMedia(scheme);
  }

  function currentColorScheme() {
    return getComputedStyle(document.documentElement).getPropertyValue('--color-scheme').replace(/[^\w]+/g, '').trim();
  }

  function setStoredColorScheme(scheme) {
    if (bank) {
      bank.setItem('userSelectedColorScheme', scheme);
    }
  }

  function getStoredColorScheme() {
    if (bank) {
      return bank.getItem('userSelectedColorScheme');
    }
  }

  function changeColorScheme(isDarkColorScheme) {
    if (isDarkColorScheme) {
      updateColorScheme('light');
      setStoredColorScheme('light')
    } else {
      updateColorScheme('dark');
      setStoredColorScheme('dark');
    }
  }

  function setUserColorScheme(scheme, transition) {
    scheme = scheme || false;
    transition = transition || false;
    if (transition) {
      clarisHugoParams.htmlRootElement.dataset.colorSchemeTransition = true;
      window.setTimeout(() => {
        delete clarisHugoParams.htmlRootElement.dataset.colorSchemeTransition;
      }, 700);
    }
    const isDarkColorScheme = currentColorScheme() == 'dark';
    const storedColorScheme = getStoredColorScheme();
    if (storedColorScheme) {
      if (scheme) {
        changeColorScheme(isDarkColorScheme);
      } else {
        updateColorScheme(storedColorScheme);
      }
    } else {
      if (scheme === true) {
        changeColorScheme(isDarkColorScheme)
      }
      else {
        updateSourceMedia();
      }
    }
  }

  setUserColorScheme();

  const initColorSchemeToggle = function () {
    const htmlRootElement = clarisHugoParams.htmlRootElement;
    const htmlRootClassNoCSSProperties = clarisHugoParams.htmlRootClassNoCSSProperties;

    if (containsClass(htmlRootElement, htmlRootClassNoCSSProperties)) {
      deb(`claris/theme/color-scheme: #{htmlRootElement} contains class #{htmlRootClassNoCSSProperties}}`);
      return;
    }

    const colorSchemeNav = elem('.color-scheme');
    if (!colorSchemeNav) {
      deb('claris/theme/color-scheme: .color-scheme not found');
      return;
    }
    colorSchemeNav.style = "display: flex";

    document.querySelector('.color-scheme_choice').addEventListener('click', function (event) {
      pushClass(event.target, 'color_animate');
      setUserColorScheme(true, true);
    });
  };
  window.addEventListener('DOMContentLoaded', initColorSchemeToggle);
}();

