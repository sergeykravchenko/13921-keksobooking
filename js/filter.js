'use strict';

(function () {
  var filters = document.querySelector('.map__filters');
  var housingType = filters.querySelector('#housing-type');
  var housingPrice = filters.querySelector('#housing-price');
  var housingRooms = filters.querySelector('#housing-rooms');
  var housingGuests = filters.querySelector('#housing-guests');
  var features = filters.querySelectorAll('[name="features"]');

  function filterSelect(filterValue, itemValue) {
    return filterValue === 'any' || filterValue === itemValue.toString();
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

  function filterFeatures(filterArray, itemArray) {
    return filterArray.every(function (item) {
      return itemArray.includes(item);
    });
  }

  function filterPins(advertisements) {
    var featuresArray = [].filter.call(features, function (item) {
      return item.checked;
    }).map(function (item) {
      return item.value;
    });

    return advertisements.filter(function (item) {
      if (!filterSelect(housingType.value, item.offer.type)) {
        return false;
      }
      if (!filterPrice(item.offer.price)) {
        return false;
      }
      if (!filterSelect(housingRooms.value, item.offer.rooms)) {
        return false;
      }
      if (!filterSelect(housingGuests.value, item.offer.guests)) {
        return false;
      }
      if (!filterFeatures(featuresArray, item.offer.features)) {
        return false;
      }
      return true;
    });
  }

  window.filterPins = filterPins;

})();
