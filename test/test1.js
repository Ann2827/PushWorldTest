data: {
    buttons: [
      {
        action: "like-button",
        url: "https://example.com"
    },
      {
        action: "read-more-button",
        url: "https://example.com"
    }
  ],
    click_action: $("#basic-url").val(),
    title: $("#title").val(),
    message: $("#message").val(),
    icon: $("#url-icon").val(),
    image_large: $("#img2").val(),
    color: $("#p1-color").val(),
    sound: $("#p2-sound").val(),
    tag: $("#p3-tag").val(),
    body_loc_key: $("#p4-body_loc_key").val(),
    body_loc_args: [
                        $("#p5-body_loc_args").val(),
                      ],
    title_loc_key: $("#p6-title_loc_key").val(),
    title_loc_args: [
                            $("#p7-title_loc_args").val()
                          ],
  },

  {
    "data": {
      "button1_url": "https://www.google.ru/",
      "image": "https://www.respublica.ru/uploads/01/00/00/by/31/large_83496bd950e85fef.jpg",
      "silent": "",
      "color": "",
      "button2_icon": "https://www.respublica.ru/uploads/00/00/00/69/xa/large_9267c233ea84395b.jpg",
      "sound": "",
      "button1_title": "title button1",
      "button2_url": "https://news.yandex.ru/",
      "button2_title": "title button2",
      "button1_icon": "https://www.respublica.ru/uploads/00/00/00/69/xa/large_9267c233ea84395b.jpg",
      "badge": "",
      "noscreen": "",
      "sticky": "",
      "renotify": "",
      "timestamp": ""
    },
    "from": "320551749342",
    "notification": {
      "title": "title",
      "body": "body",
      "icon": "https://www.respublica.ru/uploads/00/00/00/69/xa/large_9267c233ea84395b.jpg",
      "click_action": "https://yandex.ru",
      "tag": ""
    },
    "collapse_key": "do_not_collapse"
  }

{
  "body": "body",
  "icon": "https://www.respublica.ru/uploads/00/00/00/69/xa/large_9267c233ea84395b.jpg",
  "vibrate": 400,
  "direction": "auto",
  "badge": "",
  "requireInteraction": true,
  "actions": [{
    "title": "title action1",
    "action": "action1",
    "icon": "https://www.respublica.ru/uploads/00/00/00/69/xa/large_9267c233ea84395b.jpg"
  }, {
    "title": "title action2",
    "action": "action2",
    "icon": "https://www.respublica.ru/uploads/00/00/00/69/xa/large_9267c233ea84395b.jpg"
  }],
  "data": {
    "image": "https://www.respublica.ru/uploads/01/00/00/by/31/large_83496bd950e85fef.jpg",
    "buttons": [{
      "action": "action1",
      "url": "https://www.google.ru/"
    }, {
      "action": "action2",
      "url": "https://news.yandex.ru/"
    }],
    "click_action": "https://yandex.ru",
    "color": "",
    "sound": "",
    "tag": ""
  }
}
  
  
  
  
  
  
  
  
  const showBody = {
    body: payload.notification.body,
    icon: payload.notification.icon,
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
      image: payload.data.image,
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
      badge: payload.data.badge,
      requireInteraction: payload.data.requireInteraction,
      vibrate: payload.data.vibrate,
      click_action: payload.notification.click_action,
      color: payload.data.color,
      sound: payload.data.sound,
      tag: payload.notification.tag,
      renotify: payload.data.renotify,
      silent: payload.data.silent,
      timestamp: payload.data.timestamp,
      noscreen: payload.data.noscreen,
      sticky: payload.data.sticky
    }
  };

  
  const showBody = {
    "body": "payload.notification.body",
    "icon": "payload.notification.icon",
    "actions": [
      {
        "title": "payload.data.button1_title",
        "action": "action1",
        "icon": "payload.data.button1_icon"
      },
      {
        "title": "payload.data.button2_title",
        "action": "action2",
        "icon": "payload.data.button2_icon"
      }
    ],
    "data": {
      "image": "payload.data.image",
      "buttons": [
        {
          "action": "action1",
          "url": "payload.data.button1_url"
        },
        {
          "action": "action2",
          "url": "payload.data.button2_url"
        }
      ],
      "badge": "payload.data.badge",
      "requireInteraction": "payload.data.requireInteraction",
      "vibrate": "payload.data.vibrate",
      "click_action": "payload.notification.click_action",
      "color": "payload.data.color",
      "sound": "payload.data.sound",
      "tag": "payload.notification.tag",
      "renotify": "payload.data.renotify",
      "silent": "payload.data.silent",
      "timestamp": "payload.data.timestamp",
      "noscreen": "payload.data.noscreen",
      "sticky": "payload.data.sticky"
    }
  };
  
  
  
  {body:payload.notification.body,icon:payload.notification.icon,actions:[{title:payload.data.button1_title,action:'action1',icon:payload.data.button1_icon},{title:payload.data.button2_title,action:'action2',icon:payload.data.button2_icon}],data:{image:payload.data.image,buttons:[{action:'action1',url:payload.data.button1_url},{action:'action2',url:payload.data.button2_url}],badge:payload.data.badge,requireInteraction:payload.data.requireInteraction,vibrate:payload.data.vibrate,click_action:payload.notification.click_action,color:payload.data.color,sound:payload.data.sound,tag:payload.notification.tag,renotify:payload.data.renotify,silent:payload.data.silent,timestamp:payload.data.timestamp,noscreen:payload.data.noscreen,sticky:payload.data.sticky}}