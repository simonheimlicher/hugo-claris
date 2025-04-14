/* File='scripts/claris/bundles/03_optional.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

// JavaScript code in this file is loaded on the `load` event based on
// code that is added at the bottom of <body> This means that
// * Loading only starts after *First Contentful Paint*
// * Execution is synchronous, i.e., the script does not have the "async"
//   attribute

// NOTE: Optional modules must be conditionally included at the Go template-level;
// otherwise, they would have to be installed independently of the Hugo config.
// Therefore, all optional NPM packages are loaded in this Go template script
{{- $initializers := slice }}

{{- if page.Param "assets.scripts.optional.mediumzoom" }}
import { mediumZoomInit } from "scripts/claris/optional/medium-zoom";
  {{- $initializers = append "mediumZoomInit" $initializers }}
{{- end }}

{{- if page.Param "assets.scripts.optional.qrcode-svg" }}
import { qrCodeInit } from "scripts/claris/optional/qrcode-svg";
  {{- $initializers = append "qrCodeInit" $initializers }}
{{- end }}

// Only load PostHog Analytics in production and staging environments
{{- with $postHogKey := page.Param "assets.scripts.optional.posthog.key" | default "" }}
  {{- $postHogEnv := page.Param "assets.scripts.optional.posthog.environments" | default (slice "production" "prod" "staging" "stage") }}
  {{- if in $postHogEnv hugo.Environment }}
    {{- $postHogHost := page.Param "assets.scripts.optional.posthog.host" | default "" }}
    {{- $postHogKey = strings.TrimSpace $postHogKey }}
    {{- $postHogHost = strings.TrimSpace $postHogHost }}
    {{- if and (gt (len $postHogKey) 8) (gt (len $postHogHost) 3) }}
import { postHogAnalyticsInit } from "scripts/claris/optional/posthog-analytics";
const postHogAnalyticsInitParametrized = () => postHogAnalyticsInit({{ printf "%q" $postHogKey | safeJS }}, {{ printf "%q" $postHogHost | safeJS }});
    {{- $initializers = append "postHogAnalyticsInitParametrized" $initializers }}
    {{- else }}
      {{- warnf "Optional module 'posthog-analytics' is not loaded because the parameters in map `assets.scripts.optional.posthog` are invalid" }}
    {{- end }}
  {{- else }}
    {{- warnf "Optional module 'posthog-analytics' is not loaded because the Hugo environment %s is not in %s." hugo.Environment $postHogEnv }}
  {{- end }}
{{- end }}

{{- with $initializers }}
import { onDOMContentLoaded } from "scripts/claris/base/functions";
onDOMContentLoaded({{ delimit $initializers ", " }});
{{- end }}
