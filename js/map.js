'use strict';

var KEY_CODE = {
  ESC: 27,
  ENTER: 13
};
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
var adverts = getRandomAdverts(ADVERT_NUM);
var activePin;
var activeDialog;

function deactivatePin() {

  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
}

function activatePin(pin) {
  deactivatePin();

  pin.classList.add('map__pin--active');
  activePin = pin;
}

mapPinList.addEventListener('click', function (evt) {
  var target = evt.target;

  while (target !== mapPinList) {
    if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
      activatePin(target);
      openDialog();

      break;
    }

    target = target.parentNode;
  }
});

mapPinList.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEY_CODE.ENTER) {
    var target = evt.target;

    while (target !== mapPinList) {
      if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
        activatePin(target);
        openDialog();

        return;
      }
    }
  }
});

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInteger(min, max) {
  return Math.floor(getRandom(min, max));
}

function getRandomFrom(array) {
  return array[getRandomInteger(0, array.length)];
}

function getRandomSupplierOf(array) {
  var arrayCopy = array.slice();
  var rest = [];
  return function () {
    rest = rest.length > 0 ? rest : rest.concat(arrayCopy);
    return rest.splice(getRandomInteger(0, rest.length), 1);
  };
}

function getFeatures() {
  var length = getRandomInteger(1, ADVERT_FEATURES.length);
  var getRandomFeature = getRandomSupplierOf(ADVERT_FEATURES);
  return Array.from({length: length}, getRandomFeature);
}

function getRandomAdverts() {
  var getRandomTitle = getRandomSupplierOf(ADVERT_TITLES);
  return Array.from({length: ADVERT_NUM}, function (element, index) {
    return {
      'author': {
        'avatar': 'img/avatars/user0' + (index + 1) + '.png'
      },

      'offer': {
        'title': getRandomTitle(),
        'address': getRandomInteger(300, 900) + ', ' + getRandomInteger(100, 500),
        'price': getRandomInteger(1000, 1000000),
        'type': getRandomFrom(ADVERT_TYPES),
        'rooms': getRandomInteger(1, 5),
        'guests': getRandomInteger(1, 10),
        'checkin': getRandomFrom(ADVERT_CHECK_TIMES),
        'checkout': getRandomFrom(ADVERT_CHECK_TIMES),
        'features': getFeatures(),
        'description': '',
        'photos': []
      },

      'location': {
        'x': getRandomInteger(300, 900),
        'y': getRandomInteger(100, 500)
      }
    };
  });
}

function renderFeatures(features) {
  var list = document.createDocumentFragment();
  features.forEach(function (feature) {
    var item = document.createElement('li');
    item.classList.add('feature', 'feature--' + feature);
    list.appendChild(item);
  });
  return list;
}

var clearParent = function (el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
};

function renderPin(advert) {
  var pin = mapPinTemplate.cloneNode(true);
  pin.style.left = (advert.location.x - LABEL_WIDTH / 2) + 'px';
  pin.style.top = (advert.location.y - LABEL_HEIGHT) + 'px';
  pin.querySelector('img').src = advert.author.avatar;
  return pin;
}

function renderPins() {
  var fragment = document.createDocumentFragment();
  adverts.forEach(function (notice) {
    var pin = renderPin(notice);
    var pinClickHandler = openDialog(notice);
    pin.addEventListener('click', pinClickHandler);
    fragment.appendChild(pin);
  });
  return fragment;
}

function renderDialog(advert) {
  var dialog = mapCardTemplate.cloneNode(true);
  var featuresList = dialog.querySelector('.popup__features');
  var featuresItems = renderFeatures(advert.offer.features);
  var offerType;

  clearParent(featuresList);

  if (advert.offer.type === 'flat') {
    offerType = 'Квартира';
  } else if (advert.offer.type === 'bungalo') {
    offerType = 'Бунгало';
  } else if (advert.offer.type === 'house') {
    offerType = 'Дом';
  }

  dialog.querySelector('h3').textContent = advert.offer.title;
  dialog.querySelector('p small').textContent = advert.offer.address;
  dialog.querySelector('.popup__price').textContent = advert.offer.price + ' ₽/ночь';
  dialog.querySelector('h4').textContent = offerType;
  dialog.querySelector('h4 + p').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  dialog.querySelector('h4 + p + p').textContent = 'Заезд после' + advert.offer.checkin + ' выезд до ' + advert.offer.checkout;
  featuresList.appendChild(featuresItems);
  dialog.querySelector('.popup__features + p').textContent = advert.offer.description;
  dialog.querySelector('.popup__avatar').src = advert.author.avatar;

  return dialog;
}

function onDialogEscPress(evt) {
  if (evt.keyCode === KEY_CODE.ESC) {
    closeDialog();
  }
}

function closeDialog() {
  if (activeDialog) {
    map.removeChild(activeDialog);
    activeDialog = null;
  }
  deactivatePin();
  document.removeEventListener('keydown', onDialogEscPress);
}

