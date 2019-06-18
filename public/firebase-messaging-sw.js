// [START initialize_firebase_in_sw]
importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-messaging.js');

const SENDER_ID = "320551749342";

firebase.initializeApp({
  messagingSenderId: SENDER_ID
});

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



// свой обработчик клика по уведомлению
self.addEventListener('notificationclick', function(event) {
  // извлекаем адрес перехода из параметров уведомления 
  const target = event.notification.data.click_action || '/';
  event.notification.close();

  // этот код должен проверять список открытых вкладок и переключатся на открытую
  // вкладку с ссылкой если такая есть, иначе открывает новую вкладку
  event.waitUntil(clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then(function(clientList) {
    // clientList почему-то всегда пуст!?
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == target && 'focus' in client) {
        return client.focus();
      }
    }

    // Открываем новое окно
    return clients.openWindow(target);
  }));
});
