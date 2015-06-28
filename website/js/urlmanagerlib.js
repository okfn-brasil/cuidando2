define(["jquery"], function ($) {

  "use strict";

  // ****************************************************
  //                    URL MANAGER
  // ****************************************************
  /* Usage:

      var urlManager = new UrlManager({
        // Define the Hash format with the main params positions.
        // The extra params will be treated as query string.
        format: '#{{mainParam1}}/{{mainParam2}}',
        // Add all relevant params. This object will be used to subscribe for
        // changes using pubsub. Use `null` or `undefined` for optional params
        // with no initial values.
        params: {
          mainParam1: "mainParam1DefaultValue",
          mainParam2: "mainParam2DefaultValue",
          extraParam1: 0,
          extraParam2: null
        },
        // Define functions to parse params that are not strings.
        // In this example "extraParam1" is an integer.
        parsers: {
          extraParam1: parseInt
        },
        // The same `pubsub` object used by all components to be synced with the
        // URL params.
        pubsub: pubsub
      });
      // The URL "/#spam/eggs?extraParam1=2&extraParam2=foo" will result in
      // {
      //    mainParam1: "spam",
      //    mainParam2: "eggs",
      //    extraParam1: 2,
      //    extraParam2: "foo"
      // }
      //
      // `pubsub.publish('mainParam1.changed', { value: 'ham' })` will change
      // the URL to "/#ham/eggs?extraParam1=2&extraParam2=foo"
      //
      // Changing any extra param to its default value will remove it from URL.
      //
      // `pubsub.publish('extraParam1.changed', { value: 0 })` will change
      // the URL to "/#ham/eggs?extraParam2=foo"
  */

  var UrlManager = function() { this.init && this.init.apply(this, arguments); };

  UrlManager.prototype = {
    init: function(opts) {
      this.pubsub = opts.pubsub;
      this.format = opts.format;
      if (this.format.indexOf('{{params}}') == -1) this.format += "?{{params}}"
      this.location = opts.location || window.location;
      this.url = this.location.href;
      this.parsers = opts.parsers || {};
      this.defaultParams = $.extend({}, opts.params);
      this.params = $.extend({}, this.defaultParams, this.extractParamsFromUrl());
      this.lastChangedParams = {};
      this.handleEvents();
      return this;
    },

    handleEvents: function() {
      var that = this;
      // Listen to hashchange event.
      window.onhashchange = function() {
        if (that.location.href != that.url) {
          that.url = this.location.href;
          that.updateParams();
          that.broadcast();
        }
      };
      // Get params from options and listen to each param change notification
      $.each(this.params, function(name, value) {
        (function(paramName) {
          that.pubsub.subscribe(paramName + ".changed", function(msg, content, sender) {
            that.setParam(paramName, content.value);
          });
        })(name);
      })
      return this;
    },

    setParam: function(name, value) {
      if (this.params[name] != value) {
        this.params[name] = value;
        var hash = this.createURL();
        this.url = this.location.origin + "/" + hash
        this.location.hash = hash;  // Update URL.
      }
      return this;
    },

    getParam: function(name) {
      return this.params[name];
    },

    updateParams: function() {
      var oldParams = this.params;
      this.params = this.extractParamsFromUrl();
      this.lastChangedParams = this._getDiff(oldParams, this.params);
    },

    broadcast: function() {
      // Broadcast all changes.
      var that = this;
      $.each(this.lastChangedParams, function(name, value) {
        that.pubsub.publish(name + '.changed', { value: value }, that);
      });
      return this;
    },

    extractParamsFromUrl: function() {
      var that = this,
          params = {},
          hash = this._getHash(),              // Get URL hash
          query = this._getQuery().slice(1),   // Get query string
          // Get params from URL hash and query string
          // The URL "/#spam/eggs?foo=bar&bla=ble" will result in
          //  mainParamsValues = ['spam', 'eggs']
          //  extraParams = ['foo=bar', 'bla=ble']
          mainParamsValues = hash == "" ? [] : hash.split('/'),
          extraParams = query == "" ? [] : query.split('&');

      var parse = function (key, value) {
        if($.isFunction(that.parsers[key])) {
          // Parse the extracted value
          value = that.parsers[key](value);
        }
        return value;
      };
      // Extract main params.
      // We get the main params keys from `format` option.
      $.each(this._getMainParamsNames(), function(i, key) {
        var value = mainParamsValues[i];
        if (value !== undefined) {
          if (value == 'null' || value == 'undefined') value = null;
          value = parse(key, value);
          params[key] = value;
        }
      });
      // Extract extra params.
      $.each(extraParams, function(i, param) {
        // Separate the extra param key from its value.
        var parts = param.split('='),
            name  = parts[0],
            value = parts[1];
        if (params[name] !== undefined) {
          // Already exist a param with the same key, so create an array.
          params[name] = [params[name]]
        }
        value = parse(name, value);
        if ($.isArray(params[name])) {
          params[name].push(value);
        } else {
          params[name] = value;
        }
      });
      // Add default value to params not extracted from url;
      return $.extend({}, this.defaultParams, params);
    },

    createURL: function() {
      var that = this,
          url = this.format,  // Use the `format` option as a template.
          params = $.extend({}, this.params);
      // Interpolate the main params.
      $.each(this.mainParamsNames, function(i, name) {
        var value = params[name];
        if (value == null) value = '';
        url = url.replace('{{' + name + '}}',
              $.isArray(value) ? value.join('-') : value);
        delete params[name];
      });
        // Remove the extra params with the default values.
      $.each(params, function(name, value) {
        if (value == that.defaultParams[name]) delete params[name];
      });
      // Serialize the extra params and then interpolate.
      var serializedParams = $.param(params, true);
      if (serializedParams == '') {
        url = url.replace('?{{params}}', '');
      } else {
        url = url.replace('{{params}}', serializedParams);
      }
      return url;
    },

    _getQuery: function() {
      var match = this.location.href.match(/\?.+/);
      return match ? match[0].replace(/#.*/, '') : '';
    },

    _getHash: function(window) {
      var match = this.location.href.match(/#(.*)$/);
      return match ? match[1].replace(/\?.*/, '') : '';
    },

    _getDiff: function(oldParams, newParams) {
      var newParamsKeys = $.map(newParams, function(o, key) { return key; }),
          oldParamsKeys = $.map(oldParams, function(o, key) { return key; }),
          paramsDiff = {};
      $.each($.unique(newParamsKeys.concat(oldParamsKeys)), function(i, key) {
        if(JSON.stringify(newParams[key]) != JSON.stringify(oldParams[key])) {
          paramsDiff[key] = newParams[key];
        }
      })
      return paramsDiff;
    },

    _getMainParamsNames: function() {
      if (this.mainParamsNames == null) {
        var match = this.format.replace(/\?.*/).match(/{{([^}]*)}}/g);
        this.mainParamsNames = $.map(match, function(param) {
          return param.substring(2, param.length-2);
        });
      }
      return this.mainParamsNames;
    }
  };

  return UrlManager;
});
