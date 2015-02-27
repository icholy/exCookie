(function () {
  "use strict";

  var CookieStoreService = function ($document, $log) {

    var rawDocument = $document[0];
    var baseElement = $document.find('base');

    function baseHref() {
      var href = baseElement.attr('href');
      return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
    }

    function safeDecodeURIComponent(str) {
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }

    function safeDecodeJson(src) {
      try {
        return angular.fromJson(src);
      } catch (e) {
        return src;
      }
    };

    var defaultCookiePath = baseHref();

    function encodeAttributes(options) {
      var attr = "";
      options = options || {};
      options.path = options.path || defaultCookiePath;

      if (angular.isDefined(options.domain)) {
        attr += ";domain=" + options.domain;
      }
      if (angular.isDefined(options.path)) {
        attr += ";path=" + options.path;
      }
      if (angular.isDefined(options.expires)) {
        attr += ";expires=" + options.expires;
      }
      if (angular.isDefined(options.maxAge)) {
        attr += ";max-age=" + options.maxAge;
      }
      if (options.secure === true) {
        attr += ";secure";
      }
      return attr;
    }

    function encodeCookie(name, value, options) {
      var encodeValue;
      if (angular.isDefined(value)) {
        encodeValue = encodeURIComponent(angular.toJson(value));
      } else {
        encodeValue = '';
      }
      return encodeURIComponent(name) + '=' + encodeValue + encodeAttributes(options);
    }

    var lastCookies = {};
    var lastCookieString = '';

    var parseCookies = function () {
      var cookieArray, cookie, i, index, name;

      if (rawDocument.cookie !== lastCookieString) {
        lastCookieString = rawDocument.cookie;
        cookieArray = lastCookieString.split("; ");
        lastCookies = {};

        for (i = 0; i < cookieArray.length; i++) {
          cookie = cookieArray[i];
          index = cookie.indexOf('=');
          if (index > 0) { //ignore nameless cookies
            name = safeDecodeURIComponent(cookie.substring(0, index));
            // the first value that is seen for a cookie is the most
            // specific one.  values for the same cookie name that
            // follow are for less specific paths.
            if (lastCookies[name] === undefined) {
              lastCookies[name] = safeDecodeURIComponent(
                  cookie.substring(index + 1));
            }
          }
        }
      }
      return lastCookies;
    };

    var MIN_EXPIRES_DATE = "Thu, 01 Jan 1970 00:00:00 GMT";

    /**
     * Remove a cookie by name
     *
     * @method remove
     * @param {string} name
     * @param {object} options
     */
    this.remove = function (name, options) {
      options = options || {};
      options.expires = MIN_EXPIRES_DATE;
      rawDocument.cookie = encodeCookie(name, undefined, options);
    };

    /**
     * Put a cookie value
     *
     * @method put
     * @param {string} name
     * @param {any} value
     * @param {object} options
     */
    this.put = function (name, value, options) {
      rawDocument.cookie = encodeCookie(name, value, options);

      // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
      // - 300 cookies
      // - 20 cookies per unique domain
      // - 4096 bytes per cookie
      var cookieLength = rawDocument.cookie.length + 1;
      if (cookieLength > 4096) {
        $log.warn("Cookie '" + name +
          "' possibly not set or overflowed because it was too large (" +
          cookieLength + " > 4096 bytes)!");
      }
    };

    /**
     * Get a single cookie
     *
     * @method get
     * @param {string} name
     * @return {any} cookie value
     */
    this.get = function (name) {
      var cookies = parseCookies();
      return safeDecodeJson(cookies[name]);
    };


  };

  CookieStoreService.$inject = ['$document', '$log'];

  angular.module('exCookie', []).service('cookieStore', CookieStoreService);

}).call(null);
