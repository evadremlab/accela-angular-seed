(function (global) {
  'use strict';

  String.prototype.format = function() { // requires the sprintf bower package
    return vsprintf(this, Array.prototype.slice.apply(arguments));
  };

  if (!global.Accela) {
    global.Accela = (function () {

      /**
       * Extend the Accela object without affecting any existing parts.
       */
      function createNamespace(name, value) {
        var obj = global.Accela;
        var nameParts = name ? name.split('.') : [];

        nameParts.forEach(function(part, index) {
          var isLastPart = ((nameParts.length - index) === 1);

          if (!obj[part]) {
            obj[part] = isLastPart ? value || {} : {};
          }

          obj = obj[part];
        });

        return obj;
      }

      /**
       * Create a module within the namespace
       * usage: var foo = Accela.module("xxx.yyy", { foo: 'bar' });
       * usage: var foo = Accela.module("xxx.yyy", function() {...});
       * then you can reference Accela.xxx.yyy
       */
      function module(name, value) {
        if (typeof value === 'function') {
          return createNamespace(name, value);
        } else {
          return angular.copy(value, createNamespace(name));
        }
      }

      // PUBLIC interface

      return {
        module: module
      };
    })();
  }

  Accela.module('XHR', (function () {
    /**
     * Used for sending error details to the server
     * and for unit testing with mock data.
     */
    function createXHRObject() {
      try {
        return new XMLHttpRequest();
      } catch (ex) {
        try {
          return new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (ex) {
          try {
            return new ActiveXObject('Microsoft.XMLHTTP');
          } catch (ex) {
            throw new Error('No XHR object found in this environment.');
          }
        }
      }
    }

    /**
     * Make synchronous request to load json files when unit testing
     * defined in karma.conf.js under "files: [ { pattern : } ]"
     */
    function getMockData(serviceUrl) {
      var data = {};
      var xhr = createXHRObject();

      xhr.open('GET', 'base/' + serviceUrl, false); // 'base/' prefix required to locate files
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.send(null);

      if (xhr.status === 200) {
        data = angular.fromJson(xhr.responseText);
      }

      return data;
    }

    /**
     * Make asynchronous request to send log details to server
     */
    function post(url, logData, accesskey) {
      var xhr = createXHRObject();

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

      if (accesskey) {
        xhr.setRequestHeader('accesskey', accesskey);
      }

      xhr.send(JSON.stringify(logData));
    }

    return {
      getMockData: getMockData,
      post: post
    };
  })());

})(window);
