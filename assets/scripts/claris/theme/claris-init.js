import * as params from "@params";
import {
  eventTarget,
  createEl,
  elem,
  elems,
  pushClass,
  deleteClass,
  containsClass,
  elemAttribute,
  wrapEl,
  isMatch,
  copyToClipboard,
  getMobileOperatingSystem,
} from './functions';

export const clarisHugoParams = {
  // Params passed to Hugo in the asset pipeline in `claris/_functions/script-bundles.html`
  baseURL: params.baseURL,
  iconsPath: params.iconsPath,
  envDevel: params.envDevel,
  envProd: params.envProd,

  // Params to be defined and re-used in other modules
  parentURL: window.location.protocol + "//" + window.location.host + "/",
  // The DOM element that we use to indicate properties of the browser and state of the page
  htmlRootElement: document.documentElement,

  htmlRootClassNoJavaScript: 'no-js',
  htmlRootClassModernJavaScript: 'modern-js',
  htmlRootClassNoCSSProperties: 'no-css-prop',
  htmlRootClassNoCSSGrid: 'no-css-grid',
  inline: ':inline',
};

// console.log('BEGIN claris/theme/init');
export function clarisInit() {
  // console.log('BEGIN claris/theme/init: clarisInit()', clarisHugoParams);

  const doc = document.documentElement;
  const parentURL = clarisHugoParams.parentURL;
  const htmlRootElement = clarisHugoParams.htmlRootElement;

  const htmlRootClassNoJavaScript = clarisHugoParams.htmlRootClassNoJavaScript;
  const htmlRootClassNoCSSProperties = clarisHugoParams.htmlRootClassNoCSSProperties;
  const htmlRootClassNoCSSGrid = clarisHugoParams.htmlRootClassNoCSSGrid;
  const grid_supported = typeof document.createElement('div').style.grid === 'string';
  if ( ! grid_supported) {
    pushClass(htmlRootElement, htmlRootClassNoCSSGrid);
  }

  const css_properties_supported = window.CSS && CSS.supports('color', 'var(--CSS-property-support-validation)');
  if ( ! css_properties_supported) {
    pushClass(htmlRootElement, htmlRootClassNoCSSProperties);
  }

  deleteClass(htmlRootElement, htmlRootClassNoJavaScript);

  (function() {
    const userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    const bodyElement = elem('body');
    if (macosPlatforms.indexOf(platform) !== -1) {
      pushClass(bodyElement, 'macos');
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      pushClass(bodyElement, 'ios');
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      pushClass(bodyElement, 'windows');
    } else if (/Android/.test(userAgent)) {
      pushClass(bodyElement, 'android');
    } else if (!os && /Linux/.test(platform)) {
      pushClass(bodyElement, 'linux');
    }
  })();

  (function updateDate() {
    const date = new Date();
    const year = date.getFullYear();
    const yearEl = elem('.year');
    yearEl ? yearEl.innerHTML = `${year}` : false;
  })();

  (function makeExternalLinks(){
    let links = elems('a');
    if (links) {
      for (let idx = 0, link = links[0]; idx < links.length; link = links[++idx]) {
        let target, rel, blank, noopener, attr1, attr2, url, isExternal;
        url = elemAttribute(link, 'href');
        isExternal = (url && typeof url == 'string' && url.startsWith('http')) && !url.startsWith(parentURL) ? true : false;
        if(isExternal) {
          target = 'target';
          rel = 'rel';
          blank = '_blank';
          noopener = 'noopener';
          attr1 = elemAttribute(link, target);
          attr2 = elemAttribute(link, noopener);

          attr1 ? false : elemAttribute(link, target, blank);
          attr2 ? false : elemAttribute(link, rel, noopener);
        }
      }
    }
  })();

  let headingNodes = [], results, link, icon, id,
  tags = ['h2', 'h3', 'h4', 'h5', 'h6'];

  for (let idx = 0, tag = tags[0]; idx < tags.length; tag = tags[++idx]) {
    const article = elem('.article_content');
    if (article) {
      results = article.getElementsByTagName(tag);
      Array.prototype.push.apply(headingNodes, results);
    }
  }

  let inlineListItems = elems('ol li');
  if (inlineListItems) {
    for (let idx = 0, listItem = inlineListItems[0]; idx < inlineListItems.length; listItem = inlineListItems[++idx]) {
      let firstChild = listItem.children[0]
      let containsHeading = isMatch(firstChild, tags);
      containsHeading ? pushClass(listItem, 'align') : false;
    }
  }

  (function copyLinkToShare() {
    let  copy, copied, excerpt, isCopyIcon, isInExcerpt, link, articleCopy, articleLink, target;
    copy = 'copy';
    copied = 'copy_done';
    excerpt = 'excerpt';
    articleCopy = 'article_copy';
    articleLink = 'article_card';

    doc.addEventListener('click', function(event) {
      target = eventTarget(event);
      isCopyIcon = containsClass(target, copy);
      let isWithinCopyIcon = target.closest(`.${copy}`);
      if (isCopyIcon || isWithinCopyIcon) {
        let icon = isCopyIcon ? isCopyIcon : isWithinCopyIcon;
        isInExcerpt =  containsClass(icon, articleCopy);
        if (isInExcerpt) {
          link = target.closest(`.${excerpt}`).previousElementSibling;
          link = containsClass(link, articleLink)? elemAttribute(link, 'href') : false;
        } else {
          link = window.location.href;
        }
        if(link) {
          copyToClipboard(link);
          pushClass(icon, copied);
        }
      }
      const yankLink = '.link_yank';
      const isCopyLink = target.matches(yankLink);
      const isCopyLinkIcon = target.closest(yankLink);

      if(isCopyLink || isCopyLinkIcon) {
        event.preventDefault();
        const yankContent = isCopyLinkIcon ? elemAttribute(target.closest(yankLink), 'href') : elemAttribute(target, 'href');
        copyToClipboard(yankContent);
        isCopyLink ?  copyFeedback(target) : copyFeedback(target.parentNode);
      }
    });
  })();

  (function hideAside(){
    let aside, title, articles;
    aside = elem('.aside');
    title = aside ? aside.previousElementSibling : null;
    if(aside && title.nodeName.toLowerCase() === 'h3') {
      articles = Array.from(aside.children);
      articles.length < 1 ? title.remove() : false;
    }
  })();

  (function goBack() {
    let backBtn = elem('.btn_back');
    let history = window.history;
    if (backBtn) {
      backBtn.addEventListener('click', function(){
        history.back();
      });
    }
  })();

  function isMobileDevice() {
    const agent = navigator.userAgent.toLowerCase();
    const isMobile = agent.includes('android') || agent.includes('iphone');
    return  isMobile;
  };

  (function ifiOS(){
    // modify backto top button
    const backToTopButton = elem('.to_top');
    // button is only shown if parameter "showToTopButton" is explicitly set to true
    if (!backToTopButton) return;
    const thisOS = getMobileOperatingSystem();
    const ios = 'ios';
    if(backToTopButton && thisOS === 'iOS') {
      pushClass(backToTopButton, ios);
    }
    // precisely position back to top button on large screens
    const buttonParentWidth = backToTopButton.parentNode.offsetWidth;
    const docWidth = doc.offsetWidth;
    let leftOffset = (docWidth - buttonParentWidth) / 2;
    const buttonWidth = backToTopButton.offsetWidth;
    leftOffset = leftOffset + buttonParentWidth - buttonWidth;
    if(!isMobileDevice()){
      backToTopButton.style.left = `${leftOffset}px`;
    }
  })();

  (function shareViaLinkedin() {
    doc.addEventListener('click', function(event){
      const linkedin = '.linkedin';
      const target = eventTarget(event);
      if(target.matches(linkedin) || target.closest(linkedin)) {
        window.open('http://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(window.location.href), '', 'left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
      }
    });
  })();

  // console.log('END   claris/theme/init: clarisInit()');
}

// console.log('END   claris/theme/init');
