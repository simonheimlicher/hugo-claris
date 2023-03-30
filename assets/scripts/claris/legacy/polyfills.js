/**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;

        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

/**
 * String.startswith polyfill
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#polyfill
 */
if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function (search, rawPos) {
            var pos = rawPos > 0 ? rawPos | 0 : 0;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}

if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

// https://vanillajstoolkit.com/polyfills/classlist/
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.2.20171210
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

    // Full polyfill for browsers with no classList support
    // Including IE < Edge missing SVGElement.classList
    if (
           !("classList" in document.createElement("_")) 
        || document.createElementNS
        && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))
    ) {
    
    (function (view) {
    
    "use strict";
    
    if (!('Element' in view)) return;
    
    var
          classListProp = "classList"
        , protoProp = "prototype"
        , elemCtrProto = view.Element[protoProp]
        , objCtr = Object
        , strTrim = String[protoProp].trim || function () {
            return this.replace(/^\s+|\s+$/g, "");
        }
        , arrIndexOf = Array[protoProp].indexOf || function (item) {
            var
                  i = 0
                , len = this.length
            ;
            for (; i < len; i++) {
                if (i in this && this[i] === item) {
                    return i;
                }
            }
            return -1;
        }
        // Vendors: please allow content code to instantiate DOMExceptions
        , DOMEx = function (type, message) {
            this.name = type;
            this.code = DOMException[type];
            this.message = message;
        }
        , checkTokenAndGetIndex = function (classList, token) {
            if (token === "") {
                throw new DOMEx(
                      "SYNTAX_ERR"
                    , "The token must not be empty."
                );
            }
            if (/\s/.test(token)) {
                throw new DOMEx(
                      "INVALID_CHARACTER_ERR"
                    , "The token must not contain space characters."
                );
            }
            return arrIndexOf.call(classList, token);
        }
        , ClassList = function (elem) {
            var
                  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
                , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                , i = 0
                , len = classes.length
            ;
            for (; i < len; i++) {
                this.push(classes[i]);
            }
            this._updateClassName = function () {
                elem.setAttribute("class", this.toString());
            };
        }
        , classListProto = ClassList[protoProp] = []
        , classListGetter = function () {
            return new ClassList(this);
        }
    ;
    // Most DOMException implementations don't allow calling DOMException's toString()
    // on non-DOMExceptions. Error's toString() is sufficient here.
    DOMEx[protoProp] = Error[protoProp];
    classListProto.item = function (i) {
        return this[i] || null;
    };
    classListProto.contains = function (token) {
        return ~checkTokenAndGetIndex(this, token + "");
    };
    classListProto.add = function () {
        var
              tokens = arguments
            , i = 0
            , l = tokens.length
            , token
            , updated = false
        ;
        do {
            token = tokens[i] + "";
            if (!~checkTokenAndGetIndex(this, token)) {
                this.push(token);
                updated = true;
            }
        }
        while (++i < l);
    
        if (updated) {
            this._updateClassName();
        }
    };
    classListProto.remove = function () {
        var
              tokens = arguments
            , i = 0
            , l = tokens.length
            , token
            , updated = false
            , index
        ;
        do {
            token = tokens[i] + "";
            index = checkTokenAndGetIndex(this, token);
            while (~index) {
                this.splice(index, 1);
                updated = true;
                index = checkTokenAndGetIndex(this, token);
            }
        }
        while (++i < l);
    
        if (updated) {
            this._updateClassName();
        }
    };
    classListProto.toggle = function (token, force) {
        var
              result = this.contains(token)
            , method = result ?
                force !== true && "remove"
            :
                force !== false && "add"
        ;
    
        if (method) {
            this[method](token);
        }
    
        if (force === true || force === false) {
            return force;
        } else {
            return !result;
        }
    };
    classListProto.replace = function (token, replacement_token) {
        var index = checkTokenAndGetIndex(token + "");
        if (~index) {
            this.splice(index, 1, replacement_token);
            this._updateClassName();
        }
    }
    classListProto.toString = function () {
        return this.join(" ");
    };
    
    if (objCtr.defineProperty) {
        var classListPropDesc = {
              get: classListGetter
            , enumerable: true
            , configurable: true
        };
        try {
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) { // IE 8 doesn't support enumerable:true
            // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
            // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
            if (ex.number === undefined || ex.number === -0x7FF5EC54) {
                classListPropDesc.enumerable = false;
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            }
        }
    } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }
    
    }(self));
    
    }
    
    // There is full or partial native classList support, so just check if we need
    // to normalize the add/remove and toggle APIs.
    
    (function () {
        "use strict";
    
        var testElement = document.createElement("_");
    
        testElement.classList.add("c1", "c2");
    
        // Polyfill for IE 10/11 and Firefox <26, where classList.add and
        // classList.remove exist but support only one argument at a time.
        if (!testElement.classList.contains("c2")) {
            var createMethod = function(method) {
                var original = DOMTokenList.prototype[method];
    
                DOMTokenList.prototype[method] = function(token) {
                    var i, len = arguments.length;
    
                    for (i = 0; i < len; i++) {
                        token = arguments[i];
                        original.call(this, token);
                    }
                };
            };
            createMethod('add');
            createMethod('remove');
        }
    
        testElement.classList.toggle("c3", false);
    
        // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
        // support the second argument.
        if (testElement.classList.contains("c3")) {
            var _toggle = DOMTokenList.prototype.toggle;
    
            DOMTokenList.prototype.toggle = function(token, force) {
                if (1 in arguments && !this.contains(token) === !force) {
                    return force;
                } else {
                    return _toggle.call(this, token);
                }
            };
    
        }
    
        // replace() polyfill
        if (!("replace" in document.createElement("_").classList)) {
            DOMTokenList.prototype.replace = function (token, replacement_token) {
                var
                      tokens = this.toString().split(" ")
                    , index = tokens.indexOf(token + "")
                ;
                if (~index) {
                    tokens = tokens.slice(index);
                    this.remove.apply(this, tokens);
                    this.add(replacement_token);
                    this.add.apply(this, tokens.slice(1));
                }
            }
        }
    
        testElement = null;
    }());
   
}

