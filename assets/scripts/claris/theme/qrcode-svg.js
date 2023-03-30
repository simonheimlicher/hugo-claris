// console.log('BEGIN qrcode_svg.js');

import {
    isObj,
    createEl,
    elem,
    elems,
    pushClass,
    hasClasses,
    deleteClass,
    modifyClass,
    containsClass,
    elemAttribute,
    wrapEl,
    deleteChars,
    isBlank,
    isMatch,
    copyToClipboard,
    getMobileOperatingSystem,
    horizontalSwipe,
    parseBoolean
  } from './functions';

import QRCode from "qrcode-svg";

// console.log(qrcode.svg());
let targetContainers = document.querySelectorAll(".qrcode-svg");
targetContainers.forEach(function(el, index) {
    var qrcode = new QRCode({
        content: el.dataset.content,
        width: el.dataset.width,
        height: el.dataset.height,
        // color: el.dataset.color,
        // background: el.dataset.background,
        background: "undefined",
        padding: 0,
        container: "svg-viewbox", // Responsive use
        join: true, // Crisp rendering and 4-5x reduced file size
        predefined: false,
    });
    el.innerHTML = qrcode.svg();
});

// console.log('END   qrcode_svg.js');
