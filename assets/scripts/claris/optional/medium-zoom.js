import mediumZoom from 'medium-zoom';

export function mediumZoomInit() {
  const mediumZoomOptions = {
    container: {
      top: 48,
      right: 24,
      bottom: 48,
      left: 24
    },
    background: 'inherit',
  };

  mediumZoom('[data-zoomable]', mediumZoomOptions);
};

// NOTE: The below does not appear to work
// document.addEventListener("lazybeforeunveil", e => {
//   mediumZoom("[data-zoomable]", mediumZoomOptions);
// });
