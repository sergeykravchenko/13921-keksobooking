'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinList = map.querySelector('.map__pins');
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormBlocks = noticeForm.querySelectorAll('.form__element');
  var coordX;
  var coordY;
  var dragAreaY = {
    min: 100,
    max: 500
  };

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

  mapPinMain.addEventListener('mousedown', dragAndDrop);

  function dragAndDrop(evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      coordX = mapPinMain.offsetLeft - shift.x;
      coordY = mapPinMain.offsetTop - shift.y;

      if (coordY < dragAreaY.min) {
        coordY = dragAreaY.min;
      } else if (coordY > dragAreaY.max) {
        coordY = dragAreaY.max;
      }

      if (coordX < 0) {
        coordX = 0;
      } else if (coordX > map.clientWidth) {
        coordX = map.clientWidth;
      }

      mapPinMain.style.left = coordX + 'px';
      mapPinMain.style.top = coordY + 'px';

      window.form.addressField.value = 'x: ' + coordX + ', y: ' + coordY;
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      window.util.removeClass(map, 'map--faded');
      window.util.removeClass(noticeForm, 'notice__form--disabled');

      [].forEach.call(noticeFormBlocks, function (field) {
        field.removeAttribute('disabled');
      });

      mapPinList.appendChild(window.pin.renderPins());

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
})();
