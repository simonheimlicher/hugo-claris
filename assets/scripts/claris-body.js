/* File='scripts/claris-body.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

// NOTE: JavaScript code in this file is executed as a module at the bottom of the <body>
// This means that
// * Loading is "defer" on browsers that support the "module" attribute
//   while all other browsers ignore this script
// * Execution is synchronous, i.e., the script does not have the "async" attribute

import { onDOMContentLoaded } from "scripts/claris/base";
import "scripts/claris/base";
import "scripts/claris/enhanced";

// NOTE: Optional modules must be conditionally included at the Go template-level;
// otherwise, they would have to be installed independently of the Hugo config.
// Therefore, all optional NPM packages are loaded in this Go template script

let optionalModules = [];
{{- if page.Param "assets.scripts.mediumzoom" }}
import { mediumZoomInit } from "scripts/claris/optional/medium-zoom";
optionalModules.push(mediumZoomInit);
{{- end }}

// Additional modules that can be imported: "./qrcode-svg", "./web-vitals-analytics"

// Only load PostHog Analytics in production and staging environments
{{- $postHogEnv := page.Param "assets.scripts.posthog.environments" | default (slice "prod" "stage") }}
{{- if in $postHogEnv hugo.Environment }}
  {{- if and (page.Param "assets.scripts.posthog.key") (page.Param "assets.scripts.posthog.host") }}
import { postHogAnalyticsInit } from "scripts/claris/optional/posthog-analytics";
optionalModules.push(postHogAnalyticsInit);
  {{- else }}
    {{- warnf "Optional module 'posthog-analytics' is not loaded because the parameters in map `assets.scripts.posthog` are missing." }}
  {{- end }}
  {{- else }}
    {{- warnf "Optional module 'posthog-analytics' is not loaded because the Hugo environment %s is not in %s." hugo.Environment $postHogEnv }}
{{- end }}

onDOMContentLoaded(...optionalModules);
