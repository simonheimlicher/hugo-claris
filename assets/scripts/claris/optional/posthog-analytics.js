import * as params from "@params";
import posthog from "posthog-js";

export function postHogAnalyticsInit() {
  const postHogKey = params.postHogParams?.key;
  const postHogHost = params.postHogParams?.host;
  const postHogSite = params.postHogParams?.site;

  if (posthog && postHogKey && postHogKey.length >= 8
    && postHogHost && postHogHost.length > 3
    && postHogSite && postHogSite.length > 1) {
    // Initialize PostHog
    // Note: as per https://posthog.com/docs/libraries/js#option-2-install-via-package-manager,
    // this automatically captures page views and user interactions
    posthog.init(postHogKey, {
      api_host: postHogHost
    });
  }
}
