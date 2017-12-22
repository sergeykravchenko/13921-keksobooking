'use strict';

(function () {
  var PINS_NUM = 5;
  var DRAG_AREA_Y = {
    min: 100,
    max: 500
  };
  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinList = map.querySelector('.map__pins');
  var filters = document.querySelector('.map__filters');
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormBlocks = noticeForm.querySelectorAll('.form__element');
  var coordX;
  var coordY;
  var advertisements = [];

  mapPinMain.addEventListener('mousedown', dragAndDrop);

  function successHandler(data) {
    advertisements = data;
    mapPinList.appendChild(window.pin.renderPins(data, PINS_NUM));
  }

  filters.addEventListener('change', function () {
    window.debounce(function () {
      updatePinsOnFilter();
    });
  });

  function updatePinsOnFilter() {
    window.showCard.closeDialog();
    clearPins();
    var dataCopy = advertisements.slice();
    var filteredPins = window.filterPins(dataCopy);
    mapPinList.appendChild(window.pin.renderPins(filteredPins, PINS_NUM));
  }

  function clearPins() {
    var pins = mapPinList.querySelectorAll('.map__pin:not(.map__pin--main)');
    [].forEach.call(pins, function (item) {
      item.remove();
    });
  }

  function dragAndDrop(evt) {
    evt.preventDefault();
    mapPinMain.style.zIndex = 99;

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
      coordY = window.util.bounded(mapPinMain.offsetTop - shift.y, DRAG_AREA_Y.min, DRAG_AREA_Y.max);

      mapPinMain.style.left = coordX + 'px';
      mapPinMain.style.top = coordY + 'px';

      window.debounce(function () {
        window.form.addressField.value = 'x: ' + coordX + ', y: ' + coordY;
      });
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      window.util.removeClass(map, 'map--faded');
      window.util.removeClass(noticeForm, 'notice__form--disabled');

      [].forEach.call(noticeFormBlocks, function (field) {
        field.removeAttribute('disabled');
      });

      window.backend.load(successHandler, window.backend.showError);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
})();
