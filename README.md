ExCookie
==========

> An Extended Cookie Store

It's identical to `$cookieStore`, except it accepts an `options` object.

``` js
angular.module('Foo', ['exCookie']).controller('bar', function (cookieStore) {

  var options = {
    path:    undefined,
    expires: undefined,
    domain:  undefined,
    maxAge:  undefined,
    secure:  false
  };

  // put cookie
  cookieStore.put("key", "value", options);

  // get cookie
  var value = cookieStore.get("key");

  // remove cookie
  cookieStore.remove("key", options);

});
```
