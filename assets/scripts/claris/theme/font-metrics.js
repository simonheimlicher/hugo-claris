import {
  createEl,
  pushClass,
} from './functions';

const CONST = {
  "classNames": {
    "fallbackContainer": "fallback_container",
    "fallbackUnderlay": "fallback_underlay"
  },
  "includeNodeNames": ['DIV', 'ASIDE', 'HEADER', 'MAIN', 'FOOTER', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'UL', 'OL', 'DL', 'P'],
  "styleAttrs": [
    { "margin": { "policy": "transfer", "substitute": "0" } },
    { "padding": { "policy": "transfer", "substitute": "0" } },
    { "font-size": { "policy": "transfer" } },
    { "position": { "policy": "exclude", "values": ["absolute"] } },
    { "display": { "policy": "include", "values": ["block"] } }
  ]
}

// https://stackoverflow.com/a/48389433
const wrapAll = (target, wrapper = document.createElement('div')) => {
  ;[ ...target.childNodes ].forEach(child => wrapper.appendChild(child))
  target.appendChild(wrapper);
  return wrapper;
}
const wrapInPlace = (target, wrapper = document.createElement('div')) => {
  target.parentNode.insertBefore(wrapper, target);
  wrapper.appendChild(target);
  return wrapper;
}

const triageElement = (element) => {

  // const style = getComputedStyle(element);
  // const style = element.style;
  const style = element.style || getComputedStyle(element, '');

  if (style.hasOwnProperty('fontFamily')) {
    for (const styleAttr of CONST.styleAttrs) {
      console.log(`styleAttr ${styleAttr}`);
      // https://stackoverflow.com/a/5737136/617559
      Object.entries(styleAttr).forEach(([attr, value]) => {
        if (attr in style) {
          console.log(`Attr ${attr}=${style[attr]} --> ${value}`);
        }
        if (value.policy) {
          if (value.policy == "exclude") {
            if (style[attr] in value.values) {
              return "exclude";
            }
          }
          else if (value.policy == "include") {
            if (!style[attr] in value.values) {
              return "exclude";
            }
          }

          if (value.policy == "transfer") {
            return "transfer";
          }
        }

      });
      return "include";
    }
    return "exclude";
  }
}

// https://css-tricks.com/how-to-get-all-custom-properties-on-a-page-in-javascript/
// https://codepen.io/tylergaw/pen/abvjdaW/5061057013e6ddef39cf6b54a8d6bc1f
/*
 Check if the stylesheet is internal or hosted on the current domain.
 If it isn't, attempting to access sheet.cssRules will throw a cross origin error.
 See https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet#Notes

 NOTE: One problem this could raise is hosting stylesheets on a CDN with a
 different domain. Those would be cross origin, so you can't access them.
*/
const isSameDomain = (styleSheet) => {
  // Internal style blocks won't have an href value
  if (!styleSheet.href) {
    return true;
  }

  return styleSheet.href.indexOf(window.location.origin) === 0;
};

// https://css-tricks.com/how-to-get-all-custom-properties-on-a-page-in-javascript/
// https://codepen.io/tylergaw/pen/abvjdaW/5061057013e6ddef39cf6b54a8d6bc1f
/*
 Determine if the given rule is a CSSStyleRule
 See: https://developer.mozilla.org/en-US/docs/Web/API/CSSRule#Type_constants
*/
const isStyleRule = (rule) => rule.type === 1;

/**
 * Get all custom properties on a page
 * @return array<array[string, string]>
 * ex; [["--color-accent", "#b9f500"], ["--color-text", "#252525"], ...]
 */
const getCSSCustomPropIndex = () =>
  // styleSheets is array-like, so we convert it to an array.
  // Filter out any stylesheets not on this domain
  [...document.styleSheets].filter(isSameDomain).reduce(
    (finalArr, sheet) =>
      finalArr.concat(
        // cssRules is array-like, so we convert it to an array
        [...sheet.cssRules].filter(isStyleRule).reduce((propValArr, rule) => {
          // Discard any props that don't start with "--". Custom props are required to.
          const customProps = [...rule.styleMap.entries()].filter(
            ([propName]) => propName.indexOf("--") === 0
          );

          return [...propValArr, ...customProps];
        }, [])
      ),
    []
  );

