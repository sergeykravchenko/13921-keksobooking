'use strict';
(function () {
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormBlocks = noticeForm.querySelectorAll('.form__element');
  var formSubmit = noticeForm.querySelector('.form__submit');
  var titleField = noticeForm.querySelector('#title');
  var typeField = noticeForm.querySelector('#type');
  var priceField = noticeForm.querySelector('#price');
  var roomField = noticeForm.querySelector('#room_number');
  var timeInField = noticeForm.querySelector('#timein');
  var timeOutField = noticeForm.querySelector('#timeout');
  var capacityField = noticeForm.querySelector('#capacity');
  var capacityOptions = [
    {
      allowed: [2],
      default: 2
    },
    {
      allowed: [1, 2],
      default: 1
    },
    {
      allowed: [0, 1, 2],
      default: 0
    },
    {
      allowed: [3],
      default: 3
    }
  ];

  [].forEach.call(noticeFormBlocks, function (field) {
    field.setAttribute('disabled', '');
  });

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
        priceField.setAttribute('min', '0');
        break;
      case 'flat':
        priceField.setAttribute('min', '1000');
        break;
      case 'house':
        priceField.setAttribute('min', '5000');
        break;
      case 'palace':
        priceField.setAttribute('min', '10000');
        break;
    }
  }

  syncTypePrice();

  function checkRoomsCapacity() {
    var roomOptions = capacityOptions[roomField.selectedIndex];
    [].forEach.call(capacityField.options, function (option) {
      option.hidden = true;
    });
    roomOptions.allowed.forEach(function (option) {
      capacityField.options[option].hidden = false;
    });
    capacityField[roomOptions.default].selected = true;
  }

  checkRoomsCapacity();

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
    checkValidity(priceField);
  }

  titleField.addEventListener('change', checkTitleField);
  typeField.addEventListener('change', syncTypePrice);
  priceField.addEventListener('change', checkPriceField);
  roomField.addEventListener('change', checkRoomsCapacity);
  formSubmit.addEventListener('click', checkOnClick);

  window.form = {
    addressField: noticeForm.querySelector('#address')
  };
})();
