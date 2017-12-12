'use strict';

(function () {
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');


  function renderFeatures(features) {
    var list = document.createDocumentFragment();
    features.forEach(function (feature) {
      var item = document.createElement('li');
      item.classList.add('feature', 'feature--' + feature);
      list.appendChild(item);
    });
    return list;
  }

  window.card = {
    renderDialog: function (advert) {
      var dialog = mapCardTemplate.cloneNode(true);
      var featuresList = dialog.querySelector('.popup__features');
      var featuresItems = renderFeatures(advert.offer.features);
      var offerType;

      window.util.clearParent(featuresList);

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
  };
})();
