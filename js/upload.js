'use strict';
(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];

  function uploadImage(fileChooser, cb) {
    function onFieldChange() {
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (item) {
        return fileName.endsWith(item);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          cb(reader);
        });

        reader.readAsDataURL(file);
      }
    }

    fileChooser.addEventListener('change', onFieldChange);

  }

  window.uploadImage = uploadImage;

})();
