import * as params from "@params";
import posthog from "posthog-js";

(() => {
  if (posthog && params?.site?.posthog?.key && params.site.posthog.host) {
    posthog.init(params.site.posthog.key, {
      api_host: params.site.posthog.host,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    });

    function capturePageview() {
      const currentUrl = new URL(window.location.href);
      if (currentUrl) {
        posthog.capture("$pageview", {
          $current_url: currentUrl,
          site: params.site.website.name
        });
      }
    }
    capturePageview();
  }
  else {
    console.log(`posthog:`, posthog, `params`, params, `params.site`, params?.site, `params.site.posthog`, params?.site?.posthog)
  }
})();
