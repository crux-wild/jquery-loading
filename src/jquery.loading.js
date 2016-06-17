// Uses CommonJS, AMD or browser globals to create a jQuery plugin.
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'jqueryrotate', 'jquery-html5data'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function( root, jQuery ) {
      if ( jQuery === undefined ) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if ( typeof window !== 'undefined' ) {
          jQuery = require('jquery');
        }
        else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  /**
   * @requires jqueryrotate
   * @see http://jqueryrotate.com
   *
   * @requires jquery-html5data
   * @see http://markdalgleish.com/projects/jquery-html5data
   */
  var pluginName = 'loading';

  var defaults = {
    /**
     * @property {Number} angle
     * loading rotate angle
     */
    angle: 15,
    /**
     * @property {Number} interval
     * loading rotate interval
     */
    interval: 50,
    /**
     * @property {Number} tips
     * loading tip text
     */
    tips: 'loading...',
    /**
     * @property {String} icon
     * loading ico font class
     */
    icon: 'fa fa-refresh',
    /**
     * @property {String} loading
     * trigger loading event
     */
    loading: 'off'
  };

  /**
   * @constructor
   * make a loading plugin instance
   */
  var Plugin = function PluginF(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  };

  /**
   * @function
   * parse document,automatic initialization container element
   */
  var parseDocument = function ParseDocumentF() {
    var $loadingContainer = $('[role~="loading-container"]');

    $loadingContainer.loading();
  };

  $.extend(Plugin.prototype, {
    /**
     * @method
     * change container element status to [loading]
     */
    reset: function resetF() {
      var $element = $(this.element);

      var loadingStatus = $element.attr('aria-loading-status');

      var instance = this;

      // status check [normal >> loading]
      if (loadingStatus !== 'loading') { return false; }

      instance
        .changeToPrevText()
          .stopLoadingAnimate()
            .hideLoading();

      $element
        .trigger('loading.reset')
          .attr('aria-loading-status', 'normal');
      return this;
    },
    /**
     * @method
     * change container element status to [normal]
     */
    loading: function loadingF() {
      var $element = $(this.element);

      var loadingStatus = $element.attr('aria-loading-status');

      var instance = this;

      // status check [normal >> loading]
      if (loadingStatus !== 'normal') { return false; }

      instance
        .changeToLoadingText()
          .startLoadingAnimate()
            .showLoading();

      $element
        .trigger('loading.loading')
          .attr('aria-loading-status', 'loading');
      return this;
    },
    /**
     * @method
     * initialization container element
     */
    init: function initF() {
      var instance = this;

      instance
        .preContainer()
          .addLoading()
            .bindEvent();
      return this;
    },
    preContainer: function preContainerF() {
      var $element = $(this.element);

      var prevText = $element.text();

      // empty container element
      $element
        .attr('aria-loading-status', 'normal')
          .text('');

      $('<span>')
        .attr('role', 'loading-text')
          .attr('aria-loading-text-status', 'prev')
            .text(prevText)
      .appendTo($element);
      return this;
    },
    /**
     * @method
     * append spinner element to container
     */
    addLoading: function addLoadingF() {
      var $element = $(this.element);

      $('<span>')
        .addClass(this.options.icon)
          .attr('role', 'loading')
            .attr('aria-hidden', 'true')
              .hide()
      .appendTo($element);
      return this;
    },
    /**
     * @method
     * bind spinner default interaction logic
     */
    bindEvent: function bindEventF() {
      var $element = $(this.element);

      var loading = this.options.loading;

      if (loading !== 'off') {
        $element.on(loading, function loading() {
          $element.loading('loading');
        });
      }
    },
    /**
     * @method
     * change container element to loading text
     */
    changeToLoadingText: function changeToLoadingTextF() {
      var $element = $(this.element);

      var prevText = $element.text();

      var tips = this.options.tips || '';

      $element
        .find('[role~="loading-text"]')
          .text(tips)
            .attr('aria-loading-text-status', 'loading')
      .appendTo($element)

      this.prevText = prevText;
      return this;
    },
    /**
     * @method
     * reset container element text
     */
    changeToPrevText: function changeToLoadingTextF() {
      var $element = $(this.element);

      $element
        .find('[role~="loading-text"]')
          .text(this.prevText)
            .attr('aria-loading-text-status', 'prev')
      return this;
    },
    /**
     * @method
     * show spinner element
     */
    showLoading: function showF() {
      var $element = $(this.element);

      $element
        .find('[role~="loading"]')
          .attr('aria-hidden', 'false')
            .show();
      return this;
    },
    /**
     * @method
     * start spinner animate
     */
    startLoadingAnimate: function runLoadingF() {
      var $element = $(this.element);

      var $loading = $element.find('[role~="loading"]');

      var interval = parseInt(this.options.interval, 10);

      var changeAngle = parseInt(this.options.angle, 10);

      var angle = this.angle || 0;

      var setIntervalId;

      setIntervalId = setInterval(function rotate() {
        angle = angle + changeAngle;
        $loading.rotate(angle);
      }, interval);
      this.setIntervalId = setIntervalId;
      return this;
    },
    stopLoadingAnimate: function runLoadingF() {
      var $element = $(this.element);

      var $loading = $element.find('[role~="loading"]');

      clearInterval(this.setIntervalId);
      this.angle = 0;
      return this;
    },
    /**
     * @method
     * hide spinner element
     */
    hideLoading: function hideF() {
      var $element = $(this.element);

      $element
        .find('[role~="loading"]')
          .attr('aria-hidden', 'true')
            .hide();
      return this;
    }
  });

  $.extend(jQuery.fn, {
    loading: function loading(options) {
      var $elements = this;

      $elements.each(function() {
        var $element = $(this);

        var inlineOptions;

        var instance;

        // if element don't initialization
        if (!$.data(this, 'plugin_' + pluginName)) {
          /**
           * options priority
           * [ inline > element > global ]
           */
          inlineOptions = $element.html5data(pluginName);
          options = $.extend({}, options, inlineOptions);

          instance = new Plugin(this, options);
          $.data(this, 'plugin_' + pluginName, instance)
        }
        // element initialization complete
        else {
          instance = $.data(this, 'plugin_' + pluginName);

          // calling instance public method
          if (options === 'reset') { instance.reset(); }
          if (options === 'loading') { instance.loading(); }
        }
      });
      return $elements;
    }
  });

  $.extend(jQuery, {
    /**
     * @static
     * modify the global configuration
     */
    loading: function loadingF(options) {
      defaults = $.extend(defaults, options);
      return jQuery;
    }
  });

  // parse document, automatic initialization
  parseDocument();
}));
