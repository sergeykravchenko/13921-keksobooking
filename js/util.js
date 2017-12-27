'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;

  window.util = {
    KEY_CODE: {
      ESC: 27,
      ENTER: 13
    },

    debounce: function (cb, timeout) {
      var countdown;
      return function () {
        var args = arguments;
        clearTimeout(countdown);
        countdown = setTimeout(function () {
          cb.apply(null, args);
        }, timeout || DEBOUNCE_INTERVAL);
      };
    },

    onPressedKey: function (evt, keycode, action) {
      if (evt.keyCode === keycode) {
        action();
      }
    },

    clearParent: function (el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    },

    clearElements: function (el) {
      [].forEach.call(el, function (item) {
        item.remove();
      });
    },

    removeClass: function (el, className) {
      el.classList.remove(className);
    },

    limitArea: function (point, min, max) {
      return Math.max(min, Math.min(point, max));
    }
  };
})();
