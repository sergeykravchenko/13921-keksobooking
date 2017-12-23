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
    activate: function (pin) {
      window.showCard.deactivatePin();

      pin.classList.add('map__pin--active');
      window.showCard.activePin = pin;
    },

    render: function (adverts, num) {
      var fragment = document.createDocumentFragment();
      adverts.slice(0, num).forEach(function (notice) {
        var pin = renderPin(notice);
        var onPinClick = window.showCard.openDialog(notice);
        pin.addEventListener('click', onPinClick);
        fragment.appendChild(pin);
      });
      return fragment;
    }
  };
})();
