import {
  deb,
  eventTarget,
  elem,
  pushClass,
  containsClass,
  elemAttribute,
  isObj,
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
   * FIXME: Should use this approach
   * https://stackoverflow.com/a/75124760/617559
   * https://jsfiddle.net/35e0a97a/xmt1k659/78/
   */

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
    const colorSchemeMatchRegex = new RegExp(`\\(\\s*prefers-color-scheme:\\s*${scheme}\\)`);
    const colorSchemeEliminateRegex = new RegExp(`(\\s*and\\s*)?${colorSchemeMatchRegex.source}(\\s*and\\s*)?`);
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
          // eliminate the 'prefers-scholor-scheme' condition to show the image
          // independently of the preferred color scheme...
          if (source?.dataset.media.match(colorSchemeMatchRegex)) {
            source.media = source.dataset.media.replace(colorSchemeEliminateRegex, '') || 'all';
            // deb('source.dataset.media=' + source.dataset.media + ' --> ' + source.media);
            source.srcset = source.dataset.srcset;
            variantStyleAttr = source.dataset.style;
          // ... otherwise, remove the 'srcset' attribute to hide the image
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

  function updateMetaColorScheme(schemeUser) {
    let schemeSystem = schemeUser === 'dark' ? 'light' : 'dark';
    let prefersMetaUser = document.head.querySelector('meta[name=theme-color][media*="prefers-color-scheme: ' + schemeUser + '"]');
    if (!isObj(prefersMetaUser)) {
      deb('claris/theme/color-scheme: Missing prefers-color-scheme meta for system schemeUser=', schemeUser);
      return;
    }
    let dataMetaUser = document.head.querySelector('meta[name=data-theme-color][media*="prefers-color-scheme: ' + schemeUser + '"]');
    if (window.matchMedia('(prefers-color-scheme: ' + schemeUser).matches) {
      deb('claris/theme/color-scheme: system scheme[' + schemeSystem + '] matches user scheme[' + schemeUser + ']');
      if (isObj(dataMetaUser)) {
        // Restore content from value saved in 'data-theme-color' attribute
        prefersMetaUser.content = dataMetaUser.content;
        deb('claris/theme/color-scheme: restored prefersMetaUser[' + schemeUser + '] from dataMetaUser[' + schemeUser + ']: ', prefersMetaUser);
      }
    }
    else {
      deb('claris/theme/color-scheme: system scheme[' + schemeSystem + '] is different from user scheme[' + schemeUser + ']');
      if (!window.matchMedia('(prefers-color-scheme: ' + schemeSystem).matches) {
        deb('claris/theme/color-scheme: system scheme DOES NOT match other scheme ' + schemeSystem);
        return;
      }
      let prefersMetaSystem = document.head.querySelector('meta[name=theme-color][media*="prefers-color-scheme: ' + schemeSystem + '"]');
      if (!isObj(prefersMetaSystem)) {
        deb('claris/theme/color-scheme: Missing prefers-color-scheme meta for schemeSystem=', schemeSystem);
        return;
      }
      if (!isObj(dataMetaUser)) {
        dataMetaUser = document.createElement('meta');
        dataMetaUser.name = "data-theme-color";
        dataMetaUser.media = "(prefers-color-scheme: " + schemeUser;
        dataMetaUser.content = prefersMetaUser.content;
        document.head.appendChild(dataMetaUser);
        deb('claris/theme/color-scheme: Saved user theme prefers-color-scheme: ' + schemeUser + ': ', dataMetaUser);
      }
      deb('claris/theme/color-scheme: dataMetaUser: ', dataMetaUser);

      let dataMetaSystem = document.head.querySelector('meta[name=data-theme-color][media*="prefers-color-scheme: ' + schemeSystem + '"]');
      if (!isObj(dataMetaSystem)) {
        dataMetaSystem = document.createElement('meta');
        dataMetaSystem.name = "data-theme-color";
        dataMetaSystem.media = "(prefers-color-scheme: " + schemeSystem;
        dataMetaSystem.content = prefersMetaSystem.content;
        document.head.appendChild(dataMetaSystem);
        deb('claris/theme/color-scheme: Saved system theme prefers-color-scheme: ' + schemeSystem + ': ', dataMetaSystem);
      }
      deb('claris/theme/color-scheme: dataMetaSystem: ', dataMetaSystem);

      prefersMetaSystem.content = dataMetaUser.content;
      deb('claris/theme/color-scheme: override prefersMetaSystem[' + schemeSystem + '] from dataMetaUser[' + schemeUser + ']: ', prefersMetaSystem);
    }
  }

  function updateColorScheme(scheme) {
    updateMetaColorScheme(scheme);
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

  // FIXME: Moved into claris/head/assets to allow loading
  // variant images before JavaScript bundle has been fetchd
  // setUserColorScheme();

  const initColorSchemeToggle = function () {
    const htmlRootElement = clarisHugoParams.htmlRootElement;
    const htmlRootClassNoCSSProperties = clarisHugoParams.htmlRootClassNoCSSProperties;

    if (containsClass(htmlRootElement, htmlRootClassNoCSSProperties)) {
      deb(`claris/theme/color-scheme: ${htmlRootElement} contains class ${htmlRootClassNoCSSProperties}}`);
      return;
    }

    const colorSchemeNav = elem('.nav_color-scheme_choice');
    if (!colorSchemeNav) {
      deb('claris/theme/color-scheme: .nav_color-scheme_choice not found');
      return;
    }
    colorSchemeNav.style = "display: block";

    document.querySelector('.nav_color-scheme_choice').addEventListener('click', function (event) {
      setUserColorScheme(true, true);
    });
  };
  window.addEventListener('DOMContentLoaded', initColorSchemeToggle);
}();
