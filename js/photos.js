'use strict';

(function () {
  var container = document.querySelector('.form__photo-container');
  var fileChooser = container.querySelector('input[type="file"]');

  var photos = [];

  function addPhoto(reader) {

    var itemImage = document.createElement('img');
    itemImage.src = reader.result;
    itemImage.width = '60';
    itemImage.height = '60';
    itemImage.style.border = '5px solid transparent';

    if (!isSamePhoto(itemImage.src)) {
      return;
    }

    container.appendChild(itemImage);
  }

  function isSamePhoto(src) {
    var images = container.querySelectorAll('img');

    for (var i = 0; i < images.length; i++) {
      if (images[i].src === src) {
        return false;
      }
    }

    return true;

  }

  window.photos = photos;
  window.uploadImage(fileChooser, addPhoto);

})();
