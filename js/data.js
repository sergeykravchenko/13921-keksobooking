'use strict';

(function () {
  var ADVERT_NUM = 8;
  var ADVERT_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var ADVERT_TYPES = [
    'flat',
    'house',
    'bungalo'
  ];
  var ADVERT_FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  var ADVERT_CHECK_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  function getFeatures() {
    var length = window.util.getRandomInteger(1, ADVERT_FEATURES.length);
    var getRandomFeature = window.util.getRandomSupplierOf(ADVERT_FEATURES);
    return Array.from({length: length}, getRandomFeature);
  }

  window.data = {
    getRandomAdverts: function () {
      var getRandomTitle = window.util.getRandomSupplierOf(ADVERT_TITLES);
      return Array.from({length: ADVERT_NUM}, function (element, index) {
        return {
          'author': {
            'avatar': 'img/avatars/user0' + (index + 1) + '.png'
          },

          'offer': {
            'title': getRandomTitle(),
            'address': window.util.getRandomInteger(300, 900) + ', ' + window.util.getRandomInteger(100, 500),
            'price': window.util.getRandomInteger(1000, 1000000),
            'type': window.util.getRandomFrom(ADVERT_TYPES),
            'rooms': window.util.getRandomInteger(1, 5),
            'guests': window.util.getRandomInteger(1, 10),
            'checkin': window.util.getRandomFrom(ADVERT_CHECK_TIMES),
            'checkout': window.util.getRandomFrom(ADVERT_CHECK_TIMES),
            'features': getFeatures(),
            'description': '',
            'photos': []
          },

          'location': {
            'x': window.util.getRandomInteger(300, 900),
            'y': window.util.getRandomInteger(100, 500)
          }
        };
      });
    }
  };
})();
