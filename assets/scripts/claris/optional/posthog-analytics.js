import * as params from "@params";
import posthog from "posthog-js";

const postHogParamsPath = "assets.scripts.posthog";

export function postHogAnalyticsInit() {
  const postHogKey = params.postHogParams?.key;
  const postHogHost = params.postHogParams?.host;
  const postHogSite = params.postHogParams?.site;

  if (posthog && postHogKey && postHogKey.length >= 8
    && postHogHost && postHogHost.length > 3
    && postHogSite && postHogSite.length > 1) {
    posthog.init(postHogKey, {
      api_host: postHogHost,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    });

    function capturePageview() {
      const currentUrl = new URL(window.location.href);
      if (currentUrl) {
        posthog.capture("$pageview", {
          $current_url: currentUrl,
          site: postHogSite
        });
      }
    }
    capturePageview();
  }
}
