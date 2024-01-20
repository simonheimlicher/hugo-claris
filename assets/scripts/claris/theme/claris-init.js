import * as params from "@params";
import { pushClass, deleteClass } from "./functions";

export const clarisHugoParams = {
  // Params passed to Hugo in the asset pipeline in `claris/_functions/script-bundles.html`
  baseURL: params.baseURL,
  iconsPath: params.iconsPath,
  envDevel: params.envDevel,
  envProd: params.envProd,

  debugFunctionDefinition: params.debugFunctionDefinition,
  debugFunction: eval(params.debugFunctionDefinition),

  // Params to be defined and re-used in other modules
  parentURL: window.location.protocol + "//" + window.location.host + "/",
  // The DOM element that we use to indicate properties of the browser and state of the page
  htmlRootElement: document.documentElement,

  htmlRootClassNoJavaScript: "no-js",
  htmlRootClassModernJavaScript: "modern-js",
  htmlRootClassNoCSSProperties: "no-css-prop",
  htmlRootClassNoCSSGrid: "no-css-grid",
  inline: ":inline",
};

export function clarisInit() {

  const htmlRootElement = clarisHugoParams.htmlRootElement;

  const htmlRootClassNoJavaScript = clarisHugoParams.htmlRootClassNoJavaScript;
  const htmlRootClassNoCSSProperties =
    clarisHugoParams.htmlRootClassNoCSSProperties;
  const htmlRootClassNoCSSGrid = clarisHugoParams.htmlRootClassNoCSSGrid;
  const grid_supported =
    typeof document.createElement("div").style.grid === "string";
  if (!grid_supported) {
    pushClass(htmlRootElement, htmlRootClassNoCSSGrid);
  }

  const css_properties_supported =
    window.CSS &&
    CSS.supports("color", "var(--CSS-property-support-validation)");
  if (!css_properties_supported) {
    pushClass(htmlRootElement, htmlRootClassNoCSSProperties);
  }

  deleteClass(htmlRootElement, htmlRootClassNoJavaScript);
}
