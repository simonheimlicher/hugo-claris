import {
  elem,
  elems,
  pushClass,
  deleteClass,
  modifyClass,
  containsClass,
} from './functions';

export function tagOverlayInit() {
  const doc = document.documentElement;

  function toggleTags(target) {
    target = target || null;
    const tagsButtonClass = 'article_tags_toggle';
    const tagsButtonClass2 = 'tags_hide';
    const tagsShowClass = 'jswidgetopen';
    const articleTagsWrapper = elem(`.${tagsShowClass}`);
    target = target === null ? articleTagsWrapper : target;
    // console.log('toggleTags(): target=' + target);
    if (!target) return;
    const showingAllTags = target.matches(`.${tagsShowClass}`);
    const isExandButton = target.matches(`.${tagsButtonClass}`);
    const isCloseButton = target.matches(`.${tagsButtonClass2}`) || target.closest(`.${tagsButtonClass2}`);
    const isButton =  isExandButton || isCloseButton;
    const isActionable = isButton || showingAllTags;

    // console.log('toggleTags(): isActionable=' + isActionable + ' target=', target);
    if(isActionable) {
      if(isButton) {
        if(isExandButton) {
          let allTagsWrapper = target.nextElementSibling
          pushClass(allTagsWrapper, tagsShowClass);
        } else {
          deleteClass(articleTagsWrapper, tagsShowClass);
        }
      } else {
        isActionable ? deleteClass(target, tagsShowClass) : false;
      }
    }
  }

  (function showAllArticleTags(){
    doc.addEventListener('click', function(event){
      const target = event.target;
      toggleTags(target)
    });

    // FIXME: I doubt anyone discovers that it is possible to swipte left to hide tags...
    // horizontalSwipe(doc, toggleTags, 'left');
  })();

  (function sortTags() {
    // console.log("sortTags: add click event listener");
    doc.addEventListener('click', function(event){
      const active = 'active';
      const target = event.target;
      const isSortButton = target.matches('.tags_sort') || target.matches('.tags_sort span');
      // console.log('sortTags(): isSortButton=' + isSortButton + ' target=', target);
      if(isSortButton) {
        const tagsList = target.closest('.tags_list');
        const sortButton = elem('.tags_sort', tagsList);
        // console.log('sortTags(): modifyClass(sortButton, "sorted") with sortButton=', sortButton);
        modifyClass(sortButton, 'sorted');
        const tags = elems('.article_tag', tagsList);
        // console.log('sortTags(): tags=', tags);
        for (let idx = 0, tag = tags[0]; idx < tags.length; tag = tags[++idx]) {
          const order = tag.dataset.position;
          const reverseSorting = containsClass(tag, active);
          tag.style.order = reverseSorting ? 0 : -order;
          modifyClass(tag, active);
        }
      }
    })
  })();
}

