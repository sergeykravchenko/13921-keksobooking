'use strict';

(function () {
  var LABEL_WIDTH = 40;
  var LABEL_HEIGHT = 40;
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  function renderPin(advert) {
    var pin = mapPinTemplate.cloneNode(true);
    pin.style.left = (advert.location.x - LABEL_WIDTH / 2) + 'px';
    pin.style.top = (advert.location.y - LABEL_HEIGHT) + 'px';
    pin.querySelector('img').src = advert.author.avatar;
    return pin;
  }

  window.pin = {
    activatePin: function (pin) {
      window.showCard.deactivatePin();

      pin.classList.add('map__pin--active');
      window.showCard.activePin = pin;
    },

    renderPins: function (adverts) {
      var fragment = document.createDocumentFragment();
      adverts.forEach(function (notice) {
        var pin = renderPin(notice);
        var pinClickHandler = window.showCard.openDialog(notice);
        pin.addEventListener('click', pinClickHandler);
        fragment.appendChild(pin);
      });
      return fragment;
    }
  };
})();
