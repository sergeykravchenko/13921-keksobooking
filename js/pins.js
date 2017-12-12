'use strict';

(function () {
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinMain = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var mapContainer = map.querySelector('.map__filters-container');
  var mapPinList = map.querySelector('.map__pins');
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormBlocks = noticeForm.querySelectorAll('.form__element');
  var activePin;
  var activeDialog;
  var LABEL_WIDTH = 40;
  var LABEL_HEIGHT = 40;

  var adverts = window.data.getRandomAdverts(window.data.ADVERT_NUM);

  function deactivatePin() {

    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  }

  function activatePin(pin) {
    deactivatePin();

    pin.classList.add('map__pin--active');
    activePin = pin;
  }

  function onDialogEscPress(evt) {
    window.util.onPressedKey(evt, window.util.KEY_CODE.ESC, closeDialog);
  }

  function closeDialog() {
    if (activeDialog) {
      map.removeChild(activeDialog);
      activeDialog = null;
    }
    deactivatePin();
    document.removeEventListener('keydown', onDialogEscPress);
  }

  function openDialog(advert) {
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

  mapPinList.addEventListener('click', function (evt) {
    var target = evt.target;

    while (target !== mapPinList) {
      if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
        activatePin(target);
        openDialog();

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
          activatePin(target);
          openDialog();

          return;
        }
      }
    }
  });

  function renderPin(advert) {
    var pin = mapPinTemplate.cloneNode(true);
    pin.style.left = (advert.location.x - LABEL_WIDTH / 2) + 'px';
    pin.style.top = (advert.location.y - LABEL_HEIGHT) + 'px';
    pin.querySelector('img').src = advert.author.avatar;
    return pin;
  }

  function renderPins() {
    var fragment = document.createDocumentFragment();
    adverts.forEach(function (notice) {
      var pin = renderPin(notice);
      var pinClickHandler = openDialog(notice);
      pin.addEventListener('click', pinClickHandler);
      fragment.appendChild(pin);
    });
    return fragment;
  }


  [].forEach.call(noticeFormBlocks, function (field) {
    field.setAttribute('disabled', '');
  });

  mapPinMain.addEventListener('mouseup', function () {
    window.util.removeClass(map, 'map--faded');
    window.util.removeClass(noticeForm, 'notice__form--disabled');

    [].forEach.call(noticeFormBlocks, function (field) {
      field.removeAttribute('disabled');
    });

    mapPinList.appendChild(renderPins());
  });
})();
