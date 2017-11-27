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
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var notices = [];
var avatarId = [];

var showElement = function (element, className) {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
};

var getRandom = function (min, max) {
  return Math.random() * (max - min) + min;
};

var getRandomInteger = function (min, max) {
  return Math.floor(getRandom(min, max));
};

var getRandomFrom = function (array) {
  return array[getRandomInteger(0.1, 0.9) * array.length];
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
  var features = NOTICE_FEATURES.slice();
  var newFeatures = [];
  var newFeaturesLength = getRandomFrom(features);

  for (var i = 0; i < newFeaturesLength; i++) {
  }
};

var locationX = getRandomInteger(300, 900);
var locationY = getRandomInteger(100, 500);

// var createAvatarsArray = function () {
//   for (var i = 0; i < NOTICES_NUM; i++) {
//     avatars[i] = i + 1;
//   }
//
//   return avatars;
// };

for (var i = 0; i < NOTICES_NUM; i++) {
  avatarId[i] = i + 1;

  notices[i] = {
    'author': {
      'avatar': 'img/avatars/user0' + avatarId[i] + '.png'
    },

    'offer': {
      'title': getRandomFromOnce(NOTICE_TITLES),
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

showElement(map, 'map--faded');

var renderPins = function (notice) {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style.left = (notice.location.x - LABEL_WIDTH / 2) + 'px';
  pinElement.style.top = (notice.location.y - LABEL_HEIGHT) + 'px';
  pinElement.querySelector('img').src = notice.author.avatar;

  return pinElement;
};

var renderCards = function (card) {
  var cardElement = mapCardTemplate.cloneNode(true);
  var offerType = '';
  var rubSign = '&#x20bd';

  if (card.offer.type === 'flat') {
    offerType = 'Квартира';
  } else if (card.offer.type === 'bungalo') {
    offerType = 'Бунгало';
  } else if (card.offer.type === 'house') {
    offerType = 'Дом';
  }

  cardElement.querySelector('h3').textContent = card.offer.title;
  cardElement.querySelector('p small').textContent = card.offer.address;
  cardElement.querySelector('.popup__price').innerHtml = card.offer.price + rubSign + '/ночь';
  cardElement.querySelector('h4').textContent = offerType;
  cardElement.querySelector('h4 + p').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('h4 + p + p').textContent = 'Заезд после' + card.offer.checkin + ' выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__features').textContent = '';
  cardElement.querySelector('.popup__features + p').textContent = card.offer.description;
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;

  return cardElement;
};

var fragment = document.createDocumentFragment();
for (var j = 0; j < NOTICES_NUM; j++) {
  fragment.appendChild(renderPins(notices[j]));
  mapPinList.appendChild(fragment);
  map.appendChild(renderCards(notices[j]));
}