// https://stackoverflow.com/a/36126329/617559
function getMatchedCSSRules(element) {
  var i, len, matchingCSSRules = [], sheets = document.styleSheets;

  function loopRules(rules) {
    var i, len, rule;

    for (i = 0, len = rules.length; i < len; i++) {
      rule = rules[i];
      if (rule instanceof CSSMediaRule) {
        if (window.matchMedia(rule.conditionText).matches) {
          loopRules(rule.cssRules);
        }
      } else if (rule instanceof CSSStyleRule) {
        if (element.matches(rule.selectorText)) {
          matchingCSSRules.push(rule);
        }
      }
    }
  };

  for (i = 0, len = sheets.length; i < len; i++) {
    loopRules(sheets[i].cssRules);
  }
  let mergedCSS = '';
  for (const oneCSSRule of matchingCSSRules) {
    mergedCSS += oneCSSRule.cssText.replace(/^[^\{]*\{\s*(.*?)\s*\}\s*$/, "$1");
  }
  return mergedCSS;
}

// https://stackoverflow.com/a/36126329/617559
function getMatchedCSSRulesForAttr(element, attr) {
  var i, len, matchingCSSRules = [], sheets = document.styleSheets;

  function loopRules(rules) {
    var i, len, rule;

    for (i = 0, len = rules.length; i < len; i++) {
      rule = rules[i];
      if (rule instanceof CSSMediaRule) {
        if (window.matchMedia(rule.conditionText).matches) {
          loopRules(rule.cssRules);
        }
      }
      else if (rule instanceof CSSSupportsRule) {
        // if (window.matchMedia(rule.conditionText).matches) {
          loopRules(rule.cssRules);
        // }
      } else if (rule instanceof CSSStyleRule) {
        if (element.matches(rule.selectorText)) {
          matchingCSSRules.push(rule);
        }
      }
      // else {
      //   console.log(`Ignore rule `, rule);
      // }
    }
  };

  for (i = 0, len = sheets.length; i < len; i++) {
    loopRules(sheets[i].cssRules);
  }
  let mergedCSS = '';
  for (const oneCSSRule of matchingCSSRules) {
    let cssText = oneCSSRule.cssText.replace(/^[^\{]*\{\s*(.*?)\s*\}\s*$/, "$1");
    let cssTextAttrs = cssText.split(/\s*;\s*/);
    for (const attrText of cssTextAttrs) {
      const attrList = attrText.split(/\s*:\s*/);
      if (attrList[0] == attr) {
        mergedCSS = attrList[1];
      }
    }
  }
  return mergedCSS;
}

const transferStyleAttributes = (element, targetElement) => {

  // const style = getComputedStyle(element);
  // const style = element.style;
  // const style = element.style || getComputedStyle(element, '');

  const elementProps = [...element.computedStyleMap().entries()].filter(
    ([propName]) => propName.indexOf("--") === 0
  );

  const parentCustomProps = [...element.parentNode.computedStyleMap().entries()].filter(
    ([propName]) => propName.indexOf("--") === 0
  );

  let customProps = [];
  for (const elProp of elementProps) {
    let add = true;
    for (const paProp of parentCustomProps) {
      if (paProp[0] == elProp[0]) {
        Object.entries(elProp[1]).forEach(([key, value]) => {
          if (value.toString() == paProp[1][key].toString()) {
            add = false;
          }
        });
        if (!add) {
          break;
        }
      }
    }
    if (add) {
      customProps.push(elProp);
    }
  }

  for (const prop of customProps) {
    targetElement.style.setProperty(prop[0], prop[1]);
  }

  for (const styleAttr of CONST.styleAttrs) {
    // https://stackoverflow.com/a/5737136/617559
    Object.entries(styleAttr).forEach(([attr, value]) => {
      // if (attr in style) {
      //   console.log(`Attr ${attr}=${style[attr]} --> ${value}`);
      // }
      if (value.policy == "transfer") {
        const attrValue = getMatchedCSSRulesForAttr(element, attr);
        targetElement.style[attr] = attrValue;
        if ("substitute" in value) {
          element.style[attr] = value.substitute;
        }
        console.log(`transfer styleAttr ${styleAttr}: ${targetElement.style[attr]} = ${attrValue}`);
      }
    });
  }
}

// FIXME: consider alternative: use &::after pseudo element: https://stackoverflow.com/a/11031378
const addFallbackFontUnderlay = (selector) => {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) {
    return;
  }
  for (const element of elements) {
    const fallbackContainer = document.createElement('div');
    pushClass(fallbackContainer, CONST.classNames.fallbackContainer);
    transferStyleAttributes(element, fallbackContainer);
    const fallbackUnderlay = element.cloneNode(true);
    wrapInPlace(element, fallbackContainer);
    fallbackContainer.appendChild(fallbackUnderlay);
  }
};

const getChildrenWithFontFamilyStyle = (parent, nodeNames = CONST.includeNodeNames) => {
  let chilrenWithFontFamily = [];
  for (const element of parent.children) {
    if (nodeNames.includes(element.nodeName)) {
      const elementFontFamilyStyle = element.style?.fontFamily || getComputedStyle(element, '')['fontFamily'];
      const parentFontFamilyStyle = element.parentNode.style?.fontFamily || getComputedStyle(element.parentNode, '')['fontFamily'];
      if (elementFontFamilyStyle && elementFontFamilyStyle != parentFontFamilyStyle) {
        console.log(elementFontFamilyStyle);
        const innerChildrenWithFontFamily = getChildrenWithFontFamilyStyle(element, nodeNames);
        if ( ["include", "transfer"].includes(triageElement(element)) ) {
          chilrenWithFontFamily.push(...innerChildrenWithFontFamily);
        }
        else {
          chilrenWithFontFamily.push(element);
        }
      }
    }
  }
  return chilrenWithFontFamily;
};

const getElementWithFontFamilyStyle = (selector, nodeNames = CONST.includeNodeNames) => {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) {
    return;
  }
  let elementsWithFontFamily = [];
  for (const element of elements) {
    if (nodeNames.includes(element.nodeName)) {
      const childrenFontFamilyStyle = getChildrenWithFontFamilyStyle(element, nodeNames);
      if (childrenFontFamilyStyle && childrenFontFamilyStyle.length > 0) {
        elementsWithFontFamily.push(...childrenFontFamilyStyle);
      }
      else {
        if ( ["include", "transfer"].includes(triageElement(element)) ) {
          elementsWithFontFamily.push(element);
        }
      }
    }
  }
  return elementsWithFontFamily;
};

