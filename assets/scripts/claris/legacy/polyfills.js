/**
 * Element.matches() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 * https://github.com/jelmerdemaat/element-matches/blob/master/index.js
 */
if (!Element.prototype.matches) {
  Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
}
/**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
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

// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// https://gist.github.com/ryangoree/def0a520ed43c6c465d9a6518161bc7c
(function() {
  if (typeof URL != 'function') {
    rewriteURL();
  } else if (!('searchParams' in new URL(window.location))) {
    rewriteURL();
  }

  function rewriteURL() {

    // Overwrite URL if no searchParams property exists.
    window.URL = function(url, base) {

      var _hash;
      var _hostname;
      var _password;
      var _pathname;
      var _port;
      var _protocol;
      var _search;
      var _username;

      Object.defineProperty(this, 'hash', {
        get: function() {
          return _hash;
        },
        set: function(value) {
          _hash = value.length > 0 ? '#' + value.match(/^#*(.*)/)[1] : '';
          return value;
        }
      });

      Object.defineProperty(this, 'host', {
        get: function() {
          return _port.length > 0 ? _hostname + ':' + _port : _hostname;
        },
        set: function(value) {
          var parts = value.split(':');
          this.hostname = parts[0];
          this.port = parts[1];
          return value;
        }
      });

      Object.defineProperty(this, 'hostname', {
        get: function() {
          return _hostname;
        },
        set: function(value) {
          _hostname = value.length > 0 ? encodeURIComponent(value) : _hostname;
          return value;
        }
      });

      function removeUsername(match, username, password) {
        if (password === '@') {
          return '';
        } else {
          return password;
        }
      }

      Object.defineProperty(this, 'href', {
        get: function() {
          var hrefStr = _protocol + '//';
          if (_username.length > 0 || _password.length > 0) {
            if (_username.length > 0) {
              hrefStr += _username;
            }
            if (_password.length > 0) {
              hrefStr += ':' + _password;
            }
            hrefStr += '@'
          }
          hrefStr += _hostname;
          if (_port.length > 0) {
            hrefStr += ':' + _port;
          }
          hrefStr += _pathname + _search + _hash;
          return hrefStr;
        },
        set: function(value) {

          this.protocol = value;
          value = value.replace(/.*?:\/*/, '');

          var usernameMatch = value.match(/([^:]*).*@/);
          this.username = usernameMatch ? usernameMatch[1] : '';
          value = value.replace(/([^:]*):?(.*@)/, removeUsername);

          var passwordMatch = value.match(/.*(?=@)/);
          this.password = passwordMatch ? passwordMatch[0] : '';
          value = value.replace(/.*@/, '');

          this.hostname = value.match(/[^:/?]*/);

          var portMatch = value.match(/:(\d+)/);
          this.port = portMatch ? portMatch[1] : '';

          var pathnameMatch = value.match(/\/([^?#]*)/);
          this.pathname = pathnameMatch ? pathnameMatch[1] : '';

          var searchMatch = value.match(/\?[^#]*/);
          this.search = searchMatch ? searchMatch[0] : '';

          var hashMatch = value.match(/\#.*/);
          this.hash = hashMatch ? hashMatch[0] : '';
        }
      });

      Object.defineProperty(this, 'origin', {
        get: function() {
          var originStr = _protocol + '//' + _hostname;
          if (_port.length > 0) {
            originStr += ':' + _port;
          }
          return originStr;
        },
        set: function(value) {

          this.protocol = value;
          value = value.replace(/.*?:\/*/, '');

          this.hostname = value.match(/[^:/?]*/);

          var portMatch = value.match(/:(\d+)/);
          this.port = portMatch ? portMatch[1] : '';
        }
      });

      Object.defineProperty(this, 'password', {
        get: function() {
          return _password;
        },
        set: function(value) {
          _password = encodeURIComponent(value);
          return value;
        }
      });

      Object.defineProperty(this, 'pathname', {
        get: function() {
          return _pathname;
        },
        set: function(value) {
          _pathname = '/' + value.match(/\/?(.*)/)[1];
          return value;
        }
      });

      Object.defineProperty(this, 'port', {
        get: function() {
          return _port;
        },
        set: function(value) {
          if (isNaN(value) || value === '') {
            _port = '';
          } else {
            _port = Math.min(65535, value).toString();
          }
          return value;
        }
      });

      Object.defineProperty(this, 'protocol', {
        get: function() {
          return _protocol;
        },
        set: function(value) {
          _protocol = value.match(/[^/:]*/)[0] + ':';
          return value;
        }
      });

      Object.defineProperty(this, 'search', {
        get: function() {
          return _search;
        },
        set: function(value) {
          _search = value.length > 0 ? '?' + value.match(/\??(.*)/)[1] : '';
          return value;
        }
      });

      Object.defineProperty(this, 'username', {
        get: function() {
          return _username;
        },
        set: function(value) {
          _username = value;
        }
      });

      // If a string is passed for url instead of location or link, then set the
      if (typeof url === 'string') {

        // var urlIsValid = /^[a-zA-z]+:\/\/.*/.test(url);
        // A URL is valid even if it does not have two slashes following the protocol
        // The two slashes in HTTP URLs are part of the URI
        // An example of a valid URL without slashes is 'mailto:john@example.com'
        var urlIsValid = /^[a-zA-z]+:.*/.test(url);
        var baseIsValid = /^[a-zA-z]+:\/\/.*/.test(base);

        if (urlIsValid) {
          this.href = url;
        }

        // If the url isn't valid, but the base is, then prepend the base to the url.
        else if (baseIsValid) {
          this.href = base + url;
        }

        // If no valid url or base is given, then throw a type error.
        else {
          throw new TypeError('URL string is not valid. If using a relative url, a second argument needs to be passed representing the base URL. Example: new URL("relative/path", "http://www.example.com");');
        }

      } else {

        // Copy all of the location or link properties to the
        // new URL instance.
        _hash = url.hash;
        _hostname = url.hostname;
        _password = url.password ? url.password : '';
        _pathname = url.pathname;
        _port = url.port;
        _protocol = url.protocol;
        _search = url.search;
        _username = url.username ? url.username: '';

      }

      // Use IIFE to capture the URL instance and encapsulate the params instead of finding them
      // each time a searchParam method is called
      this.searchParams = (function(url) {

        // Create 2 seperate arrays for the params and values to make management and lookup easier.
        var params = [];
        var values = [];
        if (url.search.length > 0) {
          var pairs = url.search.slice(1).split('&');
          pairs.forEach(function(pair) {
            var parts = pair.split('=');
            params.push(parts[0]);
            values.push(parts[1]);
          });
        }

        // Update the search property of the URL instance with the new params and values.
        function updateSearchString() {
          if (params.length === 0) {
            url.search = '';
          } else {
            url.search = params.map(function(param, index) {
              return param + '=' + values[index];
            }).join('&');
          }
        }

        // Expose functions to mimic the behavior of the native searchParams methods.
        return {

          // Add a given param with a given value to the end.
          append: function(param, value) {
            params.push(param);
            values.push(value);
            updateSearchString();
          },

          // Remove all occurances of a given param
          delete: function(param) {
              while(params.indexOf(param) > -1) { // Continue until the param is not found.
                values.splice(params.indexOf(param), 1);
                params.splice(params.indexOf(param), 1);
              }
              updateSearchString();
          },

          // Return an array to be structured in this way: [[param1, value1], [param2, value2]] to
          // mimic the native method's ES6 iterator.
          entries: function() {
            return params.map(function(param, index) {
              return [param, values[index]];
            });
          },

          // Return the value matched to the first occurance of a given param.
          get: function(param) {
            return values[params.indexOf(param)];
          },

          // Return all values matched to all occurances of a given param.
          getAll: function(param) {
            return values.filter(function(value, index) {
              return params[index] === param;
            });
          },

          // Return a boolean to indicate whether a given param exists.
          has: function(param) {
            return params.indexOf(param) > -1;
          },

          // Return an array of the param names to mimic the native method's ES6 iterator.
          keys: function() {
            return params;
          },

          // Set a given param to a given value.
          set: function set(param, value) {
            if (params.indexOf(param) === -1) {
              this.append(param,value); // If the given param doesn't already exist, append it.
            } else {

              var first = true;
              var newValues = [];

              // If the param already exists, change the value of the first occurance and remove any
              // remaining occurances.
              params = params.filter(function(currentParam, index) {

                // If the currentParam isn't the one being changed keep the param and it's current value.
                if (currentParam !== param) {
                  newValues.push(values[index]);
                  return true;
                }

                // If the currentParam matches the one being changed and it's the first one, keep the
                // param and change its value to the given one.
                else if (first) {
                  first = false;
                  newValues.push(value);
                  return true;
                }

                // If the currentParam matches the one being changed, but it's not the first, remove it.
                return false;
              });
              values = newValues;
              updateSearchString();
            }
          },

          // Sort all key/value pairs, if any, by their keys then by their values.
          sort: function() {

            // Call entries to make sorting easier, then rewrite the params and values in the new order.
            var sortedPairs = this.entries().sort();
            params = [];
            values = [];
            sortedPairs.forEach(function(pair) {
              params.push(pair[0]);
              values.push(pair[1]);
            })
            updateSearchString();
          },

          // Return the search string without the '?'.
          toString: function() {
            return url.search.slice(1);
          },

          // Return and array of the param values to mimic the native method's ES6 iterator..
          values: function() {
            return values;
          }
        };
      })(this);
    }
  }
})()

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
