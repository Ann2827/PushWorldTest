

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
            click_action: 'https://sportiv.ru/f/product/big_junior_set_sin1.jpg',
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