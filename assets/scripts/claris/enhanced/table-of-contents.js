import {
  deb,
  elem,
  elems,
} from 'scripts/claris/base/functions';

// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
// https://codepen.io/saas/pen/LYENgqq
let addScrollObserver = null;

export function tableOfContentsInit() {
    const PREFIX = false; // "table-of-contents"
    // Retrieve all elements
    const articleElement = elem('.article_content');
    if (!articleElement) return;

    const content = elem('.article_body', articleElement);
    if (!content) return;

    const tableOfContentsAside = elem('.table_of_contents');
    if (!tableOfContentsAside) return;

    const tableOfContentsNav = tableOfContentsAside.querySelector('#TableOfContents');
    if (!tableOfContentsNav) return;

    const navigationBar = elem('.header_claris');
    if (!navigationBar) return;

    const articleTopNav = tableOfContentsAside.querySelector('.article_top');
    if (articleTopNav) {
        const articleTopLink = tableOfContentsAside.querySelector('.article_top_link');
        const articleTopLI = document.createElement('li');
        articleTopLI.classList.add('article_top');
        articleTopLI.appendChild(articleTopLink);
        articleTopNav.remove();
        const tableOfContentsUL = tableOfContentsNav.querySelector('ul');
        if (tableOfContentsUL) {
            tableOfContentsUL.insertBefore(articleTopLI, tableOfContentsUL.firstChild);
        }
    }
    const navigationElements = (function (tableOfContentsNav) {
        const navListItems = Array.from(elems("li", tableOfContentsNav)); // Convert NodeList to Array
        if (!navListItems.length) return [];

        const removeEmptyElements = (selector, parent) => {
            parent.querySelectorAll(selector).forEach((element) => {
            if (!element.innerHTML.trim()) {
                element.remove();
            }
            });
        };

        const processHeadingItem = (headingItem) => {
            const anchor = headingItem.querySelector("a");
            if (!anchor) return null;

            removeEmptyElements("li", headingItem);
            removeEmptyElements("ul", headingItem);

            return headingItem;
        };

        return navListItems.map(processHeadingItem).filter(Boolean);
    })(tableOfContentsNav);

    const getNavigationElement = function (sectionId) {
        const sectionLink = tableOfContentsNav.querySelector(`a[href="#${sectionId}"]`);
        if (!sectionLink) {
            deb(PREFIX, "getNavigationElement(): entry.target='" + sectionId + " cannot find sectionLink");
            return undefined;
        }
        const navigationElement = sectionLink.parentElement;
        if (!navigationElement) {
            deb(PREFIX, "getNavigationElement(): entry.target='" + sectionId + " sectionLink=" + sectionLink
                + ": cannot find navigationElement");
            return undefined;
        }
        return navigationElement;
    }

    const setActiveNavigationElement = function (navigationElement) {
        tableOfContentsNav.classList.add('active');
        for (let idx = 0, el = navigationElements[0]; idx < navigationElements.length; el = navigationElements[++idx]) {
            if (el === navigationElement) {
                navigationElement.classList.add('active');
            }
            else {
                el.classList.remove('active');
            }
        }
    }

    const resetActiveNavigationElement = function (navigationElement) {
        if (navigationElement?.classList.contains('active')) {
            tableOfContentsNav.classList.remove('active');
            for (let idx = 0, el = navigationElements[0]; idx < navigationElements.length; el = navigationElements[++idx]) {
                el.classList.remove('active');
            }
        }
    }

    const navigationClickHandler = function (event) {
        let target = event.target.querySelector('a') || event.target;
        setActiveNavigationElement(target.parentNode);
        target.click();
    };

    for (let idx = 0, el = navigationElements[0]; idx < navigationElements.length; el = navigationElements[++idx]) {
        el.onclick = navigationClickHandler;
    }
    tableOfContentsAside.style.visibility = 'visible';

    deb(PREFIX, 'Check for IntersectionObserver');
    if ('IntersectionObserver' in window) {
        deb(PREFIX, 'Declare addScrollObserver');
        addScrollObserver = function(navigationElements, content) {
            deb(PREFIX, 'Run addScrollObserver()');
            const sectionHeadings = function (navigationElementList, content) {
                const navigationElementIds = navigationElementList.map(elem => {
                    // Each 'elem' contains an <a> tag with an href like '#someId'
                    const href = elem.querySelector('a')?.hash;
                    // Remove the leading '#' to get the actual id value
                    return href ? decodeURI(href.substring(1)) : '';
                  });

                let sectionHeadings = [];

                for (let idx = 0, navId = navigationElementIds[0]; idx < navigationElementIds.length; navId = navigationElementIds[++idx]) {
                    let sectionHeading = document.getElementById(navId);
                    if (sectionHeading) {
                        // "    sectionHeading " + sectionHeading + " =  '" + navId + "'");
                        sectionHeadings.push(sectionHeading);
                    }
                    else {
                        deb(PREFIX, "    no sectionHeading found for '" + navId + "'");
                    }
                }
                deb(PREFIX, "sectionHeadings:", sectionHeadings);
                return sectionHeadings;
            }(navigationElements, content);

            const getSectionHeadingPosition = function (visibleTop, visibleBottom, sectionHeading) {
                const boundingClientRect = sectionHeading.getBoundingClientRect();
                let scrollingDown = true;
                deb(PREFIX, '    getSectionHeadingPosition(sectionHeading=' + sectionHeading.id
                    + '): top=' + boundingClientRect.top + ' bottom=' + boundingClientRect.bottom);
                if (scrollingDown) {
                    if (boundingClientRect.bottom < visibleBottom) {
                        if (boundingClientRect.top > visibleTop) {
                            deb(PREFIX, '        visible:\n           top=' + boundingClientRect.top + ' > visibleTop=' + visibleTop
                                + '\n            bottom=' + boundingClientRect.bottom + ' < visibleBottom=' + visibleBottom);
                            return 'visible';
                        }
                        else {
                            deb(PREFIX, '        above:\n            top=' + boundingClientRect.top + ' <= visibleTop=' + visibleTop
                                + '\n            bottom=' + boundingClientRect.bottom + ' < visibleBottom=' + visibleBottom);
                            return 'above';
                        }
                    }
                    deb(PREFIX, '        below:\n            top=' + boundingClientRect.top + ' <= visibleTop=' + visibleTop
                        + '\n            bottom=' + boundingClientRect.bottom + ' >= visibleBottom=' + visibleBottom);
                    return 'below';
                }
                else {
                    if (boundingClientRect.bottom > visibleTop) {
                        if (boundingClientRect.top < visibleBottom) {
                            deb(PREFIX, '        visible: bottom=' + boundingClientRect.bottom + ' > visibleTop=' + visibleTop
                                + '\n    top=' + boundingClientRect.top + ' < visibleBottom=' + visibleBottom);
                            return 'visible';
                        }
                        else {
                            deb(PREFIX, '        above: bottom=' + boundingClientRect.bottom + ' > visibleTop=' + visibleTop
                                + '\n    top=' + boundingClientRect.top + ' <= visibleBottom=' + visibleBottom);
                            return 'below';
                        }
                    }
                    deb(PREFIX, '        above: bottom=' + boundingClientRect.bottom + ' <= visibleTop=' + visibleTop
                        + '\n    top=' + boundingClientRect.top + ' <= visibleBottom=' + visibleBottom);
                    return 'above';
                }
            }

            const setVisibleNavigationElement = function (visibleTop, visibleBottom, className) {

                deb(PREFIX, "setVisibleNavigationElement():");

                let aboveSection = null;
                let currentSection = null;

                const determineCurrentSection = () => {
                    for (const element of sectionHeadings) {
                        const pos = getSectionHeadingPosition(visibleTop, visibleBottom, element);
                        deb(PREFIX, `    Position of section ${element.id}: ${pos}`);

                        if (pos === 'above') {
                            aboveSection = element;
                            deb(PREFIX, `    pos=${pos} --> aboveSection=${aboveSection.id}`);
                            continue;
                        }

                        if (pos === 'visible') {
                            return aboveSection || element;
                        }

                        return aboveSection || element;
                    }

                    return aboveSection || sectionHeadings[0];
                };

                currentSection = determineCurrentSection();
                deb(PREFIX, `setVisibleNavigationElement(): currentSection=${currentSection.id}`);

                const updateNavigationElements = (navigationElement) => {
                    for (const el of navigationElements) {
                        el.classList.toggle(className, el === navigationElement);
                    }
                };

                const navigationElement = getNavigationElement(currentSection.id);
                updateNavigationElements(navigationElement);
            };


            // Source: https://codepen.io/saas/pen/LYENgqq
            // Once a scrolling event is detected, iterate all elements
            // whose visibility changed and highlight their navigation entry
            const scrollHandler = function (entries, observer) {
                const navigationBarRect = navigationBar.getBoundingClientRect();
                const visibleTop = navigationBarRect.top == 0 ? navigationBarRect.bottom : 0;
                const visibleBottom = window.innerHeight;
                const currentClassName = 'visible';
                // "rootMargin=" + observer.rootMargin);

                for (let idx = 0, entry = entries[0]; idx < entries.length; entry = entries[++idx]) {
                  deb(PREFIX, "scrollHandler(target=" + entry.target.tagName + " id='" + entry.target.id
                      + "'): intersectionRatio=" + entry.intersectionRatio);
                    setVisibleNavigationElement(visibleTop, visibleBottom, currentClassName);
                    if (!entry.isIntersecting) {
                        const navigationElement = getNavigationElement(entry.target.id);
                        resetActiveNavigationElement(navigationElement);
                    }
                }
                // NOTE: Cannot change rootMargin of an active IntersectionObserver
                // observer.rootMargin = (-initialVisibleTop).toString() + 'px 0px 0px';
            };

            const initialVisibleTop = navigationBar.getBoundingClientRect().bottom;

            // Options for IntersectionObserver to monitor scrolling down
            const scrollObserverOptions = {
                root: null, // relative to document viewport
                rootMargin: (-initialVisibleTop).toString() + 'px 0px 0px', // margin around root to accomodate sticky header, which is 62px high
                threshold: 1.0 // visible amount of item shown in relation to root
            };

            // Creates a new scroll observer
            const scrollObserver = new IntersectionObserver(scrollHandler, scrollObserverOptions);

            //noinspection JSCheckFunctionSignatures
            for (let idx = 0, sectionHeading = sectionHeadings[0]; idx < sectionHeadings.length; sectionHeading = sectionHeadings[++idx]) {
                scrollObserver.observe(sectionHeading)
            }
        }
    }
    deb(PREFIX, "Declared addScollObserver");
    if (addScrollObserver) {
        addScrollObserver(navigationElements, content);
    }
}
