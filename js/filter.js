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

  function filterPrice(itemValue) {
    var price = {
      'any': true,
      'middle': itemValue > 10000 && itemValue <= 50000,
      'low': itemValue <= 10000,
      'high': itemValue > 50000
    };

    return price[itemValue] === housingPrice.value;
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
