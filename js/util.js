'use strict';
(function () {
  window.util = {
    KEY_CODE: {
      ESC: 27,
      ENTER: 13
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

    removeClass: function (el, className) {
      el.classList.remove(className);
    },

    limitArea: function (point, min, max) {
      return Math.max(min, Math.min(point, max));
    }
  };
})();
