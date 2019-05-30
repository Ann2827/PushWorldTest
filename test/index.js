/**
 * @module {module} Serviceworker
 * @description Serviceworker
 */
;(function() {
    'use strict';

    class Storage {
        constructor() {
            this.cachedPayloads = null;
        }

        get settings() {
            return {
                platform_code: '@@PLATFORM_CODE',
                version: '@@VERSION'
            }
        }

        get apiEndpoints() {
            return {
                'show': `@@API_URL` + '/v2/stat/notification',
                'click': `@@API_URL` + '/v2/stat/notification',
                'close': `@@API_URL` + '/v2/stat/notification',
                'custom_click': `@@API_URL` + '/v2/trigger'
            }
        }
    }

    let storage = new Storage();

    /**
     * @event {install}
     */
    self.addEventListener('install', event => {
        event.waitUntil(self.skipWaiting());
    });

    /**
     * @event {activate}
     */
    self.addEventListener('activate', event => {
        event.waitUntil(clients.claim());
    });

    /**
     * @function clientMessage
     * @description Отправка данных на клиент
     * @param {object} data
     * @return {console}
     */
    const clientMessage = data => {
        self.clients.matchAll().then(clients => {
            const client = clients[0];
            if (client && data) client.postMessage(data);
        });
    };

    /**
     * @function getEndpoint
     * @description получение endpoint
     * @param {string} key
     * @return {string} endpoint
     */
    const getEndpoint = key => {
        let items = key.split('/')
          , endpoint = items[items.length - 1];

        return endpoint;
    };

    /**
     * @function parseData
     * @description Парсинг данных
     * @param {object} p
     * @return {string} data
     */
    const parseData = p => {
        let data = '', key;
        for( key in p ) {
            data += key + '=' + encodeURIComponent(p[key]) + '&';
        }
        data = data.replace(/&$/,'');
        return data;
    };

    /**
     * @function parseEvents
     * @description Замена префиксов
     * @param {string} e
     * @return {string} data
     */
    const parseEvents = e => {
        return e.replace('notification', 'notification_');
    };


    /**
     * @function wait
     * @description setTimeout
     * @param {number} ms
     * @return {promise}
     */
    const wait = ms => {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    };

    /**
     * @function fetchData
     * @description Отправка статистики через Beacon API в вормате FormData
     * @param {object} params
     * @return {boolean} - если true, то запрос на отправку статистики
     * добавлен в очередь браузера, иначе false
     */
    const fetchData = params => {

        // формарование данных запроса
        const data = Object.assign({}, params, {
            'platform_code': storage.settings.platform_code,
            'version': storage.settings.version
        });

        clientMessage({
            command: 'debug',
            name: 'SW -> fetchData Start',
            params: { params, storage, data }
        });

        const formData = new FormData();
        Object.entries(data).forEach((entry) => {
            formData.append(entry[0], entry[1]);
        });

        let statUrl = null;
        switch (params.event_id) {
            case 'notification_view':
                statUrl = storage.apiEndpoints.show;
                break;
            case 'notification_click':
                statUrl = storage.apiEndpoints.click;
                break;
            case 'notification_close':
                statUrl = storage.apiEndpoints.close;
                break;
            case 'customer_events_click':
                statUrl = storage.apiEndpoints.custom_click;
                break;
        }

        if (statUrl === null) {
            clientMessage({
                command: 'debug',
                name: 'SW -> fetchData Error',
                params: { error: `error during getting url`, data: params }
            });
            return false;
        }

        fetch(new Request(statUrl, {
            mode: 'cors',
            method: 'POST',
            body: formData
        }))
            .then(function() {
                clientMessage({
                    command: 'debug',
                    name: 'SW -> fetchData Complete',
                    params: {}
                });
            })
            .catch(function(err) {
                clientMessage({
                    command: 'debug',
                    name: 'SW -> fetchData Error',
                    params: { error: `error during send statistics: ${err}` }
                });
            });
    };

    /**
     * @function generateButtons
     * @description Генерация массива кнопок
     * @param {array} actions
     * @return {array} buttons
     */
    const generateButtons = actions => {
        let buttons = [];
        if (actions && actions.length) {
            for (let i = 0; i < actions.length; i++) {
                buttons.push({
                    action: actions[i].action,
                    url: actions[i].url
                })
            }
        }
        return buttons;
    };

    /**
     * @function closeNotification
     * @description Закрытие пуша
     * @param {string} id messageid
     * @return {function} notifications.close()
     */
    const closeNotification = id => {
        self.registration.getNotifications().then(notifications => {
            for (let i = 0; i < notifications.length; i++) {
                let messageid = notifications[i].data.messageid;
                if (messageid === id) notifications[i].close();
            }
        });
    };

    /**
     * @function getRandomInt
     * @description Рандомное целое число по пределу
     * @param {number} min
     * @param {number} max
     * @return {number} random
     */
    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    /**
     * @function showNotification
     * @description Показ пушей
     * @param {object} data
     * @param {string} endpoint
     * @return {object} notification
     */
    const showNotification = (data, endpoint) => {
        clientMessage({
            command: 'debug',
            name: 'SW -> showNotification',
            params: { payload: data, showTime: `${new Date}`, endpoint },
        });
        let notification = self.registration.showNotification(data.title, {
            body: data.text,
            icon: data.image,
            image: data.image_large || data.img || '',
            vibrate: data.vibrate || [300, 100, 400],
            direction: data.direction || 'auto',
            tag: data.code,
            badge: data.badge || '', //@@BADGE_IMAGE
            actions: data.buttons,
            requireInteraction: true,
            data: {
                buttons: generateButtons(data.buttons),
                messageid: data.code,
                chainid: data.chain_id,
                deviceid: data.device_id,
                endpoint: endpoint,
                url: data.url,
                code: data.code
            }
        }).then(function () {
            if(data.duration) {
                setTimeout(function() {
                    closeNotification(data.code)
                }, data.duration * 1000);
            }
        });

        return notification;
    };

    /**
     * @function openWindow
     * @description Переход по событию click
     * @param {object} event
     * @param {string} url
     * @return {object} clients.openWindow()
     */
    const openWindow = (event, url) => {
        return event.waitUntil(clients.matchAll({
            type: 'window'
        }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url == url && 'focus' in client)
                    return client.focus();
            }
            if (clients.openWindow)
                return clients.openWindow(url);
        }));
    };

    /**
     * @function payloadParse
     * @description Получение parse JSON payload
     * @param {string} payload
     */
    const payloadParseData = payload => {
        try {
            return JSON.parse(payload)
        } catch (e) {
            return payload;
        }
    };

    /**
    * @function showNotificationTimeout
    * @description Задержка показа push (от 5сек - 10мин)
    * @return {function} getPayloadSubscription
    */
    const showNotificationTimeout = (event) => {

          // Получаем payload из события
        let payload = event.data ? event.data.text() : false
          // Парсим payload
          , payloadData = payloadParseData(payload);

        clientMessage({
            command: 'debug',
            name: 'SW -> showNotificationTimeout',
            params: { payload, payloadData, storage }
        });

        return getPayloadSubscription(payloadData);
    };

    /**
    * @function getSubscription
    * @description Получение getSubscription и запрос данных payloads
    * @return {function} showNotification
    */
    const getPayloadSubscription = payload => {
        return registration.pushManager.getSubscription().then(subscription => {
            let endpoint = (subscription && subscription.endpoint) ? subscription.endpoint : 'null';

            switch (typeof payload) {
                case 'string':
                    if (storage.cachedPayloads) {
                        return showNotification(storage.cachedPayloads, endpoint);
                    }
                    break;
                case 'object':
                    fetchData({
                        'event_id': 'notification_view',
                        'subscription_id': endpoint,
                        'multicast_code': payload.code
                    });
                    storage.cachedPayloads = payload;
                    return showNotification(payload, endpoint);
            }
        })
    };

    /**
    * @event {push}
    */
    self.addEventListener('push', (event) => {
        event.waitUntil(showNotificationTimeout(event));
    });

    /**
     * @event {notificationclick}
     */
    self.addEventListener('notificationclick', event => {
        let data = event.notification.data;
        if (!data) return;

        if (event.action) {
            for (let i = 0; i < data.buttons.length; i++) {
                if (data.buttons[i].action === event.action) {
                    fetchData({
                        'event_id': parseEvents(event.type),
                        'subscription_id': data.endpoint,
                        'action': event.action,
                        'multicast_code': data.code
                    });
                    if (data.chainid && data.deviceid) {
                        fetchData({
                            'event_id': 'customer_events_click',
                            'subscription_id': data.endpoint,
                            'chain_id': data.chainid,
                            'device_id': data.deviceid
                        });
                    }
                    return openWindow(event, data.buttons[i].url);
                }
            }
        } else {
            event.notification.close();
            fetchData({
                'event_id': parseEvents(event.type),
                'subscription_id': data.endpoint,
                'action': 'default',
                'multicast_code': data.code
            });
            if (data.chainid && data.deviceid) {
                fetchData({
                    'event_id': 'customer_events_click',
                    'subscription_id': data.endpoint,
                    'chain_id': data.chainid,
                    'device_id': data.deviceid
                });
            }
            return openWindow(event, data.url);
        }
    });

    /**
     * @event {notificationclose}
     */
    self.addEventListener('notificationclose', event => {
        event.notification.close();
        let data = event.notification.data;
        if (!data) return;

        fetchData({
            'event_id': parseEvents(event.type),
            'subscription_id': data.endpoint,
            'multicast_code': data.code
        });
    });

})();
