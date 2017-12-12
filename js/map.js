'use strict';

(function () {
  var mapPinMain = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var mapPinList = map.querySelector('.map__pins');
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormBlocks = noticeForm.querySelectorAll('.form__element');

  mapPinMain.addEventListener('mouseup', function () {
    window.util.removeClass(map, 'map--faded');
    window.util.removeClass(noticeForm, 'notice__form--disabled');

    [].forEach.call(noticeFormBlocks, function (field) {
      field.removeAttribute('disabled');
    });

    mapPinList.appendChild(window.pin.renderPins());
  });

  mapPinList.addEventListener('click', function (evt) {
    var target = evt.target;

    while (target !== mapPinList) {
      if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
        window.pin.activatePin(target);
        window.pin.openDialog();

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
          window.pin.openDialog();

          return;
        }
      }
    }
  });
})();
