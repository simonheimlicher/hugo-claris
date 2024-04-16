import * as params from "@params";
import posthog from "posthog-js";

const postHogParamsPath = "assets.scripts.posthog";

export function postHogAnalyticsInit() {
  // Function to access nested object value by string path
  const getValueByPath = (obj, path) => {
    return path.split('.').reduce((acc, part) => (acc[part]), obj);
  };

  const postHogParams = getValueByPath(params?.site, postHogParamsPath);
  const postHogKey = postHogParams?.key;
  const postHogHost = postHogParams?.host;
  const postHogSite = postHogParams?.site;

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
  } else {
    console.log(`Invalid params for PostHog Analytics at site.Params.${postHogParamsPath}`);
    console.log(`postHogParams.key:`, postHogParams.key,
      ` postHogParams.host:`, postHogParams.host,
      ` postHogParams.site:`, postHogParams.site);
  }
}
