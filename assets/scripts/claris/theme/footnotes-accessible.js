import {
  createEl,
  pushClass,
} from './functions';

// Source: https://danielpost.com/articles/making-hugos-footnotes-accessible/
const footnotes = document.querySelector('.footnotes');

// Only run this code if there are footnotes on the page.
if (footnotes) {
  /**
   * Set attribute value for given selector.
   *
   * @param {String} selector - Selector to set attribute for.
   * @param {String} attribute - Attribute to set.
   * @param {String} value - Value for the attribute.
   */
  const setAttributeValue = ({ selector, attribute, value }) => {
    if (!selector || !attribute || !value) {
      return;
    }

    const items = document.querySelectorAll(selector);

    if (!items.length) {
      return;
    }

    for (const item of items) {
      item.setAttribute(attribute, value);
    }
  };
  const title = 'Footnotes';
  const id = 'footnotes-label';

  // Create an <h2> element and add it to the beginning of the .footnotes element.
  const element = createEl('h2');
  const text = document.createTextNode(title);

  element.appendChild(text);
  pushClass(element, 'u-hidden-visually');
  element.id = id;

  footnotes.insertBefore(element, footnotes.firstChild);

  // Use the footnotes title to describe each reference.
  setAttributeValue({
    selector: '.footnote-ref a',
    attribute: 'aria-describedby',
    value: id
  });

  // Add a 'Back to content' label to each back-to-content link.
  setAttributeValue({
    selector: '.footnote-return',
    attribute: 'aria-label',
    value: 'Back to content'
  });
}
