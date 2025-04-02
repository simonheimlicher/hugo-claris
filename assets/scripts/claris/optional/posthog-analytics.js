import posthog from "posthog-js";

export function postHogAnalyticsInit(postHogKey, postHogHost) {
  if (posthog && postHogKey && postHogKey.length >= 8
    && postHogHost && postHogHost.length > 3) {
    // Initialize PostHog
    // Note: as per https://posthog.com/docs/libraries/js#option-2-install-via-package-manager,
    // this automatically captures page views and user interactions
    posthog.init(postHogKey, {
      api_host: postHogHost
    });
  } else {
    console.warn("PostHog analytics not initialized: missing key (", postHogKey, ") or host (", postHogHost, ")");
  }
}
