'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
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
var mapPinMain = document.querySelector('.map__pin--main');
var mapPinList = map.querySelector('.map__pins');
var mapContainer = map.querySelector('.map__filters-container');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var noticeForm = document.querySelector('.notice__form');
var noticeFormBlocks = noticeForm.querySelectorAll('.form__element');
var notices = [];
var activePin;

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

  notices[i] = new Notice({
    'avatar': 'img/avatars/user0' + (i + 1) + '.png'
  },

  {
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

  {
    'x': locationX,
    'y': locationY
  });
}

var getFeaturesList = function (features) {
  var list = document.createDocumentFragment();

  for (var j = 0; j < features.length; j++) {
    var item = document.createElement('li');
    item.classList.add('feature', 'feature--' + features[j]);

    list.appendChild(item);
  }

  return list;
};

var clearParent = function (el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
};

var getPins = function () {
  var fragment = document.createDocumentFragment();
  notices.forEach(function (notice) {
    fragment.appendChild(notice.renderPin());
  });

  return fragment;
};

map.insertBefore(getRandomFrom(notices).renderCard(), mapContainer);

function Notice(author, offer, location) {
  this.author = author;
  this.offer = offer;
  this.location = location;
  this.renderPin = function () {
    var pinElement = mapPinTemplate.cloneNode(true);

    pinElement.style.left = (this.location.x - LABEL_WIDTH / 2) + 'px';
    pinElement.style.top = (this.location.y - LABEL_HEIGHT) + 'px';
    pinElement.querySelector('img').src = this.author.avatar;

    return pinElement;
  };
  this.renderCard = function () {
    var cardElement = mapCardTemplate.cloneNode(true);
    var offerType = '';
    var rubSign = ' \u20bd';
    var featuresList = cardElement.querySelector('.popup__features');
    var featuresItems = getFeaturesList(this.offer.features);

    clearParent(featuresList);

    if (this.offer.type === 'flat') {
      offerType = 'Квартира';
    } else if (this.offer.type === 'bungalo') {
      offerType = 'Бунгало';
    } else if (this.offer.type === 'house') {
      offerType = 'Дом';
    }

    cardElement.querySelector('h3').textContent = this.offer.title;
    cardElement.querySelector('p small').textContent = this.offer.address;
    cardElement.querySelector('.popup__price').textContent = this.offer.price + rubSign + '/ночь';
    cardElement.querySelector('h4').textContent = offerType;
    cardElement.querySelector('h4 + p').textContent = this.offer.rooms + ' комнаты для ' + this.offer.guests + ' гостей';
    cardElement.querySelector('h4 + p + p').textContent = 'Заезд после' + this.offer.checkin + ' выезд до ' + this.offer.checkout;
    featuresList.appendChild(featuresItems);
    cardElement.querySelector('.popup__features + p').textContent = this.offer.description;
    cardElement.querySelector('.popup__avatar').src = this.author.avatar;

    return cardElement;
  };
}

var mapCard = map.querySelector('.popup');
var mapCardClose = mapCard.querySelector('.popup__close');
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');

var syncDataSelect = function (optionFirst, optionSecond) {
  optionFirst.addEventListener('change', function () {
    optionSecond.selectedIndex = optionFirst.selectedIndex;
  });
};

syncDataSelect(timeIn, timeOut);

var type = document.querySelector('#type');
var price = document.querySelector('#price');

var syncTypePrice = function () {
  var x = type.value;
  switch (x) {
    case 'bungalo':
      price.setAttribute('minlength', '0');
      break;
    case 'flat':
      price.setAttribute('minlength', '1000');
      break;
    case 'house':
      price.setAttribute('minlength', '5000');
      break;
    case 'palace':
      price.setAttribute('minlength', '10000');
      break;
  }
};

type.addEventListener('change', syncTypePrice);

var removeClass = function (element, className) {
  element.classList.remove(className);
};

var addClass = function (element, className) {
  element.classList.add(className);
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  mapCard.classList.add('hidden');
  deactivatePin();
  document.removeEventListener('keydown', onPopupEscPress);
};

var openPopup = function () {
  mapCard.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

(function () {
  addClass(mapCard, 'hidden');

  for (var j = 0; j < noticeFormBlocks.length; j++) {
    noticeFormBlocks[j].setAttribute('disabled', '');
  }
})();

mapPinMain.addEventListener('mouseup', function () {
  removeClass(map, 'map--faded');
  removeClass(noticeForm, 'notice__form--disabled');

  for (var j = 0; j < noticeFormBlocks.length; j++) {
    noticeFormBlocks[j].removeAttribute('disabled');
  }

  mapPinList.appendChild(getPins());
});

var deactivatePin = function () {

  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

var activatePin = function (pin) {
  deactivatePin();

  pin.classList.add('map__pin--active');
  activePin = pin;
};

mapPinList.addEventListener('click', function (evt) {
  var target = evt.target;

  while (target !== mapPinList) {
    if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
      activatePin(target);
      openPopup();

      break;
    }

    target = target.parentNode;
  }
});

mapPinList.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    var target = evt.target;

    while (target !== mapPinList) {
      if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
        activatePin(target);
        openPopup();

        return;
      }
    }
  }
});

mapCardClose.addEventListener('click', closePopup);
mapCardClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});
