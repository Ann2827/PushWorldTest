const KEY = "AAAASqJfht4:APA91bFJaIKpQgX-ZkZlgk9hKf122NCy7H17_KLJU-MnStIIAQzAcg5LBXlCF-s0EjdLMT1Uym44xqURZvS31k7WUW6nf1faCoW6G62wuR8EsCzIneITn2j3ZijitOXQaHgfIHL9NpJV";
const SENDER_ID = "320551749342";

const config = {
  apiKey: KEY,
  messagingSenderId: SENDER_ID,
};

firebase.initializeApp(config);

// Проверка поддерживаемости уведомлений
if (CheckNotification) {
  var messaging = firebase.messaging();

  // Проверка подписки
  if (Notification.permission === 'granted') {
    //subscribe();
  }

  // Подписать пользователя
  $("#subscribe").on("click", function (event) {
    event.preventDefault();
    //регистрация вручную, мб будет не нужно на хостинге
    registr().then(function (registration) {
      messaging.useServiceWorker(registration);
      subscribe();
    })
  });

  //Удалить токен
  $("#deleet_token").on("click", function () {
    messaging.getToken().then(function (currentToken) {
      messaging.deleteToken(currentToken).then(function () {
        console.log('Удаление токена.');
        setTokenSentToServer(false);
        location.reload();
        //$(".alert").addClass("d-none");
      })
        .catch(function (error) {
        showError('Unable to delete token', error);
      });
    })
      .catch(function (error) {
      showError('Error retrieving Instance ID token', error);
    });
  });

  //Показ пушей
  messaging.onMessage(function (payload) {
    console.log('Message received', payload);

    // register fake ServiceWorker for show notification on mobile devices
    navigator.serviceWorker.register('firebase-messaging-sw.js');
    Notification.requestPermission(function (permission) {
      if (permission === 'granted') {
        navigator.serviceWorker.ready.then(function (registration) {
          // Copy data object to get parameters in the click handler
          //payload.notification = JSON.parse(JSON.stringify(payload.notification));
          const showTitle = payload.notification.title;
          const showBody = {
            body: payload.notification.body,
            icon: payload.notification.icon,

            vibrate: 400,
            direction: 'auto',
            tag: 'uuid',
            badge: '',
            requireInteraction: true,

            /*actions: [
              {
                title: payload.notification.actions["0"].action1_title,
                action: payload.notification.actions["0"].action1_action,
                icon: payload.notification.actions["0"].action1_icon
              }
            ],*/
            actions: [
              {
                title: "title action1",
                action: "action1",
                icon: "https://www.respublica.ru/uploads/00/00/00/69/xa/large_9267c233ea84395b.jpg",
                url: "https://www.google.ru/"
              },
              {
                title: "title action2",
                action: "action2",
                icon: "https://www.respublica.ru/uploads/00/00/00/69/xa/large_9267c233ea84395b.jpg",
                url: "https://news.yandex.ru/"
              }
            ],
            data: {
              image: payload.notification.image,
              buttons: [
                {
                  //title: payload.notification.button1_title,
                  //action: payload.notification.button1_action
                  action: "action1"
                },
                {
                  //title: payload.notification.button1_title,
                  //action: payload.notification.button1_action
                  action: "action2"
                }
              ],
              click_action: payload.notification.click_action,
              color: payload.notification.color,
              sound: payload.notification.sound,
              tag: payload.notification.tag
            }
          };

          registration.showNotification(showTitle, showBody);
        }).catch(function (error) {
          // registration failed :(
          showError('ServiceWorker registration failed', error);
        });
      }
    });
  });
}



//Подписать
function subscribe() {
  // Запрос разрешения на получение уведомлений
  messaging.requestPermission().then(function () {
    // Получаем ID устройства

    messaging.getToken().then(function (currentToken) {
      console.log(currentToken);
      if (currentToken) {
        sendTokenToServer(currentToken);
        $(".alert").removeClass("d-none");
      } else {
        console.warn('Не удалось получить токен.');
        setTokenSentToServer(false);
      }
    }).catch(function (err) {
      console.warn('При получении токена произошла ошибка.', err);
      setTokenSentToServer(false);
    });
  }).catch(function (err) {
    console.warn('Не удалось получить разрешение на показ уведомлений.', err);
  });
}

