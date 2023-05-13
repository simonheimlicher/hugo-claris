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
   * Source: https://larsmagnus.co/blog/how-to-make-images-react-to-light-and-dark-mode
   */
  function updateSourceMedia(scheme) {
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
          source.media = source.dataset.media.replace(/(\s*and\s*)?\(\s*prefers-color-scheme[^)]+\)(\s*and\s*)?/, '')
        } else if (source) {
          source.media = 'none'
        }
      })
    })
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

  function setStoredColorScheme(mode) {
    if (bank) {
      bank.setItem('userSelectedColorScheme', mode);
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

  function setUserColorScheme(mode) {
    mode = mode || false;
    const isDarkColorScheme = currentColorScheme() == 'dark';
    const storedColorScheme = getStoredColorScheme();
    if (storedColorScheme) {
      if (mode) {
        changeColorScheme(isDarkColorScheme);
      } else {
        updateColorScheme(storedColorScheme);
      }
    } else {
      if (mode === true) {
        changeColorScheme(isDarkColorScheme)
      }
    }
  }

  function setUserColorScheme(mode) {
    mode = mode || false;
    const isDarkColorScheme = currentColorScheme() == 'dark';
    const storedColorScheme = getStoredColorScheme();
    if (storedColorScheme) {
      if (mode) {
        changeColorScheme(isDarkColorScheme);
      } else {
        updateColorScheme(storedColorScheme);
      }
    } else {
      if (mode === true) {
        changeColorScheme(isDarkColorScheme)
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
      setUserColorScheme(true);
    });
  };
  window.addEventListener('DOMContentLoaded', initColorSchemeToggle);
}();

