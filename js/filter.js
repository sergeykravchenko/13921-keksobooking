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

  function filterPrice(filterValue, itemValue) {
    var price = {
      'any': true,
      'middle': itemValue > 10000 && itemValue <= 50000,
      'low': itemValue <= 10000,
      'high': itemValue > 50000
    };

    return price[filterValue] || false;

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
      return filterSelect(housingType.value, item.offer.type)
        && filterPrice(housingPrice.value, item.offer.price)
        && filterSelect(housingRooms.value, item.offer.rooms)
        && filterSelect(housingGuests.value, item.offer.guests)
        && filterFeatures(featuresArray, item.offer.features);
    });
  }

  window.filterPins = filterPins;

})();
