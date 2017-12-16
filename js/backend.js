'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var NOTICE_ERROR = {
    connect: 'Произошла ошибка соединения',
    timeout: 'errorConnect'
  };

  function createRequest(successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          successHandler(xhr.response);
          break;

        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        errorHandler(error);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler(NOTICE_ERROR.connect);
    });

    xhr.addEventListener('timeout', function () {
      errorHandler(NOTICE_ERROR.timeout + xhr.timeout + 'мс');
    });

    return xhr;
  }

  window.backend = {
    load: function (successHandler, errorHandler) {
      var xhr = createRequest(successHandler, errorHandler);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    save: function (data, successHandler, errorHandler) {
      var xhr = createRequest(successHandler, errorHandler);
      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    showError: function (errorNotice) {
      var notice = document.createElement('div');
      notice.textContent = errorNotice;
      notice.classList.add('error-notice');
      document.body.appendChild(notice);

      setTimeout(function () {
        notice.remove();
      }, 5000);
    }
  };
})();
