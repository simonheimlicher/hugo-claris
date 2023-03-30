// console.log('BEGIN theme/minimal.js');
import {
    htmlRootElement,
    htmlRootClassNoJavaScript,
    deleteClass
} from './init';

// deleteClass(htmlRootElement, htmlRootClassNoJavaScript);
import "./tags";
import "./obfuscated-link";
import "./mobile-nav";
// NOTE: color-mode needs to be loaded as early as possible to avoid the infamous
// Flash of Incorrect Color Scheme (FOICS) at page load when dark mode is active
// import './color-mode';
import "./link-anchor";
import './footnotes-accessible';
import './qrcode-svg';
// console.log('END   theme/minimal.js');
