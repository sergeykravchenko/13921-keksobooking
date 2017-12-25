'use strict';

(function () {

  var fileChooser = document.querySelector('.notice__photo input[type="file"]');
  var preview = document.querySelector('.notice__preview img');
  var pinMainImage = document.querySelector('.map__pin--main img');

  function addAvatar(reader) {
    preview.src = reader.result;
    pinMainImage.src = reader.result;
  }

  window.uploadImage(fileChooser, addAvatar);

})();
