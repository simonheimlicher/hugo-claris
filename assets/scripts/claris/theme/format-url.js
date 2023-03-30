/**
 * @file Defines a filter for formatting URLs with properly placed word breaks
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 */

/**
 * Insert line break opportunities into a URL
 * @param {string} url A raw URL
 * @return {string} A formatted URL
 * @see {@link https://www.chicagomanualofstyle.org/book/ed17/part3/ch14/psec018.html Chicago Manual of Style, 17th ed., 14.18}
 * @see {@link https://www.chicagomanualofstyle.org/turabian/toc.html Turabian, 9th ed., 20.4.2}
 */
export default url =>{
  // Split URL into an array to distingish single and double slashes
  var doubleSlash = url.split('//')

  // Format strings on either side of double slashes separately
  var formatted = doubleSlash.map(str => 
      // Insert a word break opporunity after a colon
      str.replace(/(?<colon>:)/giu, '$1<wbr>')
        // Before a single slash, tilde, period, comma, hyphen, underline, question mark, number sign, or percent symbol
        .replace(/(?<before>[/~.,\-_?#%])/giu, '<wbr>$1')
        // Before and after an equals sign or ampersand
        .replace(/(?<both>[=&])/giu, '<wbr>$1<wbr>')

    // Reconnect the strings with word break opportunities after double slashes
    ).join('//<wbr>')

  return formatted
}
