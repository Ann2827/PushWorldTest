const KEY = "AAAASqJfht4:APA91bFJaIKpQgX-ZkZlgk9hKf122NCy7H17_KLJU-MnStIIAQzAcg5LBXlCF-s0EjdLMT1Uym44xqURZvS31k7WUW6nf1faCoW6G62wuR8EsCzIneITn2j3ZijitOXQaHgfIHL9NpJV";
const SENDER_ID = "320551749342";

const SNText = "{\n body: payload.notification.body,\n icon: payload.notification.icon,\n badge: payload.data.badge,\n requireInteraction: (payload.data.requireInteractio==='true'),\n vibrate: payload.data.vibrate,\n color: payload.data.color,\n sound: payload.data.sound,\n tag: payload.notification.tag,\n renotify: payload.data.renotify,\n silent: payload.data.silent,\n timestamp: payload.data.timestamp,\n noscreen: payload.data.noscreen,\n sticky: payload.data.sticky,\n image: payload.data.image,\n actions:[\n {\n title: payload.data.button1_title,\n action: 'action1',\n icon: payload.daa.button1_icon\n },\n {\n title: payload.data.button2_title,\n action: 'action2',\n icon: payload.data.button2_icon\n }\n ],\n data: {\n buttons: [\n {\n action: 'action1',\n url: payload.data.button1_url\n },\n {\n action: 'action2',\n url: payload.data.button2_url\n }\n ],\n click_action: payload.notification.click_action\n }\n }";


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

  $("#SN").text(SNText);

  // Подписать пользователя
  $("#subscribe").on("click", function (event) {
    event.preventDefault();
    //регистрация вручную, мб будет не нужно на хостинге
    registr().then(function (registration) {
      messaging.useServiceWorker(registration);
      subscribe();
      $("#subscribe").attr("disabled", "disabled");
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
          console.log("notification поля, которые доходят ", JSON.stringify(payload));
          const showTitle = payload.notification.title;

          var showBody = {
            body: payload.notification.body,
            icon: payload.notification.icon,
            badge: payload.data.badge,
            requireInteraction: (payload.data.requireInteraction === 'true'),
            vibrate: payload.data.vibrate,
            color: payload.data.color,
            sound: payload.data.sound,
            tag: payload.notification.tag,
            renotify: (payload.data.renotify === 'true'),
            silent: (payload.data.silent === 'true'),
            timestamp: payload.data.timestamp,
            noscreen: (payload.data.noscreen === 'true'),
            sticky: (payload.data.sticky === 'true'),
            image: payload.data.image,
            //direction: 'auto',
            actions: [
              {
                title: payload.data.button1_title,
                action: 'action1',
                icon: payload.data.button1_icon
                  },
              {
                title: payload.data.button2_title,
                action: 'action2',
                icon: payload.data.button2_icon
                  }
                ],
            data: {
              buttons: [
                {
                  action: 'action1',
                  url: payload.data.button1_url
                },
                {
                  action: 'action2',
                  url: payload.data.button2_url
                }
              ],
              click_action: payload.notification.click_action
            }
          };

          if ($("#CheckboxSN").is(":checked")) {
            var text = $("#SN").text();
            //console.log(text);
            showBody = eval("(" + text + ")");
            //console.log(showBody);
          };




          //$("#SN").text(JSON.stringify(showBody, "", 4));

          console.log("notification показ ", JSON.stringify(showBody));

          //if (payload.data.timeout === "")
          //const timeout = parseInt(payload.data.timeout);


          //function func() {
          //registration.showNotification(showTitle, showBody);
          //};

          //setTimeout(func, timeout);

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
  let name = ProcessingToken(currentToken).then(response => {
    console.log(name);
    alert('name ' + name);
    if (!isTokenSentToServer(currentToken)) {
      console.log('Отправка токена на сервер...');
      setTokenSentToServer(currentToken);
    } else {
      console.log('Токен уже отправлен на сервер.');
    }
    ShowToken(currentToken, name);
  });

}

//Отобразить на странице токен
function ShowToken(currentToken, name) {
  $(".alert").alert("show");
  if (name) {
    $(".alert p").html("<b>Пользователь: </b>" + name + " <b>Токен: </b>" + currentToken);
  } else {
    $(".alert p").html("<b>Токен: </b>" + currentToken);
  }
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
          notification: Collect_Params_notification(),
          data: Collect_Params_data(),
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

function Collect_Params_notification() {
  var Params = {
    title: $("#title").val(),
    body: $("#message").val(),
    icon: $("#url-icon").val(),
    click_action: $("#basic-url").val(),
    tag: $("#p3-tag").val()
  };
  return Params;
};

function Collect_Params_data() {
  var Params = {
    button1_title: $("#b1-title").val(),
    button1_icon: $("#b1-icon").val(),
    button1_url: $("#b1-url").val(),

    button2_title: $("#b2-title").val(),
    button2_icon: $("#b2-icon").val(),
    button2_url: $("#b2-url").val(),


    image: $("#img").val(),
    color: $("#p1-color").val(),
    sound: $("#p2-sound").val(),
    badge: $("#p4-badge").val(),
    renotify: $("#p5-renotify").val(), //boolean
    silent: $("#p6-silent").val(), //boolean
    timestamp: $("#p7-timestamp").val(),
    requireInteraction: $("#p10-requireInteraction").val(), //boolean
    timeout: $("p11-timeout").val(),

    noscreen: $("#p8-noscreen").val(),
    sticky: $("#p9-sticky").val()
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

function ProcessingToken(currentToken) {
  return new Promise(function (resolve) {
    readUserList().then(
      response => {
        for (let i = 0; i < response.data.length; i++) {
          if (currentToken === response.data[i].token_id) {
            return resolve(response.data[i].description)
          }
        };
        return false;
      },
      error => alert(`Rejected: ${error}`)
    );
  })
}

function WriteToken(currentToken) {

}


//преобразование строки в код
/*function TextToCode(text) {
  text = Symbol(text, "{", "after");
  text = Symbol(text, "}", "until");
  text = Symbol(text, ",", "after");
  
  return text;
}

function Symbol(text, str, key) {
  switch(key) {
    case "after":
      key = 1;
      break;
    case "until":
      key = 0;
      break;
    default:
      break;
  }; 
  let pos = -1;
  while ((pos = text.indexOf(str, pos + key)) != -1) {
    text = text.substring(0, pos+1) + "\n" + text.substring(pos+1);
  };
  return text;
}*/
