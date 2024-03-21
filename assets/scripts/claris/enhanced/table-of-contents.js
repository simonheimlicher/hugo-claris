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
    const navigationElements = function (tableOfContentsNav) {

        const navListItems = elems('li', tableOfContentsNav);
        if (!navListItems) return;

        let navigationElementList = [];

        for (let idx = 0, headingItem = navListItems[0]; idx < navListItems.length; headingItem = navListItems[++idx]) {
            let anchor = headingItem.querySelector('a');
            if (anchor) {
                let innerLIs = headingItem.querySelectorAll('li');
                for (let liIdx = 0, innerLI = innerLIs[0]; liIdx < innerLIs.length; innerLI = innerLIs[++liIdx]) {
                    if (innerLI && !innerLI.innerHTML) {
                        // Remove empty list item from DOM
                        // Remove empty LI: ", innerLI, innerLI.parentElement
                        innerLI.remove();
                    }
                }
                let innerULs = headingItem.querySelectorAll('ul');
                for (let ulIdx = 0, innerUL = innerULs[0]; ulIdx < innerULs.length; innerUL = innerULs[++ulIdx]) {
                    if (innerUL && !(innerUL.innerHTML.trim())) {
                        // Remove empty unordered list from DOM
                        // "Remove empty UL: ", innerUL
                        innerUL.remove();
                    }
                }
                navigationElementList.push(headingItem);
            }
        }
        return navigationElementList;
    }(tableOfContentsNav);

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
                const navigationElementIds = navigationElementList.map(elem => decodeURI(elem.querySelector('a').hash));

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
                let aboveSection, currentSection;
                deb(PREFIX, "setVisibleNavigationElement():");
                for (const element of sectionHeadings) {
                    const pos = getSectionHeadingPosition(visibleTop, visibleBottom, element);
                    deb(PREFIX, "    Position of section " + element.id + ': ' + pos);
                    if (pos == 'above') {
                        aboveSection = element;
                        deb(PREFIX, "    pos=" + pos + " --> aboveSection=" + aboveSection.id);
                        continue;
                    }
                    else if (pos == 'visible') {
                        if (aboveSection) {
                            currentSection = aboveSection;
                            deb(PREFIX, "        currentSection = aboveSection=" + aboveSection.id);
                        }
                        else {
                            currentSection = element;
                            deb(PREFIX, "        currentSection = currentSection=" + currentSection.id);
                        }
                        break;
                    }
                    else if (aboveSection) {
                        deb(PREFIX, "        currentSection = aboveSection=" + aboveSection.id);
                        currentSection = aboveSection;
                    }
                    else {
                        currentSection = element;
                        deb(PREFIX, "        currentSection = currentSection=" + currentSection.id);
                    }
                    deb(PREFIX, "    pos=" + pos + " --> currentSection=" + currentSection.id);
                    break;
                }
                if (!currentSection && (currentSection = aboveSection) === undefined) {
                    currentSection = sectionHeadings[0];
                    deb(PREFIX, "setVisibleNavigationElement(): defaulting currentSection=" + currentSection.id);
                }

                const navigationElement = getNavigationElement(currentSection.id);
                for (let idx = 0, el = navigationElements[0]; idx < navigationElements.length; el = navigationElements[++idx]) {
                    if (el === navigationElement) {
                        navigationElement.classList.add(className);
                    }
                    else {
                        el.classList.remove(className);
                    }
                }
            }

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