/*
// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
    Array.from = (function () {
        var symbolIterator;
        try {
            symbolIterator = Symbol.iterator
                ? Symbol.iterator
                : 'Symbol(Symbol.iterator)';
        } catch (e) {
            symbolIterator = 'Symbol(Symbol.iterator)';
        }

        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
            return (
                typeof fn === 'function' ||
                toStr.call(fn) === '[object Function]'
            );
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) return 0;
            if (number === 0 || !isFinite(number)) return number;
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        var setGetItemHandler = function setGetItemHandler(isIterator, items) {
            var iterator = isIterator && items[symbolIterator]();
            return function getItem(k) {
                return isIterator ? iterator.next() : items[k];
            };
        };

        var getArray = function getArray(
            T,
            A,
            len,
            getItem,
            isIterator,
            mapFn
        ) {
            // 16. Let k be 0.
            var k = 0;

            // 17. Repeat, while k < len… or while iterator is done (also steps a - h)
            while (k < len || isIterator) {
                var item = getItem(k);
                var kValue = isIterator ? item.value : item;

                if (isIterator && item.done) {
                    return A;
                } else {
                    if (mapFn) {
                        A[k] =
                            typeof T === 'undefined'
                                ? mapFn(kValue, k)
                                : mapFn.call(T, kValue, k);
                    } else {
                        A[k] = kValue;
                    }
                }
                k += 1;
            }

            if (isIterator) {
                throw new TypeError(
                    'Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1'
                );
            } else {
                A.length = len;
            }

            return A;
        };

        // The length property of the from method is 1.
        return function from(arrayLikeOrIterator) {
            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLikeOrIterator).
            var items = Object(arrayLikeOrIterator);
            var isIterator = isCallable(items[symbolIterator]);

            // 3. ReturnIfAbrupt(items).
            if (arrayLikeOrIterator == null && !isIterator) {
                throw new TypeError(
                    'Array.from requires an array-like object or iterator - not null or undefined'
                );
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError(
                        'Array.from: when provided, the second argument must be a function'
                    );
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method
            // of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            return getArray(
                T,
                A,
                len,
                setGetItemHandler(isIterator, items),
                isIterator,
                mapFn
            );
        };
    })();
}
*/