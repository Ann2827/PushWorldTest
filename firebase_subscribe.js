firebase.initializeApp({
  messagingSenderId: '640654845630'
});

// Проверка поддерживаемости уведомлений
if ('Notification' in window) {
  var messaging = firebase.messaging();

  // Проверка подписки
  if (Notification.permission === 'granted') {
    subscribe();
  } else {alert("You haven`t subscription")}

  // Подписать пользователя
  $("#subscribe").on("click", function () {
    alert("123");
    subscribe()
  });
} else {alert("Browser don`t support Notification in window")}

function subscribe() {
  // Запрос разрешения на получение уведомлений
  messaging.requestPermission()
    .then(function () {
    // Получаем ID устройства
    messaging.getToken()
      .then(function (currentToken) {
      console.log(currentToken);

      if (currentToken) {
        sendTokenToServer(currentToken);
      } else {
        console.warn('Не удалось получить токен.');
        setTokenSentToServer(false);
      }
    })
      .catch(function (err) {
      console.warn('При получении токена произошла ошибка.', err);
      setTokenSentToServer(false);
    });
  })
    .catch(function (err) {
    console.warn('Не удалось получить разрешение на показ уведомлений.', err);
  });
}

// Отправка ID на сервер
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer(currentToken)) {
    console.log('Отправка токена на сервер...');

    var url = ''; // адрес скрипта на сервере который сохраняет ID устройства
    $.post(url, {
      token: currentToken
    });

    setTokenSentToServer(currentToken);
  } else {
    console.log('Токен уже отправлен на сервер.');
  }
}

// localStorage, если уже подписан
function isTokenSentToServer(currentToken) {
  return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
  window.localStorage.setItem(
    'sentFirebaseMessagingToken',
    currentToken ? currentToken : ''
  );
}