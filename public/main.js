
var DEFAULT_PUSH_TITLE = "Купить кофеварку";
var DEFAULT_PUSH_MESSAGE = "Вы забыли товар в корзине.";
var DEFAULT_PUSH_ICON = "img/test.jpg";
var DEFAULT_PUSH_IMG = "img/test.jpg";
var DEFAULT_PUSH_ERROR = "img/error.png";
var KEY = "AAAASqJfht4:APA91bFJaIKpQgX-ZkZlgk9hKf122NCy7H17_KLJU-MnStIIAQzAcg5LBXlCF-s0EjdLMT1Uym44xqURZvS31k7WUW6nf1faCoW6G62wuR8EsCzIneITn2j3ZijitOXQaHgfIHL9NpJV";

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


    
  //messaging.usePublicVapidKey(KEY);
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
  })
} else {alert("Browser don`t support Notification in window")}

function subscribe() {
  // Запрос разрешения на получение уведомлений
  messaging.requestPermission()
    .then(function () {
    // Получаем ID устройства
    //alert("123");
    messaging.getToken()
    //var Str = JSON.stringify(test1)
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

    /*var url = ''; // адрес скрипта на сервере который сохраняет ID устройства
    $.post(url, {
      token: currentToken
    });*/

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
