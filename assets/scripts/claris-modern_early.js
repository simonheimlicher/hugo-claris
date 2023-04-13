// console.log('BEGIN modern_early.js');
// FIXME: Must not import init multiple times
// It will be loaded automatically when one of its functions is first accessed
// import 'scripts/claris/theme/init';
// NOTE: color-mode needs to be loaded as early as possible to avoid the infamous
// Flash of Incorrect Color Scheme (FOICS) at page load when dark mode is active
// console.log('iconsPath: ', iconsPath);

import 'scripts/claris/theme/color-mode';

// import 'lazysizes';
// import 'lazysizes/plugins/parent-fit/ls.parent-fit';
// console.log('END   modern_early.js');