/**
* Add blank stylesheet for highlight rule
* @returns {CSSStyleSheet} new blankstylesheet
*/
const appendBlankStyleSheet = () => {
  // Create the <style> tag
  var style = document.createElement("style");

  // WebKit hack :(
  style.appendChild(document.createTextNode(""));

  // Add the <style> element to the page
  document.head.appendChild(style);

  return style.sheet;
};

/**
* Add specified CSS rule to the specified stylesheet
* @param {CSSStyleSheet} sheet    a CSSStyleSheet object
* @param {string}        selector CSS selector rule; include “.” for classes or “#” for IDs
* @param {string}        rules    CSS properties for this selector
* @param {integer}       index    index detailing where to add the new rule
*/
function addCSSRule(sheet, selector, rules, index = 0) {
  if ("insertRule" in sheet) {
      sheet.insertRule(selector + "{" + rules + "}", index);
  } else if ("addRule" in sheet) {
      sheet.addRule(selector, rules, index);
  }
}

const initFontMetrics = () => {
  // const selector = '#mainContainer';
  const selector = '.article_body';
  const elementsWithFontFamily = getElementWithFontFamilyStyle(selector);
  if (elementsWithFontFamily) {
    addFallbackFontUnderlay(selector);

    const sheet = appendBlankStyleSheet();
    // Change color of fallback underlays
    addCSSRule(sheet, `.${CONST.classNames.fallbackContainer}`, "position: relative; margin: 0; padding: 0");
    addCSSRule(sheet, `.${CONST.classNames.fallbackContainer} > *:first-child`, "position: absolute; top: 0; left: 0");
    addCSSRule(sheet, `.${CONST.classNames.fallbackContainer} > *:first-child *`, "color: yellow");
    addCSSRule(sheet, `.${CONST.classNames.fallbackContainer} > *:first-child *`, "font-family: valkyrie-fallback");
  }
  else {
    console.log(`No matches for ${selector}`);
  }
};

// window.addEventListener('DOMContentLoaded', initFontMetrics);
window.claris = { "fontMetrics": { "initFontMetrics": initFontMetrics } };
