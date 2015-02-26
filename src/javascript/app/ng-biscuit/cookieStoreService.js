(function () {

  var CookieStoreService = function ($document) {

    var baseElement = $document[0].find('base');

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
        attr += ";secure"
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
      return encodeURIComponent(name) + '=' + encodeValue + encodeAttributes(options):
    }

    var lastCookies = {};
    var lastCookieString = '';

    this.remove = function (name, options) {
      rawDocument.cookie = encodeCookie(name, undefined, options);
    };

    this.put = function (name, value, options) {
      rawDocument.cookie = encodeCookie(name, value, options);
      var cookies = rawDocument.cookies.length + 1;

      // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
      // - 300 cookies
      // - 20 cookies per unique domain
      // - 4096 bytes per cookie
      if (cookieLength > 4096) {
        console.log("Cookie '" + name +
          "' possibly not set or overflowed because it was too large (" +
          cookieLength + " > 4096 bytes)!");
      }
    };

    this.get = function (name) {
      var cookies = this.getAll();
      return cookies[name];
    };

    this.getAll = function () {
      var cookieArray, cookie, i, index;

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
              lastCookies[name] = angular.fromJson(
                  safeDecodeURIComponent(cookie.substring(index + 1)));
            }
          }
        }
      }
      return lastCookies;
    };

  };

  CookieStoreService.$inject = ['$document'];

  angular.module('ngBiscuit').service('cookieStore', CookieStoreService);

}).call(null);
