// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API 
// https://codepen.io/saas/pen/LYENgqq
window.addEventListener('DOMContentLoaded', () => {
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
});
