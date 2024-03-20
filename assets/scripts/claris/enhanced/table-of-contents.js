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
                        // deb(PREFIX, "Remove empty LI: ", innerLI, innerLI.parentElement);
                        innerLI.remove();
                    }
                }
                let innerULs = headingItem.querySelectorAll('ul');
                for (let ulIdx = 0, innerUL = innerULs[0]; ulIdx < innerULs.length; innerUL = innerULs[++ulIdx]) {
                    if (innerUL && !(innerUL.innerHTML.trim())) {
                        // Remove empty unordered list from DOM
                        // deb(PREFIX, "Remove empty UL: ", innerUL);
                        innerUL.remove();
                    }
                    // else {
                    //     deb(PREFIX, "Keep non-empty UL: '" + innerUL.innerHTML.trim() + "'");
                    // }
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
                const navigationElementIds = navigationElementList.map(elem => decodeURI(elem.querySelector('a').href.replace(/.*#([^#]+)/, '$1')));
                // deb(PREFIX, "navigationElementIds:"); deb(PREFIX, navigationElementIds);

                let sectionHeadings = [];

                for (let idx = 0, navId = navigationElementIds[0]; idx < navigationElementIds.length; navId = navigationElementIds[++idx]) {
                    let sectionHeading = document.getElementById(navId);
                    if (sectionHeading) {
                        // deb(PREFIX, "    sectionHeading " + sectionHeading + " =  '" + navId + "'");
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
                // deb(PREFIX, "rootMargin=" + observer.rootMargin);

                for (let idx = 0, entry = entries[0]; idx < entries.length; entry = entries[++idx]) {
                    deb(PREFIX, "scrollHandler(target=" + entry.target.tagName + " id='" + entry.target.id + "'): intersectionRatio=" + entry.intersectionRatio);
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

            /*
            const scrollHandler = function (entries) {
                // const visibleTop = document.querySelector('.header_claris').getBoundingClientRect().bottom;
                const visibleTop = 120;
                const visibleBottom = window.innerHeight;
                const currentClassName = 'current';

                entries.forEach(entry => {
                    // deb(PREFIX, "scrollHandler(target=" + entry.target.tagName + " id='" + entry.target.id + "'): intersectionRatio=" + entry.intersectionRatio);
                    var target = entry.target;
                    if (target.id == "lastChildId") {
                        deb(PREFIX, "scrollHandler(section.id='" + target.id + "'): intersectionRatio=" + entry.intersectionRatio);
                        if (entry.isIntersecting) {
                            const precedingNavigationElement = navigationElements.slice(-2)[0];
                            precedingNavigationElement.classList.remove('visible');
                            deb(PREFIX, "    removed visible from preceding element " + precedingNavigationElement.querySelector('a').href.replace(/.*#([^#]+)/, '$1'));
                        }
                        else {
                            const precedingNavigationElement = navigationElements.slice(-2)[0];
                            precedingNavigationElement.classList.add('visible');
                            deb(PREFIX, "    added visible to preceding element " + precedingNavigationElement.querySelector('a').href.replace(/.*#([^#]+)/, '$1'));
                        }
                        return;
                    }
                    const sectionHeading = target;
                    const sectionLink = tableOfContentsNav.querySelector(`a[href="#${target.id}"]`);
                    if (!sectionLink) {
                        if (DEBUG) {
                            deb(PREFIX, "scrollHandler(section.id='" + target.id + "'): intersectionRatio=" + entry.intersectionRatio);
                            deb(PREFIX, "    sectionLink:"); deb(PREFIX, sectionLink);
                            deb(PREFIX, `    tableOfContentsNav = document.querySelector('.table_of_contents nav'); tableOfContentsNav.querySelector('a[href="#${target.id}"]')`);
                        }
                        return;
                    }
                    const navigationElement = sectionLink.parentElement;
                    if (!navigationElement) return;

                    if (entry.isIntersecting) {
                        if (entry.boundingClientRect.top < visibleTop
                            || (entry.boundingClientRect.top - visibleTop) < (visibleBottom - entry.boundingClientRect.bottom)) {
                            const precedingNavigationElement = navigationElements[Math.max(0, navigationElements.indexOf(navigationElement) - 1)];
                            if (DEBUG) {
                                if (entry.boundingClientRect.top < visibleTop) {
                                    // entered viewport at the top edge, hence scroll direction is up
                                    deb(PREFIX, "scrollHandler('" + target.id + "'): entered from top");
                                    // navigationElement.classList.add('from-top');
                                }
                                else {
                                    // entered viewport at the top edge, hence scroll direction is up
                                    deb(PREFIX, "scrollHandler('" + target.id + "'): likely entered from top");
                                    // navigationElement.classList.add('likely-from-top');
                                }
                                deb(PREFIX, "    add visible to entering element " + navigationElement.querySelector('a').href.replace(/.*#([^#]+)/, '$1'));
                                deb(PREFIX, "    add visible to preceding element " + precedingNavigationElement.querySelector('a').href.replace(/.*#([^#]+)/, '$1'));
                            }
                            navigationElement.classList.add('visible');
                            precedingNavigationElement.classList.add('visible');
                        }
                        else if (entry.boundingClientRect.bottom > visibleBottom
                            || (entry.boundingClientRect.top - visibleTop) >= (visibleBottom - entry.boundingClientRect.bottom)) {
                            if (DEBUG) {
                                if (entry.boundingClientRect.bottom > visibleBottom) {
                                    // entered viewport at the top edge, hence scroll direction is up
                                    deb(PREFIX, "scrollHandler('" + target.id + "'): entered from bottom");
                                    // navigationElement.classList.add('from-bottom');
                                }
                                else {
                                    // entered viewport at the top edge, hence scroll direction is up
                                    deb(PREFIX, "scrollHandler('" + target.id + "'): likely entered from bottom");
                                    // navigationElement.classList.add('likely-from-bottom');
                                }
                                deb(PREFIX, "    add visible to entering element " + navigationElement.querySelector('a').href.replace(/.*#([^#]+)/, '$1'));
                            }
                            navigationElement.classList.add('visible');
                        }
                        // console.print("scrollHandler('" + target.id + "'): entered from elsewhere:"
                        //     + "\n  top=" + Math.round(entry.boundingClientRect.top)
                        //     + "\n  top-visibleTop=" + Math.round(entry.boundingClientRect.top - visibleTop)
                        //     + "\n  bottom=" + Math.round(visibleBottom)
                        //     + "\n  visibleBottom-bottom=" + Math.round(visibleBottom - entry.boundingClientRect.bottom));
                    }
                    else {
                        resetActiveNavigationElement(navigationElement);
                        if ( entry.boundingClientRect.top < visibleTop
                            || (entry.boundingClientRect.top - visibleTop) < (visibleBottom - entry.boundingClientRect.bottom)) {
                            const idx = Math.max(0, navigationElements.indexOf(navigationElement));
                            if (DEBUG) {
                                if (entry.boundingClientRect.top < visibleTop) {
                                    // left viewport at the top edge, hence scroll direction is down
                                    deb(PREFIX, "scrollHandler('" + target.id + "'): left at top");
                                    // navigationElement.classList.add('at-top');
                                }
                                else {
                                    // left viewport at the top edge, hence scroll direction is down
                                    deb(PREFIX, "scrollHandler('" + target.id + "'): likely left at top");
                                    // navigationElement.classList.add('likely-at-top');
                                }
                                const precedingNavigationElements = navigationElements.slice(0, idx);
                                deb(PREFIX, "scrollHandler('" + sectionHeading.id + "'): sectionLink=" + sectionLink.href.replace(/.*#([^#]+)/, '$1')
                                    + " navigationElement=" + navigationElement.querySelector('a').href.replace(/.*#([^#]+)/, '$1')
                                    + " idx=" + idx + " precedingNavigationElements: ");
                                deb(PREFIX, precedingNavigationElements);
                            }

                            // // Only considering the immediately preceding element is not sufficient
                            // const precedingNavigationElement = navigationElements[Math.max(0, navigationElements.indexOf(navigationElement) - 1)];
                            // precedingNavigationElement.classList.remove('visible');
                            deb(PREFIX, "    removed visible from preceding element " + precedingNavigationElement.querySelector('a').href.replace(/.*#([^#]+)/, '$1'));
                            for (let i=0; i < idx; ++i) {
                                navigationElements[i].classList.remove('visible');
                                // deb(PREFIX, "    removed visible from " + elem.querySelector('a').href.replace(/.*#([^#]+)/, '$1'));
                            };
                        }
                        else if ( entry.boundingClientRect.bottom > visibleBottom
                            || (entry.boundingClientRect.top - visibleTop) >= (visibleBottom - entry.boundingClientRect.bottom) ) {
                            if (DEBUG) {
                                if (entry.boundingClientRect.bottom > visibleBottom) {
                                    // left viewport at the bottom edge, hence scroll direction is up
                                    deb(PREFIX, "scrollHandler('" + target.id + "'): left at bottom");
                                    // navigationElement.classList.add('at-bottom');
                                }
                                else {
                                    // left viewport at the bottom edge, hence scroll direction is up
                                    deb(PREFIX, "scrollHandler('" + target.id + "'): likely left at bottom");
                                    // navigationElement.classList.add('likely-at-bottom');
                                }
                            }
                            navigationElement.classList.remove('visible');
                            deb(PREFIX, "    removed visible from leaving element " + navigationElement.querySelector('a').href.replace(/.*#([^#]+)/, '$1'));
                        }
                        // console.print("scrollHandler('" + target.id + "'): entered left to elsewhere:"
                        //     + "\n  top=" + Math.round(entry.boundingClientRect.top)
                        //     + "\n  top-visibleTop=" + Math.round(entry.boundingClientRect.top - visibleTop)
                        //     + "\n  bottom=" + Math.round(visibleBottom)
                        //     + "\n  visibleBottom-bottom=" + Math.round(visibleBottom - entry.boundingClientRect.bottom));
                    }
                });
            };
            */
        }
    }
    deb(PREFIX, "Declared addScollObserver");
    if (addScrollObserver) {
        addScrollObserver(navigationElements, content);
    }
}
