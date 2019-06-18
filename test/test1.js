body: JSON.stringify({
  // Firebase loses 'image' from the notification.
  // And you must see this: https://github.com/firebase/quickstart-js/issues/71
  data: {
    buttons: [
      {
        action: "like-button",
        title: "Like",
        icon: "http://i.imgur.com/N8SN8ZS.png",
        url: "https://example.com"
      },
      {
        action: "read-more-button",
        title: "Read more",
        icon: "http://i.imgur.com/MIxJp1L.png",
        url: "https://example.com"
      }
    ],
    action: "like-button",
    click_action: $("#basic-url").val(),
    title: $("#title").val(),
    body: $("#message").val(),
    icon: $("#url-icon").val(),
    image: $("#img2").val(),
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
    action: "123123",
    options: {
      actions: [
        {
          action: "123",
          title: "123",
          icon: "https://sportiv.ru/f/product/big_junior_set_sin1.jpg"
        }
      ]
    }
  },
  to: currentToken
})