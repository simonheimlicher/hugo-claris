import {
  createEl,
  pushClass,
} from './functions';

export function footnotesAccessibleInit() {
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


    const headingText = 'Footnotes';
    const headingId = 'footnotes-accessible_heading';

    // Create an <h2> element and add it to the beginning of the .footnotes element.
    const element = createEl('h2');
    const text = document.createTextNode(headingText);

    element.appendChild(text);
    pushClass(element, 'footnotes-accessible_visually-hidden');
    element.id = headingId;

    // Insert after the separating <hr>
    footnotes.insertBefore(element, footnotes.firstChild);

    const footnoteRefDescribedBy = "Footnote"
    const footnoteBackrefLabel = "Back to content"

    // Use the footnotes title to describe each reference.
    setAttributeValue({
      selector: '.footnote-ref',
      attribute: 'aria-describedby',
      value: footnoteRefDescribedBy
    });

    // Add a 'Back to content' label to each back-to-content link.
    setAttributeValue({
      selector: '.footnote-backref',
      attribute: 'aria-label',
      value: footnoteBackrefLabel
    });
  }
}
