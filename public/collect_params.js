const DEFAULT_PUSH_TITLE = "Купить кофеварку";
const DEFAULT_PUSH_MESSAGE = "Вы забыли товар в корзине.";
const DEFAULT_PUSH_ICON = "img/test.jpg";
const DEFAULT_PUSH_IMG = "img/test.jpg";
const DEFAULT_PUSH_ERROR = "img/error.png";
const KEY = "AAAASqJfht4:APA91bFJaIKpQgX-ZkZlgk9hKf122NCy7H17_KLJU-MnStIIAQzAcg5LBXlCF-s0EjdLMT1Uym44xqURZvS31k7WUW6nf1faCoW6G62wuR8EsCzIneITn2j3ZijitOXQaHgfIHL9NpJV";

var massage_id = $('#massage_id');
var massage_row = $('#massage_row');
var info = $('#info');
var info_message = $('#info-message');


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
    alert("нет подписки");
    //getToken();
  }

  // Подписать пользователя
  $("#form1").on("submit", function (event) {
    event.preventDefault();
    getToken();
  });
  
  //отменить подписку
  $("#subscribe-deleet").on("click", function (event) {
    // Delete Instance ID token.
    messaging.getToken().then(function (currentToken) {
        messaging.deleteToken(currentToken)
          .then(function () {
            console.log('Token deleted');
            setTokenSentToServer(false);
            // Once token is deleted update UI.
            resetUI();
          })
          .catch(function (error) {
            showError('Unable to delete token', error);
          });
      })
      .catch(function (error) {
        showError('Error retrieving Instance ID token', error);
      });
  })
  
  //собрать данные с формы
  $("#form2").on("submit", function (event) {
    event.preventDefault();

    var Params = {};
    $("#form2").find("input").each(function () {
      Params[$(this).attr("id")] = $(this).val();
    });
    //var Str = JSON.stringify(Params);
    //alert(Str);
    sendNotification(Params);
  });

  // handle catch the Params on current page
  messaging.onMessage(function (payload) {
    console.log('Message received', payload);
    info.show();
    info_message
      .text('')
      .append('<strong>' + payload.data.title + '</strong>')
      .append('<em>' + payload.data.body + '</em>');

    // register fake ServiceWorker for show Params on mobile devices
    navigator.serviceWorker.register('firebase-messaging-sw.js');
    Notification.requestPermission(function (permission) {
      if (permission === 'granted') {
        navigator.serviceWorker.ready.then(function (registration) {
          // Copy data object to get parameters in the click handler
          payload.data.data = JSON.parse(JSON.stringify(payload.data));

          registration.showNotification(payload.data.title, payload.data);
        }).catch(function (error) {
          // registration failed :(
          showError('ServiceWorker registration failed', error);
        });
      }
    });
  });

 /* // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(function () {
    messaging.getToken()
      .then(function (refreshedToken) {
        console.log('Token refreshed');
        // Send Instance ID token to app server.
        sendTokenToServer(refreshedToken);
        updateUIForPushEnabled(refreshedToken);
      })
      .catch(function (error) {
        showError('Unable to retrieve refreshed token', error);
      });
  });*/
}; /*else {
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

  console.warn('This browser does not support desktop Params.');
  console.log('Is HTTPS', window.location.protocol === 'https:');
  console.log('Support Notification', 'Notification' in window);
  console.log('Support ServiceWorker', 'serviceWorker' in navigator);
  console.log('Support LocalStorage', 'localStorage' in window);
  console.log('Support fetch', 'fetch' in window);
  console.log('Support postMessage', 'postMessage' in window);

  updateUIForPushPermissionRequired();
}*/

function getToken() {
  messaging.requestPermission().then(function () {
      //Получить экземпляр ID token. При инициализации это делает сетевой вызов, после получения последующие вызовы getToken будут возвращаться из кэша.
      messaging.getToken().then(function (currentToken) {
          if (currentToken) {
            sendTokenToServer(currentToken);
            updateUIForPushEnabled(currentToken);
          } else {
            showError('No Instance ID token available. Request permission to generate one');
            updateUIForPushPermissionRequired();
            setTokenSentToServer(false);
          }
        }).catch(function (error) {
          showError('An error occurred while retrieving token', error);
          updateUIForPushPermissionRequired();
          setTokenSentToServer(false);
        });
    })
    .catch(function (error) {
      showError('Unable to get permission to notify', error);
    });
}


function sendNotification(Params) {

  console.log('Send Params', Params);

  // hide last Params data
  info.hide();
  massage_row.hide();

  messaging.getToken().then(function (currentToken) {
      fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': 'key=' + KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Firebase loses 'image' from the Params.
          // And you must see this: https://github.com/firebase/quickstart-js/issues/71
          data: Params,
          to: currentToken
        })
      }).then(function (response) {
        return response.json();
      }).then(function (json) {
        console.log('Response', json);

        if (json.success === 1) {
          massage_row.show();
          massage_id.text(json.results[0].message_id);
        } else {
          massage_row.hide();
          massage_id.text(json.results[0].error);
        }
      }).catch(function (error) {
        showError(error);
      });
    })
    .catch(function (error) {
      showError('Error retrieving Instance ID token', error);
    });
}

// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer(currentToken)) {
    console.log('Sending token to server...');
    // отправить текущий token на сервер
    //$.post(url, {$("#token"): currentToken});
    setTokenSentToServer(currentToken);
  } else {
    console.log('Token already sent to server so won\'t send it again unless it changes');
  }
}

function isTokenSentToServer(currentToken) {
  return window.localStorage.getItem('sentFirebaseMessagingToken') === currentToken;
}

function setTokenSentToServer(currentToken) {
  if (currentToken) {
    window.localStorage.setItem('sentFirebaseMessagingToken', currentToken);
  } else {
    window.localStorage.removeItem('sentFirebaseMessagingToken');
  }
}

function updateUIForPushEnabled(currentToken) {
  console.log(currentToken);
  $("#token").text(currentToken);
  //$("#subscribe").hide();
  //$("#subscribe-deleet").show();
  //$("#form2").show();
}

function resetUI() {
  $("#token").text('');
  //$("#subscribe").show();
  //$("#subscribe-deleet").hide();
  //$("#form2").hide();
  massage_row.hide();
  info.hide();
}

function updateUIForPushPermissionRequired() {
  //$("#subscribe").attr('disabled', 'disabled');
  resetUI();
}

function showError(error, error_data) {
  if (typeof error_data !== "undefined") {
    console.error(error, error_data);
  } else {
    console.error(error);
  }

  $("#alert").show();
  $("#alert_message").html(error);
}


//=========================================================
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


$("#url-icon").on("input", function () {
  function Check1() {
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
  } else {
    return true
  }
  //xmlhttp.send(null);

  function update() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      alert("ошибка 200");
      return false;
    } else if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {
      alert("ошибка 404");
      return false;
    } else {
      return true
    }
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
