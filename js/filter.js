'use strict';

(function () {
  var filters = document.querySelector('.map__filters');
  var housingType = filters.querySelector('#housing-type');
  var housingPrice = filters.querySelector('#housing-price');
  var housingRooms = filters.querySelector('#housing-rooms');
  var housingGuests = filters.querySelector('#housing-guests');
  var features = filters.querySelectorAll('[name="features"]');

  function filterType(filterValue, itemValue) {
    return filterValue === 'any' || filterValue === itemValue;
  }

  function filterPrice(item) {
    switch (housingPrice.value) {
      case 'any':
        return true;
      case 'middle':
        return (item > 10000) && (item <= 50000);
      case 'low':
        return (item <= 10000);
      case 'high':
        return (item > 50000);
    }
    return item === housingPrice.value;
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

  function filterPins(advertisements) {
    return advertisements.filter(function (item) {
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
