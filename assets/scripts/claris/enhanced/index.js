import { onDOMContentLoaded } from "scripts/claris/base/functions";

import { tableOfContentsInit } from "./table-of-contents";
import { codeBlocksInit } from "./code-blocks";
import { lazyLoadingInit } from "./lazy-loading"
onDOMContentLoaded(tableOfContentsInit, codeBlocksInit, lazyLoadingInit);
