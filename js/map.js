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

      coordX = window.util.bounded(mapPinMain.offsetLeft - shift.x, 0, map.clientWidth);
      coordY = window.util.bounded(mapPinMain.offsetTop - shift.y, dragAreaY.min, dragAreaY.max);

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

      window.backend.load(successHandler, window.backend.showError);

      function successHandler(data) {
        mapPinList.appendChild(window.pin.renderPins(data));
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
})();
