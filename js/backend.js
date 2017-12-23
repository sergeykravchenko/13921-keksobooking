'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var DEFAULT_CONNECTION_TIMEOUT = 1000;
  var NOTICE_ERROR = {
    CONNECT: 'Произошла ошибка соединения',
    TIMEOUT: 'errorConnect'
  };

  var STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
  };

  function createRequest(onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = DEFAULT_CONNECTION_TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case STATUS_CODE.OK:
          onSuccess(xhr.response);
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
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError(NOTICE_ERROR.CONNECT);
    });

    xhr.addEventListener('timeout', function () {
      onError(NOTICE_ERROR.TIMEOUT + xhr.timeout + 'мс');
    });

    return xhr;
  }

  window.backend = {
    load: function (onSuccess, onError) {
      var xhr = createRequest(onSuccess, onError);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    save: function (data, onSuccess, onError) {
      var xhr = createRequest(onSuccess, onError);
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
