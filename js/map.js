'use strict';

var NOTICES_NUM = 8;
var NOTICE_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var NOTICE_TYPES = [
  'flat',
  'house',
  'bungalo'
];
var NOTICE_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var NOTICE_CHECK_IN_OUT = [
  '12:00',
  '13:00',
  '14:00'
];
var LABEL_WIDTH = 40;
var LABEL_HEIGHT = 40;
var map = document.querySelector('.map');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapPinList = map.querySelector('.map__pins');
var mapContainer = map.querySelector('.map__filters-container');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var notices = [];

var showElement = function (element, className) {
  element.classList.remove(className);
};

var getRandom = function (min, max) {
  return Math.random() * (max - min) + min;
};

var getRandomInteger = function (min, max) {
  return Math.floor(getRandom(min, max));
};

var getRandomFrom = function (array) {
  return array[getRandomInteger(0, array.length)];
};

var getRandomFromOnce = function (array) {
  var arrayCopy = array.slice();
  var rest = [];
  return function () {
    rest = rest.length > 0 ? rest : rest.concat(arrayCopy);
    return rest.splice(getRandomInteger(0, rest.length), 1);
  };
};

var getFeatures = function () {
  var features = [];
  var length = getRandomInteger(1, NOTICE_FEATURES.length);
  var getRandomFeature = getRandomFromOnce(NOTICE_FEATURES);
  for (var i = 0; i < length; i++) {
    features.push(getRandomFeature());
  }
  return features;
};

var getRandomTitle = getRandomFromOnce(NOTICE_TITLES);

for (var i = 0; i < NOTICES_NUM; i++) {
  var locationX = getRandomInteger(300, 900);
  var locationY = getRandomInteger(100, 500);

  notices[i] = {
    'author': {
      'avatar': 'img/avatars/user0' + (i + 1) + '.png'
    },

    'offer': {
      'title': getRandomTitle(),
      'address': locationX + ', ' + locationY,
      'price': getRandomInteger(1000, 1000000),
      'type': getRandomFrom(NOTICE_TYPES),
      'rooms': getRandomInteger(1, 5),
      'guests': getRandomInteger(1, 10), // от балды взял числа для гостей
      'checkin': getRandomFrom(NOTICE_CHECK_IN_OUT),
      'checkout': getRandomFrom(NOTICE_CHECK_IN_OUT),
      'features': getFeatures(),
      'description': '',
      'photos': []
    },

    'location': {
      'x': locationX,
      'y': locationY
    }
  };
}

var getFeaturesList = function (features) {
  var list = '';

  for (var j = 0; j < features.length; j++) {
    list += '<li class="feature feature--' + features[j] + '"></li>';
  }

  return list;
};

showElement(map, 'map--faded');

var renderPins = function (notice) {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style.left = (notice.location.x - LABEL_WIDTH / 2) + 'px';
  pinElement.style.top = (notice.location.y - LABEL_HEIGHT) + 'px';
  pinElement.querySelector('img').src = notice.author.avatar;

  return pinElement;
};

var clearParent = function (el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
};

var renderCards = function (card) {
  var cardElement = mapCardTemplate.cloneNode(true);
  var offerType = '';
  var rubSign = ' \u20bd';
  var featuresList = cardElement.querySelector('.popup__features');
  var featuresItems = getFeaturesList(card.offer.features);

  clearParent(featuresList);

  if (card.offer.type === 'flat') {
    offerType = 'Квартира';
  } else if (card.offer.type === 'bungalo') {
    offerType = 'Бунгало';
  } else if (card.offer.type === 'house') {
    offerType = 'Дом';
  }

  cardElement.querySelector('h3').textContent = card.offer.title;
  cardElement.querySelector('p small').textContent = card.offer.address;
  cardElement.querySelector('.popup__price').textContent = card.offer.price + rubSign + '/ночь';
  cardElement.querySelector('h4').textContent = offerType;
  cardElement.querySelector('h4 + p').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('h4 + p + p').textContent = 'Заезд после' + card.offer.checkin + ' выезд до ' + card.offer.checkout;
  featuresList.insertAdjacentHTML('afterbegin', featuresItems);
  cardElement.querySelector('.popup__features + p').textContent = card.offer.description;
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;

  return cardElement;
};

var fragment = document.createDocumentFragment();
for (var k = 0; k < NOTICES_NUM; k++) {
  fragment.appendChild(renderPins(notices[k]));
}

mapPinList.appendChild(fragment);
map.insertBefore(renderCards(getRandomFrom(notices)), mapContainer);
