// console.log("BEGIN claris-head_async");

/* File='scripts/claris-head_async.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

// NOTE: JavaScript code in this file is executed as a module in the <head>
// This means that
// * Loading is "defer" on browsers that support the "module" attribute
//   while all other browsers ignore this script
// * Execution is asynchronous, i.e., the script has the "async" attribute

import { onDOMContentLoaded } from "scripts/claris/base";
import "scripts/claris/base";
import "scripts/claris/enhanced";

// NOTE: Optional modules must be conditionally included at the Go template-level;
// otherwise, they would have to be installed independently of the Hugo config.
// Therefore, all optional NPM packages are loaded in this Go template script

let optionalModules = [];
{{- if page.Param "assets.scripts.optional.mediumzoom" }}
import { mediumZoomInit } from "scripts/claris/optional/medium-zoom";
optionalModules.push(mediumZoomInit);
{{- end }}

// import "./qrcode-svg"; // Not used
// import "./web-vitals-analytics"; // Not needed

{{- if and (page.Param "posthog.bundle") (page.Param "posthog.key") (page.Param "posthog.host")  }}
import { postHogAnalyticsInit } from "scripts/claris/optional/posthog-analytics";
optionalModules.push(postHogAnalyticsInit);
{{- end }}

onDOMContentLoaded(...optionalModules);

// console.log("END   claris-head_async");
