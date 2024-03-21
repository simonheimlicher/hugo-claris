import {
  elem,
  elems,
  pushClass,
  deleteClass,
  modifyClass,
  containsClass,
} from './functions';

export function taxonomyOverlayInit() {
  const doc = document.documentElement;
  const taxonomyOverlayPrefix = 'taxonomy-overlay_';

  function toggleTags(target) {
    target = target || null;
    const tagsButtonClass = `${taxonomyOverlayPrefix}toggle`;
    const tagsButtonClass2 = `${taxonomyOverlayPrefix}hide`;
    const tagsShowClass = 'jswidgetopen';
    const articleTagsWrapper = elem(`.${tagsShowClass}`);
    target = target === null ? articleTagsWrapper : target;
    if (!target) return;
    const showingAllTags = target.matches(`.${tagsShowClass}`);
    const isExpandButton = target.matches(`.${tagsButtonClass}`);
    const isCloseButton = target.matches(`.${tagsButtonClass2}`) || target.closest(`.${tagsButtonClass2}`);
    const isButton =  isExpandButton || isCloseButton;
    const isActionable = isButton || showingAllTags;

    if (isActionable) {
      if (isButton) {
        if (isExpandButton) {
          let allTagsWrapper = target.nextElementSibling
          pushClass(allTagsWrapper, tagsShowClass);
        } else {
          deleteClass(articleTagsWrapper, tagsShowClass);
        }
      } else {
        deleteClass(target, tagsShowClass);
      }
    }
  }

  (function showAllArticleTags(){
    doc.addEventListener('click', function(event){
      const target = event.target;
      toggleTags(target)
    });
  })();

  (function sortTags() {
    doc.addEventListener('click', function(event){
      const activeClassName = `${taxonomyOverlayPrefix}active`;
      const tagsSortSelector = `.${taxonomyOverlayPrefix}sort`; // .tags_sort
      const tagsSortButtonSelector = `.${taxonomyOverlayPrefix}sort_button`; // .tags_sort
      const tagsListSelector = `.${taxonomyOverlayPrefix}list`; // .tags_list
      const tagsSortedClassName = `${taxonomyOverlayPrefix}sorted`; // sorted
      const articleTagSelector = `.article_meta_tag`; // .article_tag

      const target = event.target;
      const isSortButton = target.matches(tagsSortSelector) || target.matches(tagsSortButtonSelector);
      // isSortButton=' + isSortButton + ' target=', target
      if(isSortButton) {
        const tagsList = target.closest(tagsListSelector);
        const sortButton = target.closest(tagsSortSelector);
        // modifyClass(sortButton, "sorted") with sortButton=', sortButton
        modifyClass(sortButton, tagsSortedClassName);
        const tags = elems(articleTagSelector, tagsList);
        // ${articleTagSelector} returned tags:`, tags
        for (let idx = 0, tag = tags[0]; idx < tags.length; tag = tags[++idx]) {
          const order = tag.dataset.position;
          const reverseSorting = containsClass(tag, activeClassName);
          tag.style.order = reverseSorting ? 0 : -order;
          modifyClass(tag, activeClassName);
        }
      }
    })
  })();
}