function openDialog(advert) {
  return function () {
    var dialog = renderDialog(advert);
    if (activeDialog) {
      map.replaceChild(dialog, activeDialog);
    } else {
      map.insertBefore(dialog, mapContainer);
    }
    activeDialog = dialog;

    var closeButton = dialog.querySelector('.popup__close');
    closeButton.addEventListener('click', closeDialog);
    closeButton.addEventListener('keydown', onDialogEscPress);
    document.addEventListener('keydown', onDialogEscPress);
  };
}

function removeClass(el, className) {
  el.classList.remove(className);
}

noticeFormBlocks.forEach(function (field) {
  field.setAttribute('disabled', '');
});

mapPinMain.addEventListener('mouseup', function () {
  removeClass(map, 'map--faded');
  removeClass(noticeForm, 'notice__form--disabled');

  noticeFormBlocks.forEach(function (field) {
    field.removeAttribute('disabled');
  });

  mapPinList.appendChild(renderPins());
});

var formSubmit = noticeForm.querySelector('.form__submit');
var titleField = noticeForm.querySelector('#title');
var addressField = noticeForm.querySelector('#address');
var typeField = noticeForm.querySelector('#type');
var priceField = noticeForm.querySelector('#price');
var capacityField = noticeForm.querySelector('#capacity');
var roomField = noticeForm.querySelector('#room_number');
var timeInField = noticeForm.querySelector('#timein');
var timeOutField = noticeForm.querySelector('#timeout');
var capacityOptions = capacityField.querySelectorAll('option');

function checkTitleField() {
  if (titleField.validity.tooShort) {
    titleField.setCustomValidity('Длина заголовка должна быть не менее 30-ти символов');
  } else if (titleField.validity.tooLong) {
    titleField.setCustomValidity('Длина заголовка не должна превышать 100 символов');
  } else if (titleField.validity.valueMissing) {
    titleField.setCustomValidity('Обязательное поле');
  } else {
    titleField.setCustomValidity('');
  }
}

function checkAddressField() {
  if (addressField.validity.valueMissing) {
    addressField.setCustomValidity('Обязательное поле');
  } else {
    addressField.setCustomValidity('');
  }
}

function checkPriceField() {

  if (priceField.validity.rangeUnderflow) {
    priceField.setCustomValidity('Стоимость ниже минимальный цены');
  } else if (priceField.validity.rangeOverflow) {
    priceField.setCustomValidity('Стоимость выше максимальной цены');
  } else {
    priceField.setCustomValidity('');
  }
}

function syncDataSelect(optionFirst, optionSecond) {
  optionFirst.addEventListener('change', function () {
    optionSecond.selectedIndex = optionFirst.selectedIndex;
  });

  optionSecond.addEventListener('change', function () {
    optionFirst.selectedIndex = optionSecond.selectedIndex;
  });
}

syncDataSelect(timeInField, timeOutField);

function syncTypePrice() {
  switch (typeField.value) {
    case 'bungalo':
      priceField.setAttribute('minlength', '0');
      break;
    case 'flat':
      priceField.setAttribute('minlength', '1000');
      break;
    case 'house':
      priceField.setAttribute('minlength', '5000');
      break;
    case 'palace':
      priceField.setAttribute('minlength', '10000');
      break;
  }
}

syncTypePrice();

function checkRoomsCapacity() {
  capacityOptions.forEach(function (option) {
    option.classList.remove('hidden');
  });

  switch (roomField.value) {
    case '1':
      capacityField.querySelectorAll('option')[0].classList.add('hidden');
      capacityField.querySelectorAll('option')[1].classList.add('hidden');
      capacityField.querySelectorAll('option')[3].classList.add('hidden');
      capacityField.querySelectorAll('option')[2].setAttribute('selected', '');
      break;
    case '2':
      capacityField.querySelectorAll('option')[0].classList.add('hidden');
      capacityField.querySelectorAll('option')[3].classList.add('hidden');
      capacityField.querySelectorAll('option')[1].setAttribute('selected', '');
      break;
    case '3':
      capacityField.querySelectorAll('option')[3].classList.add('hidden');
      capacityField.querySelectorAll('option')[0].setAttribute('selected', '');
      break;
    case '100':
      capacityField.querySelectorAll('option')[0].classList.add('hidden');
      capacityField.querySelectorAll('option')[1].classList.add('hidden');
      capacityField.querySelectorAll('option')[2].classList.add('hidden');
      capacityField.querySelectorAll('option')[3].setAttribute('selected', '');
      break;
  }
}

function checkValidity(el) {
  el.style.borderColor = '';
  el.style.borderWidth = '';

  if (!el.validity.valid) {
    el.style.borderColor = 'red';
    el.style.borderWidth = '2px';
  }
}

function checkOnClick() {
  checkValidity(titleField);
  checkValidity(addressField);
  checkValidity(priceField);
}

titleField.addEventListener('change', checkTitleField);
addressField.addEventListener('invalid', checkAddressField);
typeField.addEventListener('change', syncTypePrice);
priceField.addEventListener('change', checkPriceField);
roomField.addEventListener('change', checkRoomsCapacity);
formSubmit.addEventListener('click', checkOnClick);
