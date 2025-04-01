const deb = function () { /* This function is empty and will be stripped by ESBuild */  }
// NOTE: Uncomment this to enable debug output const deb = console.log;
export { deb };

export function isObj(obj) {
  return !!(obj && typeof obj === "object" && obj !== null);
}

export function createEl(element) {
  return document.createElement(element);
}

export function elem(selector, parent) {
  parent = parent || document;
  return parent.querySelector(selector);
}

export function elems(selector, parent) {
  parent = parent || document;
  let elems = parent.querySelectorAll(selector);
  return elems.length ? elems : false;
}

export function pushClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    let elClass = el.classList;
    elClass.contains(targetClass) || elClass.add(targetClass);
  }
}

export function hasClasses(el) {
  if (isObj(el)) {
    const classes = el.classList;
    return classes.length;
  }
}

export function deleteClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    let elClass = el.classList;
    elClass.contains(targetClass) && elClass.remove(targetClass);
  }
}

export function modifyClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    let elClass = el.classList;
    elClass.contains(targetClass)
      ? elClass.remove(targetClass)
      : elClass.add(targetClass);
  }
}

export function containsClass(el, targetClass) {
  if (isObj(el) && targetClass && el !== document) {
    return el.classList.contains(targetClass);
  }
}

export function elemAttribute(elem, attr, value) {
  value = value || null;
  if (value) {
    elem.setAttribute(attr, value);
  } else {
    value = elem.getAttribute(attr);
    return value || false;
  }
}

export function wrapEl(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

export function deleteChars(str, subs) {
  let newStr = str;
  if (Array.isArray(subs)) {
    for (const element of subs) {
      newStr = newStr.replace(element, "");
    }
  } else {
    newStr = newStr.replace(subs, "");
  }
  return newStr;
}

export function copyToClipboard(str) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(str)
      .then(function () {
      })
      .catch(function () {
        // Unexpected error
        alert("Failed to copy text to clipboard");
      });
  }
}

export function parseBoolean(string) {
  string = string.trim().toLowerCase();
  switch (string) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return undefined;
  }
}

// Ensure we load all modules in the right order and exactly once
// Earliest when DOMContentLoaded fires
// However, as this event might already have passed, especially on fast connections,
// we check the `readyState` and execute `init()` immediately if the document is
// no longer in the `loading` state
// From https://stackoverflow.com/a/7053197/617559
export function onDOMContentLoaded(...initializationFunctions) {
  function init() {
    initializationFunctions.forEach(function (fn) {
      fn();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
};
