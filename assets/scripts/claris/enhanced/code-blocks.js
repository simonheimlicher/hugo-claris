import { clarisHugoParams } from 'scripts/claris/base/claris-init';
import {
  createEl,
  elem,
  elems,
  pushClass,
  hasClasses,
  deleteClass,
  modifyClass,
  containsClass,
  wrapEl,
  copyToClipboard,
  parseBoolean
} from 'scripts/claris/base/functions';

export function codeBlocksInit () {
  const doc = document.documentElement;
  const iconsPath = clarisHugoParams.iconsPath;
  const parentURL = clarisHugoParams.parentURL;

  const bodyElement = elem('body');
  const maxLines = parseInt(bodyElement.dataset.code);

  const copyId = 'panel_copy';
  const wrapId = 'panel_wrap';
  const linesId = 'panel_lines';
  const panelExpand = 'panel_expand';
  const panelExpanded = 'panel_expanded';
  const panelHide = 'panel_hide';
  const panelFrom = 'panel_from';
  const panelBox = 'panel_box';
  const fullHeight = 'initial';
  const highlightClass = 'highlight';
  const highlightInnerClass = 'highlight_inner';

  const codeActionButtons = [
    {
      icon: 'copy',
      id: 'copy',
      title: 'Copy Code',
      show: true
    },
    {
      icon: 'order',
      id: 'lines',
      title: 'Toggle Line Numbers',
      show: true
    },
    {
      icon: 'carly',
      id: 'wrap',
      title: 'Toggle Line Wrap',
      show: false
    },
    {
      icon: 'expand',
      id: 'expand',
      title: 'Toggle code block expand',
      show: false
    }
  ];

  function codeBlocks() {
    const markedCodeBlocks = elems('code');
    let blocks = Array();
    for (let idx = 0, block = markedCodeBlocks[idx]; idx < markedCodeBlocks.length; block = markedCodeBlocks[++idx]) {
      if (hasClasses(block) && !containsClass(block, 'noClass')) {
        blocks.push(markedCodeBlocks[idx]);
      }
    }
    return blocks;
  }
  const blocks = codeBlocks();

  (function markInlineCodeTags() {
    const codeBlocks = elems('code');
    if (codeBlocks) {
      for (let idx = 0, codeBlock = codeBlocks[idx]; idx < codeBlocks.length; codeBlock = codeBlocks[++idx]) {
        // Fix for orgmode inline code, leave 'verbatim' alone as well
        containsClass(codeBlock, 'verbatim') && pushClass(codeBlock, 'noClass');
        ! hasClasses(codeBlock) && pushClass(codeBlock, 'noClass');
      }
    }
  })();

  (function wrapOrphanedPreElements() {
    const pres = elems('pre');
    for (let idx = 0, pre = pres[idx]; idx < pres.length; pre = pres[++idx]) {
      const parent = pre.parentNode;
      const isOrphaned = !containsClass(parent, 'highlight');
      if (isOrphaned) {
        const preWrapper = createEl('div');
        preWrapper.className = highlightInnerClass;
        const outerWrapper = createEl('div');
        outerWrapper.className = highlightClass;
        wrapEl(pre, preWrapper);
        wrapEl(preWrapper, outerWrapper);
      }
    }
  })();

  function loadSvg(file, parent, path = iconsPath) {
    if (!path.startsWith('http')) {
      path = `${parentURL}${path}`;
    }
    const link = `${path}${file}.svg`;
    fetch(link)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        parent.innerHTML = data;
      });
  }

  function codeBlockFits(block) {
    // return false if codeblock overflows
    const blockWidth = block.offsetWidth;
    const highlightBlockWidth = block.parentNode.parentNode.offsetWidth;
    return blockWidth <= highlightBlockWidth;
  }

  function maxHeightIsSet(el) {
    const maxHeight = el.style.maxHeight;
    return maxHeight.includes('px')
  }

  function restrainCodeBlockHeight(lines) {
    const lastLine = lines[maxLines - 1];
    let maxCodeBlockHeight = fullHeight;
    if (lastLine) {
      // Cannot use the offsetTop of the lastLine element
      // because it is the line number, which may be hidden
      // and return an offsetTop value of 0
      const lastLinePos = lastLine.nextElementSibling.offsetTop
      if (lastLinePos !== 0) {
        maxCodeBlockHeight = `${lastLinePos}px`;
        const codeBlock = lines[0].parentNode.closest('code');
        const outerBlock = codeBlock.closest(`.${highlightInnerClass}`);
        const isExpanded = containsClass(outerBlock, panelExpanded);
        if (!isExpanded) {
          codeBlock.dataset.height = maxCodeBlockHeight;
          codeBlock.style.maxHeight = maxCodeBlockHeight;
        }
      }
    }
  }

  function collapseCodeBlock(block) {
    const lines = elems('.ln', block);
    const codeLines = lines.length;
    if (codeLines > maxLines) {
      const expandDot = createEl('div')
      pushClass(expandDot, panelExpand);
      pushClass(expandDot, panelFrom);
      expandDot.title = "Toggle code block expand";
      expandDot.textContent = "...";
      const outerBlock = block.closest(`.${highlightInnerClass}`);
      restrainCodeBlockHeight(lines);
      if (outerBlock) {
        const expandIcon = outerBlock.nextElementSibling.lastElementChild;
        deleteClass(expandIcon, panelHide);
      }
      const highlightElement = block.parentNode.parentNode;
      if (highlightElement) {
        highlightElement.appendChild(expandDot);
      }
    }
  }

  function actionPanel() {
    const panel = createEl('div');
    panel.className = panelBox;
    for (let idx = 0, button = codeActionButtons[idx]; idx < codeActionButtons.length; button = codeActionButtons[++idx]) {
      // create button
      const btn = createEl('a');
      btn.href = '#';
      btn.title = button.title;
      btn.className = `icon panel_icon panel_${button.id}`;
      ! button.show && pushClass(btn, panelHide);
      // load icon inside button
      loadSvg(button.icon, btn);
      // append button on panel
      panel.appendChild(btn);
    }
    return panel;
  }

  function toggleLineNumbers(lines) {
    for (let line of lines) {
      // mark the code element when there are no lines
      modifyClass(line, 'pre_linenumbers')
    }
    restrainCodeBlockHeight(lines);
  }

  function enableCodeLineNumbers(block) {
    const lines = elems('.ln', block)
    toggleLineNumbers(lines);
  }

  function toggleLineWrap(el) {
    modifyClass(el, 'pre_wrap');
    // retain max number of code lines on line wrap
    const lines = elems('.ln', el);
    restrainCodeBlockHeight(lines);
  }

  function copyCode(codeElement) {
    const lineNumbers = elems('.ln', codeElement);
    // remove line numbers before copying
    if (lineNumbers && lineNumbers.length) {
      for (let idx = 0, line = lineNumbers[idx]; idx < lineNumbers.length; line = lineNumbers[++idx]) {
        line.remove();
      }
    }

    const codeToCopy = codeElement.textContent;
    // copy code
    copyToClipboard(codeToCopy);
  }

  function isItem(target, id) {
    // if is item or within item
    return target.matches(`.${id}`) || target.closest(`.${id}`);
  }

  function showActive(target, targetClass, activeClass) {
    activeClass = activeClass || 'active';
    const active = activeClass;
    const targetElement = target.matches(`.${targetClass}`) ? target : target.closest(`.${targetClass}`);

    deleteClass(targetElement, active);
    setTimeout(function () {
      modifyClass(targetElement, active)
    }, 50)
  }

  doc.addEventListener('click', function (event) {
    // copy code block
    const target = event.target;
    const isCopyIcon = isItem(target, copyId);
    const isWrapIcon = isItem(target, wrapId);
    const isLinesIcon = isItem(target, linesId);
    const isExpandIcon = isItem(target, panelExpand);
    const isActionable = isCopyIcon || isWrapIcon || isLinesIcon || isExpandIcon;

    if (isActionable) {
      event.preventDefault();
      showActive(target, 'icon');
      const codeElement = target.closest(`.${highlightClass}`).firstElementChild.firstElementChild;
      let lineNumbers = elems('.ln', codeElement);

      isWrapIcon && toggleLineWrap(codeElement);

      isLinesIcon && toggleLineNumbers(lineNumbers);

      if (isExpandIcon) {
        let thisCodeBlock = codeElement.firstElementChild;
        const outerBlock = thisCodeBlock.closest(`.${highlightInnerClass}`);
        if (maxHeightIsSet(thisCodeBlock)) {
          thisCodeBlock.style.maxHeight = fullHeight;
          // mark code block as expanded
          pushClass(outerBlock, panelExpanded)
        } else {
          thisCodeBlock.style.maxHeight = thisCodeBlock.dataset.height;
          // unmark code block as expanded
          deleteClass(outerBlock, panelExpanded)
        }
      }

      if (isCopyIcon) {
        // clone code element
        const codeElementClone = codeElement.cloneNode(true);
        copyCode(codeElementClone);
      }
    }
  });

  for (let idx = 0, block = blocks[idx]; idx < blocks.length; block = blocks[++idx]) {
    // disable line numbers if disabled globally
    const showLines = bodyElement.dataset.lines;
    parseBoolean(showLines) && enableCodeLineNumbers(block);

    const highlightElement = block.parentNode.parentNode;
    const highlightInnerElement = createEl('div');
    highlightInnerElement.className = highlightInnerClass;
    wrapEl(block.parentNode, highlightInnerElement);

    const panel = actionPanel();
    // show wrap icon only if the code block needs wrapping
    const wrapIcon = elem(`.${wrapId}`, panel);
    ! codeBlockFits(block) && deleteClass(wrapIcon, panelHide);

    // append buttons
    highlightElement.appendChild(panel);

    // collapse code blocks
    collapseCodeBlock(block);
  }

  (function addLangLabel() {
    const blocks = codeBlocks();
    for (let idx = 0, block = blocks[idx]; idx < blocks.length; block = blocks[++idx]) {
      let label = block.dataset.lang;
      label = label === 'sh' ? 'bash' : label;
      if (label !== "fallback") {
        const labelEl = createEl('div');
        labelEl.textContent = label;
        pushClass(labelEl, 'lang');
        block.closest(`.${highlightClass}`).appendChild(labelEl);
      }
    }
  })();
};
