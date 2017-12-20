'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var DEFAULT_CONNECTION_TIMEOUT = 1000;
  var NOTICE_ERROR = {
    connect: 'Произошла ошибка соединения',
    timeout: 'errorConnect'
  };

  var STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
  };

  function createRequest(successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = DEFAULT_CONNECTION_TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case STATUS_CODE.OK:
          successHandler(xhr.response);
          break;

        case STATUS_CODE.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case STATUS_CODE.UNAUTHORIZED:
          error = 'Пользователь не авторизован';
          break;
        case STATUS_CODE.NOT_FOUND:
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
