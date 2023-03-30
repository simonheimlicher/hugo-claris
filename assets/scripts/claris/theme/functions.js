// global variables
const doc = document.documentElement;
export function isObj(obj) {
  return (obj && typeof obj === 'object' && obj !== null) ? true : false;
}

export function createEl(element) {
  return document.createElement(element);
}

export function elem(selector, parent) {
  parent = parent || document;
  let elem = parent.querySelector(selector);
  return elem != false ? elem : false;
}

export function elems(selector, parent) {
  parent = parent || document;
  let elems = parent.querySelectorAll(selector);
  return elems.length ? elems : false;
}

export function pushClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    let elClass = el.classList;
    elClass.contains(targetClass) ? false : elClass.add(targetClass);
  }
}

export function hasClasses(el) {
  if(isObj(el)) {
    const classes = el.classList;
    return classes.length
  }
}

export function deleteClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    let elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : false;
  }
}

export function modifyClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    let elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : elClass.add(targetClass);
  }
}

export function containsClass(el, targetClass) {
  if (isObj(el) && targetClass && el !== document ) {
    return el.classList.contains(targetClass) ? true : false;
  }
}

export function elemAttribute(elem, attr, value) {
  value = value || null;
  if (value) {
    elem.setAttribute(attr, value);
  } else {
    value = elem.getAttribute(attr);
    return value ? value : false;
  }
}

export function wrapEl(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

export function deleteChars(str, subs) {
  let newStr = str;
  if (Array.isArray(subs)) {
    for (let i = 0; i < subs.length; i++) {
      newStr = newStr.replace(subs[i], '');
    }
  } else {
    newStr = newStr.replace(subs, '');
  }
  return newStr;
}

export function isBlank(str) {
  return (!str || str.trim().length === 0);
}

export function isMatch(element, selectors) {
  if(isObj(element)) {
    if(selectors.isArray) {
      let matching = selectors.map(function(selector){
        return element.matches(selector)
      })
      return matching.includes(true);
    }
    return element.matches(selectors)
  }
}

export function copyToClipboard(str) {
  let copy, selection, selected;
  copy = createEl('textarea');
  copy.value = str;
  copy.setAttribute('readonly', '');
  copy.style.position = 'absolute';
  copy.style.left = '-9999px';
  selection = document.getSelection();
  doc.appendChild(copy);
  // check if there is any selected content
  selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
  copy.select();
  document.execCommand('copy');
  doc.removeChild(copy);
  if (selected) { // if a selection existed before copying
    selection.removeAllRanges(); // unselect existing selection
    selection.addRange(selected); // restore the original selection
  }
}

export function getMobileOperatingSystem() {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
}

export function horizontalSwipe(element, func, direction) {
  // call func if result of swipeDirection() 👇🏻 is equal to direction
  let touchstartX = 0;
  let touchendX = 0;
  let swipeDirection = null;

  function handleGesure() {
    return (touchendX + 50 < touchstartX) ? 'left' : (touchendX < touchstartX + 50) ? 'right' : false;
  }

  element.addEventListener('touchstart', function(e) {
    touchstartX = e.changedTouches[0].screenX
  });

  element.addEventListener('touchend', function(e) {
    touchendX = e.changedTouches[0].screenX
    swipeDirection = handleGesure()
    swipeDirection === direction ? func() : false;
  });

}

export function parseBoolean(string) {
  let bool;
  string = string.trim().toLowerCase();
  switch (string) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
};

(function() {
  const userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  const bodyElement = elem('body');
  if (macosPlatforms.indexOf(platform) !== -1) {
    pushClass(bodyElement, 'macos');
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    pushClass(bodyElement, 'ios');
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    pushClass(bodyElement, 'windows');
  } else if (/Android/.test(userAgent)) {
    pushClass(bodyElement, 'android');
  } else if (!os && /Linux/.test(platform)) {
    pushClass(bodyElement, 'linux');
  }
  if (window.MSInputMethodContext && document.documentMode) {
    pushClass(bodyElement, 'legacyJS');
  }
})();