// Отправка ID на сервер
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer(currentToken)) {
    console.log('Отправка токена на сервер...');
    setTokenSentToServer(currentToken);
    ShowToken(currentToken);
  } else {
    console.log('Токен уже отправлен на сервер.');
    ShowToken(currentToken);
  }
}

//Отобразить на странице токен
function ShowToken(currentToken) {
  $(".alert").alert("show");
  $(".alert p").html("<b>Токен:</b> " + currentToken);
}

// localStorage, если уже подписан
function isTokenSentToServer(currentToken) {
  return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

//Отправка на сервер
function setTokenSentToServer(currentToken) {
  window.localStorage.setItem(
    'sentFirebaseMessagingToken',
    currentToken ? currentToken : ''
  );
}

$(function () {
  $("#form2").on("submit", function (event) {
    event.preventDefault();
    //var Params = Collect_Params();

    //alert для проверки
    //var Str = JSON.stringify(Params);
    //alert(Str);

    sendNotification();
  });
});

function showError(error, error_data) {
  if (typeof error_data !== "undefined") {
    console.error(error, error_data);
  } else {
    console.error(error);
  }
}

function sendNotification() {

  console.log('Send notification');

  // hide last notification data

  messaging.getToken().then(function (currentToken) {
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': 'key=' + KEY,
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        notification: Collect_Params(),
        to: currentToken
      })
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      console.log('Response', json);

      if (json.success === 1) {
        console.log('Успех', json.results[0]);
      } else {
        console.log('Ошибка', json.results[0]);
      }
    }).catch(function (error) {
      showError(error);
    });
  })
    .catch(function (error) {
    showError('Error retrieving Instance ID token', error);
  });
}

function Collect_Params() {
  var Params = {
    title: $("#title").val(),
    body: $("#message").val(),
    icon: $("#url-icon").val(),

    /*actions: [
              {
                action1_title: "",
                action1_action: "",
                action1_icon: ""
              },
              {
                action2_title: "",
                action2_action: "",
                action2_icon: ""
              }
            ],*/


    button1_action: "https://yandex.ru",


    button2_action: "",

    click_action: $("#basic-url").val(),
    image: $("#img2").val(),
    color: $("#p1-color").val(),
    sound: $("#p2-sound").val(),
    tag: $("#p3-tag").val(),
    badge: $("#p4-badge").val(),
    renotify: $("#p5-renotify").val(),//boolean
    silent: $("#p6-silent").val(),//boolean
    timestamp: $("#p7-timestamp").val(),

    noscreen: $("#p8-noscreen").val(),
    sticky: $("#p9-sticky").val(),


  };
  return Params;
};


function CheckNotification() {
  if ('Notification' in window &&
      'serviceWorker' in navigator &&
      'localStorage' in window &&
      'fetch' in window &&
      'postMessage' in window) {
    return true;
  } else {
    alert("Browser don`t support Notification in window");

    if (!('Notification' in window)) {
      showError('Notification not supported');
    } else if (!('serviceWorker' in navigator)) {
      showError('ServiceWorker not supported');
    } else if (!('localStorage' in window)) {
      showError('LocalStorage not supported');
    } else if (!('fetch' in window)) {
      showError('fetch not supported');
    } else if (!('postMessage' in window)) {
      showError('postMessage not supported');
    }

    console.warn('This browser does not support desktop notification.');
    console.log('Is HTTPS', window.location.protocol === 'https:');
    console.log('Support Notification', 'Notification' in window);
    console.log('Support ServiceWorker', 'serviceWorker' in navigator);
    console.log('Support LocalStorage', 'localStorage' in window);
    console.log('Support fetch', 'fetch' in window);
    console.log('Support postMessage', 'postMessage' in window);
    return false;
  }
}


function registr() {
  return navigator.serviceWorker.register('firebase-messaging-sw.js');
}