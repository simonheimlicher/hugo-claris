import { clarisInit } from 'scripts/claris/base/claris-init';
import { onDOMContentLoaded } from "scripts/claris/base/functions";

// Minimal set of modules
import { colorSchemeInit } from './color-scheme'; // Needs to be loaded early
import { taxonomyOverlayInit } from "./taxonomy-overlay";
import { obfuscatedLinkInit } from "./obfuscated-link";
import { navigationMenuInit } from "./navigation-menu";
import { linkAnchorInit } from "./link-anchor";
import { scrollableTableInit } from "./scrollable-table";
import { footnotesAccessibleInit } from './footnotes-accessible';
onDOMContentLoaded(clarisInit, colorSchemeInit, taxonomyOverlayInit, obfuscatedLinkInit, navigationMenuInit, linkAnchorInit, footnotesAccessibleInit, scrollableTableInit);
