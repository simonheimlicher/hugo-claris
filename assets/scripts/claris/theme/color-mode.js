import {
  deb,
  eventTarget,
  elem,
  pushClass,
  containsClass,
  elemAttribute,
} from './functions';

const initColorMode = function () {
  // console.log('claris/theme/color-mode: window.clarisHugoParams=', window.clarisHugoParams);
  const light = 'lit';
  const dark = 'dim';
  const storageKey = 'colorMode';
  const css_var = '--color-mode';
  const data_var = 'data-mode';

  const doc = document.documentElement;
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
   * Source: https://larsmagnus.co/blog/how-to-make-images-react-to-light-and-dark-mode
   */
  function updateSourceMedia(mode) {
    const colorScheme = {
      lit: 'light',
      dim: 'dark',
    };
    const scheme = colorScheme[mode];

    const pictures = document.querySelectorAll('picture')

    pictures.forEach((picture) => {
      const sources = picture.querySelectorAll(`
          source[media*="prefers-color-scheme"],
          source[data-media*="prefers-color-scheme"]
        `)

      sources.forEach((source) => {
        // Preserve the source `media` as a data-attribute
        // to be able to switch between preferences
        if (source?.media.includes('prefers-color-scheme')) {
          source.dataset.media = source.media
        }

        // If the source element `media` target is the `preference`,
        // override it to 'all' to show
        // or set it to 'none' to hide
        if (source?.dataset.media.includes(scheme)) {
          source.media = 'all'
        } else if (source) {
          source.media = 'none'
        }
      })
    })
  }

  function updateDocumentMode(mode) {
    elemAttribute(doc, data_var, mode);
  }

  function updateColorMode(mode) {
    updateDocumentMode(mode);
    updateSourceMedia(mode);
  }

  function currentMode() {
    // let acceptableChars = light + dark;
    // acceptableChars = [...acceptableChars];
    // let mode = getComputedStyle(doc).getPropertyValue(css_var).replace(/\"/g, '').trim();

    // mode = [...mode].filter(function(letter){
    //   return acceptableChars.includes(letter);
    // });

    // return mode.join('');
    return getComputedStyle(doc).getPropertyValue(css_var).replace(/[^\w]+/g, '').trim();
  }

  function setStoredMode(mode) {
    if (bank) {
      bank.setItem(storageKey, mode);
    }
  }

  function getStoredMode() {
    if (bank) {
      return bank.getItem(storageKey);
    }
  }

  function changeMode(isDarkMode) {
    if (isDarkMode) {
      // elemAttribute(doc, data_var, light);
      updateColorMode(light);
      setStoredMode(light)
    } else {
      // elemAttribute(doc, data_var, dark);
      updateColorMode(dark);
      setStoredMode(dark);
    }
  }

  function setUserColorMode(mode) {
    mode = mode || false;
    const isDarkMode = currentMode() == dark;
    const storedMode = getStoredMode();
    if (storedMode) {
      if (mode) {
        changeMode(isDarkMode);
      } else {
        // elemAttribute(doc, data_var, storedMode);
        updateColorMode(storedMode);
      }
    } else {
      if (mode === true) {
        changeMode(isDarkMode)
      }
    }
  }

  setUserColorMode();

  const initColorModeToggle = function () {
    const htmlRootElement = clarisHugoParams.htmlRootElement;
    const htmlRootClassNoCSSProperties = clarisHugoParams.htmlRootClassNoCSSProperties;

    if (containsClass(htmlRootElement, htmlRootClassNoCSSProperties)) {
      deb(`claris/theme/color-mode: #{htmlRootElement} contains class #{htmlRootClassNoCSSProperties}}`);
      return;
    }

    const doc = document.documentElement;
    const colorModeNav = elem('.color_mode');
    if (!colorModeNav) {
      deb('claris/theme/color-mode: .color_mode not found');
      return;
    }
    colorModeNav.style = "display: flex";

    doc.addEventListener('click', function (event) {
      let target = eventTarget(event);
      let modeClass = 'color_choice';
      let animateClass = 'color_animate';
      let isModeToggle = containsClass(target, modeClass);
      if (isModeToggle) {
        pushClass(target, animateClass);
        setUserColorMode(true);
      }
    });
  };
  window.addEventListener('DOMContentLoaded', initColorModeToggle);
}();

