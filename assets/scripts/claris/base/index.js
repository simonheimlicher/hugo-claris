import { clarisInit } from 'scripts/claris/base/claris-init';

// Ensure we load all modules in the right order and exactly once
// Earliest when DOMContentLoaded fires
// However, as this event might already have passed, especially on fast connections,
// we check the `readyState` and execute `init()` immediately if the document is
// no longer in the `loading` state
// From https://stackoverflow.com/a/7053197/617559
export function onDOMContentLoaded(...initializationFunctions) {
  function init() {
    initializationFunctions.forEach(function (fn) {
      fn();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
};

// Minimal set of modules
import { colorSchemeInit } from './color-scheme'; // Needs to be loaded early
import { taxonomyOverlayInit } from "./taxonomy-overlay";
import { obfuscatedLinkInit } from "./obfuscated-link";
import { navigationMenuInit } from "./navigation-menu";
import { linkAnchorInit } from "./link-anchor";
import { scrollableTableInit } from "./scrollable-table";
import { footnotesAccessibleInit } from './footnotes-accessible';
onDOMContentLoaded(clarisInit, colorSchemeInit, taxonomyOverlayInit, obfuscatedLinkInit, navigationMenuInit, linkAnchorInit, footnotesAccessibleInit, scrollableTableInit);
