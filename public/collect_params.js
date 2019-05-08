
var DEFAULT_PUSH_TITLE = "Купить кофеварку";
var DEFAULT_PUSH_MESSAGE = "Вы забыли товар в корзине.";
var DEFAULT_PUSH_ICON = "img/test.jpg";
var DEFAULT_PUSH_IMG = "img/test.jpg";
var DEFAULT_PUSH_ERROR = "img/error.png";
var KEY = "AAAASqJfht4:APA91bFJaIKpQgX-ZkZlgk9hKf122NCy7H17_KLJU-MnStIIAQzAcg5LBXlCF-s0EjdLMT1Uym44xqURZvS31k7WUW6nf1faCoW6G62wuR8EsCzIneITn2j3ZijitOXQaHgfIHL9NpJV";

firebase.initializeApp({
  messagingSenderId: '320551749342'
});


// [START get_messaging_object]
// Retrieve Firebase Messaging object.
var messaging = firebase.messaging();
// [END get_messaging_object]
// [START set_public_vapid_key]
// Add the public key generated from the console here.
messaging.usePublicVapidKey('<YOUR_PUBLIC_VAPID_KEY_HERE>');
// [END set_public_vapid_key]
// IDs of divs that display Instance ID token UI or request permission UI.
const tokenDivId = 'token_div';
const permissionDivId = 'permission_div';
// [START refresh_token]
// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(function() {
  messaging.getToken().then(function(refreshedToken) {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    setTokenSentToServer(false);
    // Send Instance ID token to app server.
    sendTokenToServer(refreshedToken);
    // [START_EXCLUDE]
    // Display new Instance ID token and clear UI of all previous messages.
    resetUI();
    // [END_EXCLUDE]
  }).catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
    showToken('Unable to retrieve refreshed token ', err);
  });
});
// [END refresh_token]
// [START receive_message]
// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage(function(payload) {
  console.log('Message received. ', payload);
  // [START_EXCLUDE]
  // Update the UI to include the received message.
  appendMessage(payload);
  // [END_EXCLUDE]
});
// [END receive_message]
function resetUI() {
  clearMessages();
  showToken('loading...');
  // [START get_token]
  // Get Instance ID token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  messaging.getToken().then(function(currentToken) {
    if (currentToken) {
      sendTokenToServer(currentToken);
      updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
      updateUIForPushPermissionRequired();
      setTokenSentToServer(false);
    }
  }).catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
  });
  // [END get_token]
}
function showToken(currentToken) {
  // Show token in console and UI.
  var tokenElement = document.querySelector('#token');
  tokenElement.textContent = currentToken;
}
// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    // TODO(developer): Send the current token to your server.
    setTokenSentToServer(true);
  } else {
    console.log('Token already sent to server so won\'t send it again ' +
                'unless it changes');
  }
}
function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') === '1';
}
function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}
function showHideDiv(divId, show) {
  const div = document.querySelector('#' + divId);
  if (show) {
    div.style = 'display: visible';
  } else {
    div.style = 'display: none';
  }
}
function requestPermission() {
  console.log('Requesting permission...');
  // [START request_permission]
  messaging.requestPermission().then(function() {
    console.log('Notification permission granted.');
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
    // [START_EXCLUDE]
    // In many cases once an app has been granted notification permission, it
    // should update its UI reflecting this.
    resetUI();
    // [END_EXCLUDE]
  }).catch(function(err) {
    console.log('Unable to get permission to notify.', err);
  });
  // [END request_permission]
}
function deleteToken() {
  // Delete Instance ID token.
  // [START delete_token]
  messaging.getToken().then(function(currentToken) {
    messaging.deleteToken(currentToken).then(function() {
      console.log('Token deleted.');
      setTokenSentToServer(false);
      // [START_EXCLUDE]
      // Once token is deleted update UI.
      resetUI();
      // [END_EXCLUDE]
    }).catch(function(err) {
      console.log('Unable to delete token. ', err);
    });
    // [END delete_token]
  }).catch(function(err) {
    console.log('Error retrieving Instance ID token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
  });
}
// Add a message to the messages element.
function appendMessage(payload) {
  const messagesElement = document.querySelector('#messages');
  const dataHeaderELement = document.createElement('h5');
  const dataElement = document.createElement('pre');
  dataElement.style = 'overflow-x:hidden;';
  dataHeaderELement.textContent = 'Received message:';
  dataElement.textContent = JSON.stringify(payload, null, 2);
  messagesElement.appendChild(dataHeaderELement);
  messagesElement.appendChild(dataElement);
}
// Clear the messages element of all children.
function clearMessages() {
  const messagesElement = document.querySelector('#messages');
  while (messagesElement.hasChildNodes()) {
    messagesElement.removeChild(messagesElement.lastChild);
  }
}
function updateUIForPushEnabled(currentToken) {
  showHideDiv(tokenDivId, true);
  showHideDiv(permissionDivId, false);
  showToken(currentToken);
}
function updateUIForPushPermissionRequired() {
  showHideDiv(tokenDivId, false);
  showHideDiv(permissionDivId, true);
}
resetUI();

/*===========================================
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
    subscribe()
  })
} else {alert("Browser don`t support Notification in window")}

function subscribe() {
  // Запрос разрешения на получение уведомлений
  messaging.requestPermission()
    .then(function () {
    // Получаем ID устройства
    var test1 = messaging.getToken()
    var Str = JSON.stringify(test1);
    alert(Str)
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
=========================================*/



$(function () {
  $("#push-title").html(DEFAULT_PUSH_TITLE);
  $("#push-message").html(DEFAULT_PUSH_MESSAGE);
  $("#push-icon").attr("src", DEFAULT_PUSH_ICON);
  $("#push-img").attr("src", DEFAULT_PUSH_IMG)
});

$("#title").on("input", function () {
  $("#push-title").html($(this).val());
  if (!$(this).val()) {
    $("#push-title").html(DEFAULT_PUSH_TITLE)
  }
});
$("#message").on("input", function () {
  $("#push-message").html($(this).val());
  if (!$(this).val()) {
    $("#push-message").html(DEFAULT_PUSH_MESSAGE)
  }
});
$("#url-icon").on("onerror", function () {
  alert("error");
  //$("#push-icon").attr("src", DEFAULT_PUSH_ERROR);
});
function IconError (){
  $("#push-icon").attr("src", DEFAULT_PUSH_ERROR);
}
$("#url-icon").on("input", function () {
  function Check1(){
    alert("123");
  /*$.ajax({ 

    url: $(this).val(), 
    // dataType: "json", // Для использования JSON формата получаемых данных
    method: "GET", // Что бы воспользоваться POST методом, меняем данную строку на POST   
    success: function() {
      alert("ok");
    }
  }).done(function() {
    alert('Done!');
  }).fail(function() {
    alert('Fail!');
  });*/
  /*if (CheckURL($(this))) {
    //$("#push-icon").attr("src", $(this).val());
    alert("ok");
  } else {
    alert("error 404")
  }*/
  
  };
  if (!$(this).val()) {
    $("#push-icon").attr("src", DEFAULT_PUSH_ICON)
  };
})

/*$("#img").on("input", function(){
  $("#push-img").html($(this).val());
  if(!$(this).val()){
    $("#push-img").html(DEFAULT_PUSH_TITLE);
  }
})*/

function CheckURL(url) {
  var xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest(); // code for IE7+, Firefox, Chrome, Opera, Safari
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // code for IE6, IE5
  }
  xmlhttp.open('GET', url, false);
  xmlhttp.onreadystatechange = update;
  if (!xmlhttp.onreadystatechange) {
    return false
  } else {return true}
  //xmlhttp.send(null);

  function update() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      alert("ошибка 200");
      return false;
    }else if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {
      alert("ошибка 404");
      return false;
    } else {return true}
  }
}

$(function () {
  $("#form2").on("submit", function (event) {
    event.preventDefault();
    var Params = {};
    $("#form2").find("input").each(function () {
      Params[$(this).attr("id")] = $(this).val();
    });
    var Str = JSON.stringify(Params);
    alert(Str);
    //console.log($(this).serialize()); //все эл-ты input по name в строку

    /*$.ajax({
      url: "/test.php",
      method: "POST",
      data: {
        "img1": $("#img1").val()
      },
      success: function(){alert("success")}
    });*/
  });
});
/*{
  "notification": {
    "title": "Ералаш",
      "body": "Начало в 21:00",
        "icon": "https://eralash.ru.rsz.io/sites/all/themes/eralash_v5/logo.png?width=40&height=40",
          "click_action": "http://eralash.ru/"
  },
    "to": "YOUR-TOKEN-ID"
}*/

function Collect_Params() {
  this._url = $("#basic-url").val();
  this._headSelect = $("#heading").val();
  this._urlIcon = $("#url-icon").val();
  if ($("#img1").val()) {
    this._optionImg = "option1";
    this._img = $("#img1").val()
  } else if ($("#img2").val()) {
    this._optionImg = "option2";
    this._img = $("#img2").val()
  } else {
    alert("Error")
  }
};
