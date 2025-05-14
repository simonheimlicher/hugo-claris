/* File='scripts/claris/bundles/01_base.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

// NOTE: JavaScript code in this file is inlined at the bottom of <head>
// This means that
// * Execution is synchronous, i.e., the script does not have the "async" attribute

/**
* Make <picture> <source> elements with media="(prefers-color-scheme:)"
* respect custom theme preference overrides.
* Otherwise the `media` preference will only respond to the OS-level setting
* Unfortunately, if the user overrides the preferred color scheme,
* the image resource for the preferred color scheme will already have been requested
* by the time JavaScript is executed. Therefore, we need to initially put a
* placeholder in the srcset attribute and then switch over to the correct image
* in the function below.
* Source: https://larsmagnus.co/blog/how-to-make-images-react-to-light-and-dark-scheme
*/
try {
  document.documentElement.dataset.colorScheme = window.localStorage.getItem('userSelectedColorScheme');
} catch (e) {
  console.log(e);
}
