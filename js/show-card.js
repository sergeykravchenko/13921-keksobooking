'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinList = map.querySelector('.map__pins');
  var mapContainer = map.querySelector('.map__filters-container');
  var activeDialog;
  var activePin;

  function delegatePin(target) {
    while (target !== mapPinList) {
      if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
        window.pin.activate(target);
        window.showCard.openDialog();

        break;
      }
      target = target.parentNode;
    }
  }

  mapPinList.addEventListener('click', function (evt) {
    var target = evt.target;
    delegatePin(target);
  });

  mapPinList.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.KEY_CODE.ENTER) {
      var target = evt.target;
      delegatePin(target);
    }
  });

  window.showCard = {
    onDialogEscPress: function (evt) {
      window.util.onPressedKey(evt, window.util.KEY_CODE.ESC, window.showCard.closeDialog);
    },

    activePin: activePin,

    deactivatePin: function () {

      if (window.showCard.activePin) {
        window.showCard.activePin.classList.remove('map__pin--active');
      }
    },

    openDialog: function (advert) {
      return function () {
        var dialog = window.card.render(advert);
        if (activeDialog) {
          map.replaceChild(dialog, activeDialog);
        } else {
          map.insertBefore(dialog, mapContainer);
        }
        activeDialog = dialog;

        var closeButton = dialog.querySelector('.popup__close');
        closeButton.addEventListener('click', window.showCard.closeDialog);
        document.addEventListener('keydown', window.showCard.onDialogEscPress);
      };
    },

    closeDialog: function () {
      if (activeDialog) {
        map.removeChild(activeDialog);
        activeDialog = null;
      }

      window.showCard.deactivatePin();
      document.removeEventListener('keydown', window.showCard.onDialogEscPress);
    }
  };
})();
