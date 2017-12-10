'use strict';

(function () {
  var KEY_CODE = {
    ESC: 27,
    ENTER: 13
  };

  window.util = {
    pressedEsc: function (evt, action) {
      if (evt.keyCode === KEY_CODE.ESC) {
        action();
      }
    },
    pressedEnter: function (evt, action) {
      if (evt.keyCode === KEY_CODE.ENTER) {
        action();
      }
    },
    getRandom: function (min, max) {
      return Math.random() * (max - min) + min;
    },

    getRandomInteger: function (min, max) {
      return Math.floor(window.util.getRandom(min, max));
    },

    getRandomFrom: function (array) {
      return array[window.util.getRandomInteger(0, array.length)];
    },

    getRandomSupplierOf: function (array) {
      var arrayCopy = array.slice();
      var rest = [];
      return function () {
        rest = rest.length > 0 ? rest : rest.concat(arrayCopy);
        return rest.splice(window.util.getRandomInteger(0, rest.length), 1);
      };
    },

    clearParent: function (el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    },

    removeClass: function (el, className) {
      el.classList.remove(className);
    }
  };
})();
