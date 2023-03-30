import {
  isObj,
  createEl,
  elem,
  elems,
  pushClass,
  hasClasses,
  deleteClass,
  modifyClass,
  containsClass,
  elemAttribute,
  wrapEl,
  deleteChars,
  isBlank,
  isMatch,
  copyToClipboard,
  getMobileOperatingSystem,
  horizontalSwipe,
  parseBoolean
} from './functions';

import {
  doc,
  htmlRootElement,
  htmlRootClassNoCSSProperties
} from './init';

(function navToggle() {
  const open = 'jsopen';
  const navCloseIconClass = '.nav_close';
  const navItem = 'nav_item';
  const navSub = 'nav_sub';
  const parentWithOpenSubMenu = 'nav_open';
  const subMenuIsOpen = 'nav_open_sub';

  const navClose = elem(navCloseIconClass);
  if (!navClose) {
    return;
  }
  const harmburgerIcon = navClose.firstElementChild;
  if (!harmburgerIcon) {
    return;
  }
  // Add click event listener to document element to also capture clicks outside the navigation menu
  doc.addEventListener('click', function (event) {
    const target = event.target;
    const isNavToggle = target.matches(navCloseIconClass) || target.closest(navCloseIconClass);
    if (isNavToggle) {
      event.preventDefault();
      modifyClass(doc, open);
      modifyClass(harmburgerIcon, 'isopen');
    }

    if (!target.closest('.nav') && elem(`.${open}`)) {
      modifyClass(doc, open);
      const navIsOpen = containsClass(doc, open);
      !navIsOpen ? modifyClass(harmburgerIcon, 'isopen') : false;
    }

    const isNavItem = target.matches(`.${navItem}`);
    const isNavItemIcon = target.closest(`.${navItem}`)

    if (isNavItem || isNavItemIcon) {
      const thisItem = isNavItem ? target : isNavItemIcon;
      const hasNext = thisItem.nextElementSibling;
      const hasSubNav = hasNext ? hasNext.matches(`.${navSub}`) : null;
      if (hasSubNav) {
        event.preventDefault();
        const children = thisItem.parentNode.parentNode.children;
        for (let idx = 0, item = children[0]; idx < children.length; item = children[++idx]) {
          const targetItem = item.firstElementChild;
          targetItem != thisItem ? deleteClass(targetItem, parentWithOpenSubMenu) : false;
        }
        modifyClass(thisItem, parentWithOpenSubMenu);
        modifyClass(hasNext, subMenuIsOpen);
      }
    }
  });

  // Add click event listener to hamburger icon if the page has a #contentContainer element
  const contentContainerElem = elem('#contentContainer');
  if (contentContainerElem) {
    const hamburgerIconClass = 'hamburger';
    pushClass(harmburgerIcon, hamburgerIconClass)
    const hamburgerIconSelector = '.' + hamburgerIconClass;
    navClose.addEventListener('click', function (event) {
      const target = event.target;
      const isNavOpenIcon = target.matches(hamburgerIconSelector) || target.closest(hamburgerIconSelector);
      if (isNavOpenIcon) {
        // event.preventDefault();
        // Scroll past the hero element to the content of the page
        // const boundingClientRect = contentContainerElem.getBoundingClientRect();
        // if (boundingClientRect.y > 0) {
        //   contentContainerElem.scrollIntoView();
        // }
      }
    });
  }
}) ();
