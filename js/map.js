'use strict';

(function () {
  var PINS_NUM = 5;
  var PIN_HEIGHT = 65;
  var PIN_TAIL = 22;
  var DRAG_AREA_Y = {
    min: 100 - (PIN_HEIGHT / 2 + PIN_TAIL),
    max: 500 - (PIN_HEIGHT / 2 + PIN_TAIL)
  };
  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinList = map.querySelector('.map__pins');
  var filters = document.querySelector('.map__filters');
  var noticeForm = document.querySelector('.notice__form');
  var addressField = noticeForm.querySelector('#address');
  var noticeFormBlocks = noticeForm.querySelectorAll('.form__element');
  var coordX = parseInt(getComputedStyle(mapPinMain).getPropertyValue('left'), 10);
  var coordY = parseInt(getComputedStyle(mapPinMain).getPropertyValue('top'), 10);
  var advertisements = [];
  var debouncedFilter = window.util.debounce(updatePinsOnFilter);

  mapPinMain.addEventListener('mousedown', dragAndDrop);

  function getAddressCoords() {
    var addressCoordX = Math.round(coordX);
    var addressCoordY = Math.round(coordY + (PIN_HEIGHT / 2 + PIN_TAIL));
    return 'x: ' + addressCoordX + ', y: ' + addressCoordY;
  }

  function onSuccess(data) {
    advertisements = data;
    mapPinList.appendChild(window.pin.render(data, PINS_NUM));
  }

  filters.addEventListener('change', function () {
    debouncedFilter();
  });

  function updatePinsOnFilter() {
    window.showCard.closeDialog();
    clearPins();
    var dataCopy = advertisements.slice();
    var filteredPins = window.filterPins(dataCopy);
    mapPinList.appendChild(window.pin.render(filteredPins, PINS_NUM));
  }

  function clearPins() {
    var pins = mapPinList.querySelectorAll('.map__pin:not(.map__pin--main)');
    window.util.clearElements(pins);
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

      coordX = window.util.limitArea(mapPinMain.offsetLeft - shift.x, 0, map.clientWidth);
      coordY = window.util.limitArea(mapPinMain.offsetTop - shift.y, DRAG_AREA_Y.min, DRAG_AREA_Y.max);

      mapPinMain.style.left = coordX + 'px';
      mapPinMain.style.top = coordY + 'px';
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      window.util.removeClass(map, 'map--faded');
      window.util.removeClass(noticeForm, 'notice__form--disabled');
      addressField.value = getAddressCoords(coordX, coordY);

      [].forEach.call(noticeFormBlocks, function (field) {
        field.removeAttribute('disabled');
      });

      window.backend.load(onSuccess, window.backend.showError);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  window.map = {
    addressField: addressField,
    getAddressCoords: getAddressCoords
  };
})();
