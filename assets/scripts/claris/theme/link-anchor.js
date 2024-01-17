// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
// https://codepen.io/saas/pen/LYENgqq

import {
  eventTarget,
  createEl,
  elem,
  elems,
  pushClass,
  deleteClass,
  containsClass,
  copyToClipboard,
} from './functions';

export function linkAnchorInit() {
  // Retrieve all elements

  const headingAnchorSelector = '.link.icon';
  const headingAnchors = document.querySelectorAll(headingAnchorSelector);
  if (!headingAnchors) {
    return;
  }

  for (let idx = 0, elem = headingAnchors[0]; idx < headingAnchors.length; elem=headingAnchors[++idx]) {
    const textContent = elem.closest('H1, H2, H3, H4, H5, H6').textContent;
    elem.setAttribute('title', 'Anchor link to heading "' + textContent + '"');
  };

  function copyFeedback(linkNode) {
    const copyText = createEl('div');
    const yank = 'link_yank';
    const yanked = 'link_yanked';
    copyText.classList.add(yanked);
    copyText.innerText = 'Link to this section copied';
    if(!elem(`.${yanked}`, linkNode)) {
      linkNode.appendChild(copyText);
      pushClass(linkNode, yank);
      setTimeout(function() {
        linkNode.removeChild(copyText)
        deleteClass(linkNode, yank);
      }, 3000);
    }
  }

  let anchorLink, anchorLinks, newLink, linkNode, target;
  anchorLink = 'link';
  anchorLinks = elems(`.${anchorLink}`);
  if (anchorLinks) {
    document.addEventListener('click', function(event)
    {
      target = eventTarget(event);
      linkNode = target.closest(`.${anchorLink}`)
      if (target && containsClass(target, anchorLink) || containsClass(linkNode, anchorLink)) {
        event.preventDefault();
        newLink = target.href != undefined ? target.href : linkNode.href;
        copyToClipboard(newLink);
        target.href != undefined ?  copyFeedback(target) : copyFeedback(linkNode);
      }
    });
  }
}
