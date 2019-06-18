const KEY = "AAAASqJfht4:APA91bFJaIKpQgX-ZkZlgk9hKf122NCy7H17_KLJU-MnStIIAQzAcg5LBXlCF-s0EjdLMT1Uym44xqURZvS31k7WUW6nf1faCoW6G62wuR8EsCzIneITn2j3ZijitOXQaHgfIHL9NpJV";

var config = {
    apiKey: KEY,
    messagingSenderId: "320551749342",
};
//инициализируем подключение к FCM
firebase.initializeApp(config);

const messaging = firebase.messaging();



//запрос на показ Web-PUSH браузеру
messaging.requestPermission()
    .then(function () {
        console.log('Notification permission granted.');
        // Если нотификация разрешена, получаем токен.
        navigator.serviceWorker.register('firebase-messaging-sw.js').then(function (registration) {
                messaging.useServiceWorker(registration);
                messaging.getToken().then(function (currentToken) {
                    alert("gettoken");
                    if (currentToken) {
                        console.log(currentToken);
                        //отправка токена на сервер
                        if (!(window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken)) {
                            console.log('Отправка токена на сервер...');
                            window.localStorage.setItem(
                                'sentFirebaseMessagingToken',
                                currentToken ? currentToken : ''
                            );
                            $(".alert").alert("show");
                            $(".alert p").html("<b>Токен:</b> " + currentToken);
                        } else {
                            console.log('Токен уже отправлен на сервер.');
                            $(".alert").alert("show");
                            $(".alert p").html("<b>Токен:</b> " + currentToken);
                        }
                        $(".alert").removeClass("d-none");
                    } else {
                        console.log('No Instance ID token available. Request permission to generate one.');
                    }
                })
            })
            .catch(function (err) {
                console.log('An error occurred while retrieving token. ', err);

            });
        // ...
    })
    .catch(function (err) {
        console.log('Unable to get permission to notify.', err);
    });




/*
//обновление токена
messaging.onTokenRefresh(function() {
	messaging.getToken()
	.then(function(refreshedToken) {
		console.log('Token refreshed.');
	})
	.catch(function(err) {
		console.log('Unable to retrieve refreshed token ', err);
		showToken('Unable to retrieve refreshed token ', err);
	});
}) */
$("#sendpush").on("click", function () {
messaging.getToken().then(function (currentToken) {
    alert("send");
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
            title: "title",
            body: "body"
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
})
//окно sw


messaging.onMessage(function (payload) {
    console.log('Message received. ', payload);
    // регистрируем пустой ServiceWorker каждый раз
    navigator.serviceWorker.register('firebase-messaging-sw.js');
    // запрашиваем права на показ уведомлений если еще не получили их
    Notification.requestPermission(function (result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function (registration) {
                // теперь мы можем показать уведомление
                payload.data.data = JSON.parse(JSON.stringify(payload.data));
                var title = "title2";
                var data = {
                    body: "body2"
                }
                //console.log(payload.data.title, payload.data);
                return registration.showNotification(title, data);
            }).catch(function (error) {
                console.log('ServiceWorker registration failed', error);
            });
        }
    });
});

