// console.log('BEGIN claris-head_legacy');

// FIXME:
// Cannot get core-js to work
// import "core-js/stable";
// var require_internal_state = __commonJS({ "node_modules/core-js/internals/internal-state.js": function node_modulesCoreJsInternalsInternalStateJs(exports, module) {
//   var NATIVE_WEAK_MAP = require_weak_map_basic_detection();
//   var global2 = require_global();
//   var isObject = require_is_object();
//   var createNonEnumerableProperty = require_create_non_enumerable_property();
//   var hasOwn = require_has_own_property();
//   var shared = require_shared_store();
//   var sharedKey = require_shared_key();
//   var hiddenKeys = require_hidden_keys();
//   var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
//   var TypeError2 = global2.TypeError;
//   var WeakMap2 = global2.WeakMap;
//   var set;
//   var get;
//   var has;
//   var enforce = function enforce2(it) {
//     return has(it) ? get(it) : set(it, {});
//   };
//   var getterFor = function getterFor2(TYPE) {
//     return function(it) {
//       var state;
//       if (!isObject(it) || (state = get(it)).type !== TYPE) {
//         throw TypeError2("Incompatible receiver, " + TYPE + " required"); <=== ERROR
//       }
//       return state;
//     };
//   };

import "scripts/claris/legacy/polyfills";

import 'scripts/claris/theme/init';
// NOTE: color-mode needs to be loaded as early as possible to avoid the infamous
// Flash of Incorrect Color Scheme (FOICS) at page load when dark mode is active
import 'scripts/claris/theme/color-mode';

// NOTE: We need to explicitly call objectFitImages()
import objectFitImages from 'object-fit-images';
function initializeObjectFitImages() {
  objectFitImages();
}
window.addEventListener("DOMContentLoaded", initializeObjectFitImages);

// It is recommended to include all lazysizes plugins before the main import
// https://github.com/aFarkas/lazysizes#available-plugins-in-this-repo
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes';

// console.log('END   claris-head_legacy');
