// console.log('BEGIN claris-body');

import 'scripts/claris/theme/init';
import 'scripts/claris/theme/color-scheme';

import 'scripts/claris/theme/minimal';
import 'scripts/claris/theme/enhanced';

{{- if and (page.Param "posthog.key") (page.Param "posthog.host") }}
import 'scripts/claris/theme/posthog-analytics';
{{- end }}

// console.log('END   claris-body');
