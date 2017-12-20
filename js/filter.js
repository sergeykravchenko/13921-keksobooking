'use strict';

(function () {
  var filters = document.querySelector('.map__filters');
  var housingType = filters.querySelector('#housing-type');
  var housingPrice = filters.querySelector('#housing-price');
  var housingRooms = filters.querySelector('#housing-room-number');
  var housingGuests = filters.querySelector('#housing-guests-number');
  var features = filters.querySelectorAll('[name="feature"]');

  function filterType(filterValue, itemValue) {
    return filterValue === 'any' || filterValue === itemValue;
  }

  function filterPrice(item) {
    switch (housingPrice) {
      case 'any':
        return true;
      case 'middle':
        return (item.value > 10000) && (item <= 50000);
      case 'low':
        return (item.value <= 10000);
      case 'high':
        return (item.value > 50000);
    }
    return item === housingPrice;
  }

  function filterNum(filterValue, itemValue) {
    return filterValue === 'any' || filterValue === parseInt(itemValue, 10);
  }

  function filterCheckbox(nodelist) {
    [].filter.call(nodelist, function (item) {
      return item.checked;
    }).map(function (item) {
      return item.value;
    });
  }

  function filterPins(data) {
    return data.filter(function (item) {
      if (!filterType(housingType.value, item.offer.type)) {
        return false;
      }
      if (!filterPrice(item.offer.price)) {
        return false;
      }
      if (!filterNum(housingRooms.value, item.offer.rooms)) {
        return false;
      }
      if (!filterNum(housingGuests.value, item.offer.guests)) {
        return false;
      }
      if (!filterCheckbox(features)) {
        return false;
      }
      return true;
    });
  }

  window.filterPins = filterPins;

})();
