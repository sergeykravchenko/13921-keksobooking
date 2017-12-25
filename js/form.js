'use strict';
(function () {
  var MAIN_DEFAULT_AVATAR = 'img/main-pin-image.png';
  var USER_DEFAULT_AVATAR = 'img/muffin.png';
  var OFFER_TYPE = [
    'Квартира',
    'Дом',
    'Бунгало',
    'Дворец'
  ];

  var PRICES_TYPE = [
    1000,
    0,
    5000,
    10000
  ];

  var ADVERT_CHECK_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var CAPACITY_OPTIONS = [
    [2],
    [1, 2],
    [0, 1, 2],
    [3]
  ];
  var noticeForm = document.querySelector('.notice__form');
  var mainPinImage = document.querySelector('.map__pin--main img');
  var userAvatar = noticeForm.querySelector('.notice__preview img');
  var noticeFormBlocks = noticeForm.querySelectorAll('.form__element');
  var formSubmit = noticeForm.querySelector('.form__submit');
  var formReset = noticeForm.querySelector('.form__reset');
  var titleField = noticeForm.querySelector('#title');
  var typeField = noticeForm.querySelector('#type');
  var priceField = noticeForm.querySelector('#price');
  var roomField = noticeForm.querySelector('#room_number');
  var timeInField = noticeForm.querySelector('#timein');
  var timeOutField = noticeForm.querySelector('#timeout');
  var capacityField = noticeForm.querySelector('#capacity');

  [].forEach.call(noticeFormBlocks, function (field) {
    field.setAttribute('disabled', '');
  });

  function onTitleChange() {
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

  function onTitleChangeIE(evt) {
    var target = evt.target;
    if (target.value.length < 30 && target.value.length > 100) {
      target.setCustomValidity('Длина заголовка должна быть не менее 30-ти и не более 100 символов');
    } else {
      target.setCustomValidity('');
    }
  }


  function onPriceChange() {

    if (priceField.validity.rangeUnderflow) {
      priceField.setCustomValidity('Стоимость ниже минимальный цены');
    } else if (priceField.validity.rangeOverflow) {
      priceField.setCustomValidity('Стоимость выше максимальной цены');
    } else {
      priceField.setCustomValidity('');
    }
  }

  function syncValues(element, value) {
    element.value = value;
  }

  function syncValueWithMin(element, value) {
    element.min = value;
  }

  function onTimeInChange() {
    window.synchronizeFields(timeInField.selectedIndex, timeOutField, ADVERT_CHECK_TIMES,
        ADVERT_CHECK_TIMES, syncValues);
  }

  function onTimeOutChange() {
    window.synchronizeFields(timeOutField.selectedIndex, timeInField, ADVERT_CHECK_TIMES,
        ADVERT_CHECK_TIMES, syncValues);
  }

  function onTypePriceSync() {
    window.synchronizeFields(typeField.selectedIndex, priceField, OFFER_TYPE,
        PRICES_TYPE, syncValueWithMin);
  }

  onTypePriceSync();

  function onRoomsCapacityChange() {
    var allowedOption = CAPACITY_OPTIONS[roomField.selectedIndex];
    var defaultOption = allowedOption[0];
    capacityField[defaultOption].selected = true;
    [].forEach.call(capacityField.options, function (option, index) {
      option.hidden = !allowedOption.includes(index);
    });
  }

  onRoomsCapacityChange();

  function checkValidity(el) {
    el.style.borderColor = '';
    el.style.borderWidth = '';

    if (!el.validity.valid) {
      el.style.borderColor = 'red';
      el.style.borderWidth = '2px';
    }
  }

  function onCheckClick() {
    checkValidity(titleField);
    checkValidity(priceField);
  }

  function onResetForm() {
    noticeForm.reset();
    resetUploadPhotos();
    onRoomsCapacityChange();
    onTypePriceSync();
    window.map.addressField.value = window.map.getAddressCoords(window.map.startX, window.map.startY);
    mainPinImage.src = MAIN_DEFAULT_AVATAR;
    userAvatar.src = USER_DEFAULT_AVATAR;
  }

  function resetUploadPhotos() {
    var images = document.querySelectorAll('.form__photo-container img');
    window.util.clearElements(images);
  }

  function onFormSubmit(evt) {
    window.backend.save(new FormData(noticeForm), onResetForm, window.backend.showError);
    evt.preventDefault();
  }

  titleField.addEventListener('change', onTitleChange);
  titleField.addEventListener('change', onTitleChangeIE);
  typeField.addEventListener('change', onTypePriceSync);
  timeInField.addEventListener('change', onTimeInChange);
  timeOutField.addEventListener('change', onTimeOutChange);
  priceField.addEventListener('change', onTypePriceSync);
  priceField.addEventListener('change', onPriceChange);
  roomField.addEventListener('change', onRoomsCapacityChange);
  formSubmit.addEventListener('click', onCheckClick);
  formReset.addEventListener('click', onResetForm);
  noticeForm.addEventListener('submit', onFormSubmit);
})();
