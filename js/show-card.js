'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinList = map.querySelector('.map__pins');
  var mapContainer = map.querySelector('.map__filters-container');
  var activeDialog;
  var activePin;

  function closeDialog() {
    if (activeDialog) {
      map.removeChild(activeDialog);
      activeDialog = null;
    }

    window.showCard.deactivatePin();
    document.removeEventListener('keydown', window.showCard.onDialogEscPress);
  }

  mapPinList.addEventListener('click', function (evt) {
    var target = evt.target;

    while (target !== mapPinList) {
      if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
        window.pin.activatePin(target);
        window.showCard.openDialog();

        break;
      }

      target = target.parentNode;
    }
  });

  mapPinList.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.KEY_CODE.ENTER) {
      var target = evt.target;

      while (target !== mapPinList) {
        if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
          window.pin.activatePin(target);
          window.showCard.openDialog();

          return;
        }
      }
    }
  });

  window.showCard = {
    onDialogEscPress: function (evt) {
      window.util.onPressedKey(evt, window.util.KEY_CODE.ESC, closeDialog);
    },

    activePin: activePin,

    deactivatePin: function () {

      if (window.showCard.activePin) {
        window.showCard.activePin.classList.remove('map__pin--active');
      }
    },

    openDialog: function (advert) {
      return function () {
        var dialog = window.card.renderCard(advert);
        if (activeDialog) {
          map.replaceChild(dialog, activeDialog);
        } else {
          map.insertBefore(dialog, mapContainer);
        }
        activeDialog = dialog;

        var closeButton = dialog.querySelector('.popup__close');
        closeButton.addEventListener('click', closeDialog);
        document.addEventListener('keydown', window.showCard.onDialogEscPress);
      };
    }
  };
})();
