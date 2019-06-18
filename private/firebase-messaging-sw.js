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
