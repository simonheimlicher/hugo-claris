import { onDOMContentLoaded } from "scripts/claris/base";

import { tableOfContentsInit } from "./table-of-contents";
import { codeBlocksInit } from "./code-blocks";
import { lazyLoadingInit } from "./lazy-loading"
onDOMContentLoaded(tableOfContentsInit, codeBlocksInit, lazyLoadingInit);
