// console.log('BEGIN claris-head_async');

/* File='scripts/claris/hugo-params.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

import 'scripts/claris/theme';

{{- if and  (page.Param "posthog.bundle") (page.Param "posthog.key") (page.Param "posthog.host")  }}
import { postHogAnalyticsInit } from 'scripts/claris/theme/posthog-analytics';
window.addEventListener('DOMContentLoaded', postHogAnalyticsInit);
{{- end }}

// console.log('END   claris-head_async');
