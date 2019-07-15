// [START initialize_firebase_in_sw]
importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-messaging.js');

const KEY = "AAAASqJfht4:APA91bFJaIKpQgX-ZkZlgk9hKf122NCy7H17_KLJU-MnStIIAQzAcg5LBXlCF-s0EjdLMT1Uym44xqURZvS31k7WUW6nf1faCoW6G62wuR8EsCzIneITn2j3ZijitOXQaHgfIHL9NpJV";

var config = {
  apiKey: KEY,
  messagingSenderId: "320551749342",
};
//инициализируем подключение к FCM
firebase.initializeApp(config);

const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]

/*// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
                                            notificationOptions);
});
// [END background_handler]*/

//---------------------------------------------------------
// регистрируем свой обработчик уведомлений
//messaging.setBackgroundMessageHandler(function (payload) {
/*if (typeof payload.data.time != 'undefined') {
      var time = new Date(payload.data.time * 1000);
      var now = new Date();

      if (time < now) { // истек срок годности уведомления
        return null;
      }

      var diff = Math.round((time.getTime() - now.getTime()) / 1000);

      // показываем реальное время в уведомлении
      // будет сгенерировано сообщение вида: "Начало через 14 минут, в 21:00"
      payload.data.body = 'Начало через ' +
        Math.round(diff / 60) + ' минут, в ' + time.getHours() + ':' +
        (time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes())
      ;
    }

    // Сохраяем data для получения пареметров в обработчике клика
    payload.data.data = payload.data;*/

// Показываем уведомление
//return self.registration.showNotification(payload.data.title, payload.data);
//});

// свой обработчик клика по уведомлению

self.addEventListener('notificationclick', function (event) {
    // извлекаем адрес перехода из параметров уведомления 
  var target = event.notification.data.click_action || '/';
  if(event.action) {
    console.log("click button ", event.action);
    if(event.notification.data.buttons[0].action === event.action){
      console.log("переход на ", event.notification.data.buttons[0].url);
      target = event.notification.data.buttons[0].url;
    };
    if(event.notification.data.buttons[1].action === event.action){
      console.log("переход на ", event.notification.data.buttons[1].url);
      target = event.notification.data.buttons[1].url;
    };
  }
  
    event.notification.close();

    // этот код должен проверять список открытых вкладок и переключатся на открытую
    // вкладку с ссылкой если такая есть, иначе открывает новую вкладку
    event.waitUntil(clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == target && 'focus' in client) {
                return client.focus();
            }
        }

        // Открываем новое окно
        return clients.openWindow(target);
      //return window.location.href = 'tel:555-678-1234';
    }));
});
