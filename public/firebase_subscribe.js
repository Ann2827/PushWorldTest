const KEY = "AAAASqJfht4:APA91bFJaIKpQgX-ZkZlgk9hKf122NCy7H17_KLJU-MnStIIAQzAcg5LBXlCF-s0EjdLMT1Uym44xqURZvS31k7WUW6nf1faCoW6G62wuR8EsCzIneITn2j3ZijitOXQaHgfIHL9NpJV";

firebase.initializeApp({
  messagingSenderId: '320551749342'
});

// Проверка поддерживаемости уведомлений
if ('Notification' in window &&
  'serviceWorker' in navigator &&
  'localStorage' in window &&
  'fetch' in window &&
  'postMessage' in window) {
  var messaging = firebase.messaging();

  // Проверка подписки
  if (Notification.permission === 'granted') {
    //subscribe();
  }

  // Подписать пользователя
  $("#form1").on("submit", function (event) {
    event.preventDefault();
    //регистрация вручную, мб будет не нужно на хостинге
    navigator.serviceWorker.register('firebase-messaging-sw.js').then(function (registration) {
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

  //Для показа пушей
  messaging.onMessage(function (payload) {
    console.log('Message received', payload);

    // register fake ServiceWorker for show notification on mobile devices
    navigator.serviceWorker.register('firebase-messaging-sw.js');
    Notification.requestPermission(function (permission) {
      if (permission === 'granted') {
        navigator.serviceWorker.ready.then(function (registration) {
          // Copy data object to get parameters in the click handler
          payload.data.data = JSON.parse(JSON.stringify(payload.data));
          
          const veselie = {
            body: payload.data.message,
            icon: 'https://sportiv.ru/f/product/big_junior_set_sin1.jpg',
            image: '',
            vibrate: 400,
            direction: 'auto',
            tag: 'uuid',
            badge: '',
            requireInteraction: true,
            click_action: 'https://sportiv.ru/f/product/big_junior_set_sin1.jpg',
            url: "https://sportiv.ru/f/product/big_junior_set_sin1.jpg",
            actions: [{
              title: "like-button2title",
              action: "like-button2title",
              link: "https://yandex.ru",
              icon: 'https://sportiv.ru/f/product/big_junior_set_sin1.jpg',
              url: "https://yandex.ru",
              click_action: 'https://sportiv.ru/f/product/big_junior_set_sin1.jpg'
            }],
            data: {
              buttons: [
                {
                  title: "like-button2title",
                  action: "like-button2title",
                  url: "https://yandex.ru",
                  link: "https://yandex.ru",
                  icon: 'https://sportiv.ru/f/product/big_junior_set_sin1.jpg',
                  click_action: 'https://sportiv.ru/f/product/big_junior_set_sin1.jpg'
                }
              ]
            }
          };

          registration.showNotification('payload.data.titlde', veselie);
        }).catch(function (error) {
          // registration failed :(
          showError('ServiceWorker registration failed', error);
        });
      }
    });
  });
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
          // Firebase loses 'image' from the notification.
          // And you must see this: https://github.com/firebase/quickstart-js/issues/71
          data: {
            buttons: [
              {
                action: "like-button",
                url: "https://example.com"
              },
              {
                action: "read-more-button",
                url: "https://example.com"
              }
            ],
            click_action: $("#basic-url").val(),
            title: $("#title").val(),
            message: $("#message").val(),
            icon: $("#url-icon").val(),
            image_large: $("#img2").val(),
            color: $("#p1-color").val(),
            sound: $("#p2-sound").val(),
            tag: $("#p3-tag").val(),
            body_loc_key: $("#p4-body_loc_key").val(),
            body_loc_args: [
            $("#p5-body_loc_args").val(),
          ],
            title_loc_key: $("#p6-title_loc_key").val(),
            title_loc_args: [
            $("#p7-title_loc_args").val()
          ],
            action: "123123",
            options: {
              actions: [
                {
                  action: "123",
                  title: "123",
                  icon: "https://sportiv.ru/f/product/big_junior_set_sin1.jpg"
                                }
                            ]
            }
          },
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
    click_action: $("#basic-url").val(),
    title: $("#title").val(),
    body: $("#message").val(),
    icon: $("#url-icon").val(),
    image: $("#img2").val(),
    color: "#c31cd9"
  };
  return Params;
};
//---------------------------
/*{
  "send_after": "3600",
  "multicast": {
    "title": "{:category_title}",
    "text": "Одежда, обувь и снаряжение для спортсменов и путешественников.",
    "life_time": "21600",
    "duration": "60",
    "action1_title": "Sale",
    "action1_url": "https://www.planeta-sport.ru/catalog/sale/?utm_source=push-notification&utm_medium=push-world&utm_campaign=push1",
    "action1_icon": null,
    "action2_title": "Акции",
    "action2_url": "https://www.planeta-sport.ru/catalog/promo/?utm_source=push-notification&utm_medium=push-world&utm_campaign=push1",
    "action2_icon": null,
    "abandoned_cart_timeout": "3600",
    "abandoned_cart_url": "{:abandoned_url}?utm_source=push-notification&utm_medium=push-world&utm_campaign=push1",
    "abandoned_cart_enabled": 1,
    "url": "{:abandoned_url}?utm_source=push-notification&utm_medium=push-world&utm_campaign=push1",
    "type": 6
  }
}*/
