const DEFAULT_PUSH_TITLE = "Купить кофеварку";
const DEFAULT_PUSH_MESSAGE = "Вы забыли товар в корзине.";
const DEFAULT_PUSH_ICON = "img/test.jpg";
const DEFAULT_PUSH_IMG = "img/test.jpg";
const DEFAULT_PUSH_ERROR = "img/error.png";

$(function () {
  $("#push-title").html(DEFAULT_PUSH_TITLE);
  $("#push-message").html(DEFAULT_PUSH_MESSAGE);
  $("#push-icon").attr("src", DEFAULT_PUSH_ICON);
  $("#push-img").attr("src", DEFAULT_PUSH_IMG);
  
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
})






function IconError() {
  $("#push-icon").attr("src", DEFAULT_PUSH_ERROR);
}
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


