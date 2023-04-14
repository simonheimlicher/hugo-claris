import {
  eventTarget,
  elem,
  deleteClass,
  modifyClass,
  containsClass,
} from './functions';

// console.log('BEGIN claris/theme/mobile-nav');
const navToggle = function() {
  // console.log('BEGIN claris/theme/mobile-nav: navToggle()');
  const doc = document.documentElement;
  const htmlRootElement = clarisHugoParams.htmlRootElement;

  const open = 'jsopen';
  const navToggleIconClass = '.nav_mobile_toggle';
  const navToggleOpenSelector = '.nav_mobile_toggle_open';
  const navToggleCloseSelector = '.nav_mobile_toggle_close';
  const navItem = 'nav_item';
  const navSub = 'nav_sub';
  const parentWithOpenSubMenu = 'nav_open';
  const subMenuIsOpen = 'nav_open_sub';

  const navToggle = elem(navToggleIconClass);
  if (!navToggle) {
    return;
  }
  const navToggleOpenIcon = elem(navToggleOpenSelector);
  if (!navToggleOpenIcon) {
    return;
  }
  // Add click event listener to document element to also capture clicks outside the navigation menu
  doc.addEventListener('click', function (event) {
    const target = eventTarget(event);
    const isNavToggle = target.matches(navToggleIconClass) || target.closest(navToggleIconClass);
    if (isNavToggle) {
      event.preventDefault();
      modifyClass(htmlRootElement, open);
      modifyClass(navToggle, 'isopen');
    }

    if (!target.closest('.nav') && elem(`.${open}`)) {
      modifyClass(htmlRootElement, open);
      const navIsOpen = containsClass(htmlRootElement, open);
      !navIsOpen ? modifyClass(navToggle, 'isopen') : false;
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
    navToggle.addEventListener('click', function (event) {
      const target = eventTarget(event);
      const isNavOpenIcon = target.matches(navToggleOpenSelector) || target.closest(navToggleOpenSelector);
      if (isNavOpenIcon) {
        event.preventDefault();
        // Scroll past the hero element to the content of the page
        // const boundingClientRect = contentContainerElem.getBoundingClientRect();
        // if (boundingClientRect.y > 0) {
        //   contentContainerElem.scrollIntoView();
        // }
      }
    });
  }
  // console.log('END   claris/theme/mobile-nav: navToggle()');
};
document.addEventListener('DOMContentLoaded', navToggle);

// console.log('END   claris/theme/mobile-nav');
