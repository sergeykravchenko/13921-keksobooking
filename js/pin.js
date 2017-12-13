'use strict';

(function () {
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var map = document.querySelector('.map');
  var mapContainer = map.querySelector('.map__filters-container');
  var activePin;
  var activeDialog;
  var LABEL_WIDTH = 40;
  var LABEL_HEIGHT = 40;
  var adverts = window.data.getRandomAdverts(window.data.ADVERT_NUM);

  function renderPin(advert) {
    var pin = mapPinTemplate.cloneNode(true);
    pin.style.left = (advert.location.x - LABEL_WIDTH / 2) + 'px';
    pin.style.top = (advert.location.y - LABEL_HEIGHT) + 'px';
    pin.querySelector('img').src = advert.author.avatar;
    return pin;
  }

  function closeDialog() {
    if (activeDialog) {
      map.removeChild(activeDialog);
      activeDialog = null;
    }

    deactivatePin();
    document.removeEventListener('keydown', onDialogEscPress);
  }

  function deactivatePin() {

    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  }

  function onDialogEscPress(evt) {
    window.util.onPressedKey(evt, window.util.KEY_CODE.ESC, closeDialog);
  }

  window.pin = {
    activatePin: function (pin) {
      deactivatePin();

      pin.classList.add('map__pin--active');
      activePin = pin;
    },

    renderPins: function () {
      var fragment = document.createDocumentFragment();
      adverts.forEach(function (notice) {
        var pin = renderPin(notice);
        var pinClickHandler = window.pin.openDialog(notice);
        pin.addEventListener('click', pinClickHandler);
        fragment.appendChild(pin);
      });
      return fragment;
    },

    openDialog: function (advert) {
      return function () {
        var dialog = window.card.renderDialog(advert);
        if (activeDialog) {
          map.replaceChild(dialog, activeDialog);
        } else {
          map.insertBefore(dialog, mapContainer);
        }
        activeDialog = dialog;

        var closeButton = dialog.querySelector('.popup__close');
        closeButton.addEventListener('click', closeDialog);
        document.addEventListener('keydown', onDialogEscPress);
      };
    }
  };
})();
