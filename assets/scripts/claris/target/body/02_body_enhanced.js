/* File='scripts/claris/target/body/02_body_enhanced.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

// NOTE: JavaScript code in this file is executed as a module at the bottom of <body>
// This means that
// * Loading is "defer" on browsers that support the "module" attribute
//   while all other browsers ignore this script
// * Execution is synchronous, i.e., the script does not have the "async" attribute

import "scripts/claris/enhanced";
