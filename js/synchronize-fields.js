'use strict';

(function () {
  window.synchronizeFields = function (field1, field2, value1, value2, cb) {
    var valueIndex = field1.selectedIndex;
    cb(field2, value2[valueIndex]);
  };
})();
