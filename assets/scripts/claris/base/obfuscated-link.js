export function obfuscatedLinkInit() {
  const obfuscatedLinkKeyOneTimePasswordAttr = 'data-obfuscated-link-one-time-password';
  const nodeList = document.querySelectorAll('[' + obfuscatedLinkKeyOneTimePasswordAttr + ']');
  const nodesArray = Array.from(nodeList); // Convert NodeList to an array

  // console.log("obfuscated-link: deobufscating links: ", nodeList);

  const indexToChar = [
    "+",
    "/",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "=",
  ];

  const charToIndex = {
    "+": 0,
    "/": 1,
    "0": 2,
    "1": 3,
    "2": 4,
    "3": 5,
    "4": 6,
    "5": 7,
    "6": 8,
    "7": 9,
    "8": 10,
    "9": 11,
    "A": 12,
    "B": 13,
    "C": 14,
    "D": 15,
    "E": 16,
    "F": 17,
    "G": 18,
    "H": 19,
    "I": 20,
    "J": 21,
    "K": 22,
    "L": 23,
    "M": 24,
    "N": 25,
    "O": 26,
    "P": 27,
    "Q": 28,
    "R": 29,
    "S": 30,
    "T": 31,
    "U": 32,
    "V": 33,
    "W": 34,
    "X": 35,
    "Y": 36,
    "Z": 37,
    "a": 38,
    "b": 39,
    "c": 40,
    "d": 41,
    "e": 42,
    "f": 43,
    "g": 44,
    "h": 45,
    "i": 46,
    "j": 47,
    "k": 48,
    "l": 49,
    "m": 50,
    "n": 51,
    "o": 52,
    "p": 53,
    "q": 54,
    "r": 55,
    "s": 56,
    "t": 57,
    "u": 58,
    "v": 59,
    "w": 60,
    "x": 61,
    "y": 62,
    "z": 63,
    "=": 64,
  };

  // If the nodeList contains multiple elements with the same parentNode, the `.parentNode`
  // property will become undefined when we replace the first child.
  let postponedNodes = []
  for (const node of nodesArray) {
    if (!node.parentNode) {
      postponedNodes.push(node);
      continue; // Skip this iteration if parentNode is null
    }

    const parentNode = node.parentNode;
    const scheme = node.dataset['obfuscatedLinkScheme'];
    const text = node.dataset['obfuscatedLinkText'];
    const title = node.dataset['obfuscatedLinkTitle'];
    const encrypted = node.dataset['obfuscatedLinkEncrypted'];
    const oneTimePassword = node.dataset['obfuscatedLinkOneTimePassword'];
    const numSymbols = indexToChar.length;
    let decryptedEncoded = new Array();
    for (var i = 0; i < encrypted.length; ++i) {
      const encryptedIndex = charToIndex[encrypted[i]];
      const oneTimePasswordIndex = charToIndex[oneTimePassword[i]];
      const decryptedIndex = (encryptedIndex - oneTimePasswordIndex + numSymbols) % numSymbols;
      decryptedEncoded[i] = indexToChar[decryptedIndex];
    }
    const decrypted = atob(decryptedEncoded.join(''));
    let address = decrypted;
    if (decrypted.startsWith(scheme)) {
      address = decrypted.substring(scheme.length);
    }
    const url = new URL(decrypted);
    // console.log('encrypted: ', encrypted, ' oneTimePassword: ', oneTimePassword, ' decryptedEncoded: ', decryptedEncoded, ' address: ', address);
    let unobfuscatedNode = document.createElement(node.tagName)
    const targetAttribute = (scheme.startsWith("http")) ? ' target="_blank" ' : '';
    unobfuscatedNode.innerHTML = '<' + 'a hr' + 'ef="' + scheme + address
      + '" title="' + title.replace('OBFUSCATED', address) + '"' + targetAttribute + '>'
      + (text ? text.replace('OBFUSCATED', address) : address) + '</a>';
    parentNode.replaceChild(unobfuscatedNode, node)
    // Eliminate trailing newline if and only if it is followed by a non-letter character
    // based on the unicode category not begin "letter": `\P{L}`
    // Note: for this regex to work, we need to switch to unicode mode by appending `u`
    // parentNode.innerHTML = parentNode.innerHTML.replace(/^(.*[^ ])\n/, '$1').replace(/\n+(.)$/, '$1')
    // parentNode.innerHTML = parentNode.innerHTML.replace(/^(.*)\n/u, '$1');
    const searchPattern = String.raw`^(.*)\n(\P{L}+)`;
    const flags = 'us';
    const replacement = String.raw`$1$2`;
    const stripNewlineRE = new RegExp(searchPattern, flags);
    // const replacementLog = `UUU$1VVV$2WWW`;
    // console.log(parentNode.innerHTML.replace(stripNewlineRE, replacementLog));
    parentNode.innerHTML = parentNode.innerHTML.replace(stripNewlineRE, replacement);
  }
  if (postponedNodes.length > 0) {
    // Re-run the function at the next animation frame
    requestAnimationFrame(obfuscatedLinkInit);
  }
}
