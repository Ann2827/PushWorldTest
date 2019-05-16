const DEFAULT_PUSH_TITLE = "Купить кофеварку";
const DEFAULT_PUSH_MESSAGE = "Вы забыли товар в корзине.";
const DEFAULT_PUSH_ICON = "img/test.jpg";
const DEFAULT_PUSH_IMG = "img/test.jpg";
const DEFAULT_PUSH_ERROR = "img/error.png";

$(function () {
  $("input[type=radio]").on("click", function () {
    if ($("input[type=radio][value=option1]").is(":checked")) {
      $("#img-option1").removeClass("d-none");
      $("#img-option2").addClass("d-none")
    } else if ($("input[type=radio][value=option2]").is(":checked")) {
      $("#img-option1").addClass("d-none");
      $("#img-option2").removeClass("d-none")
    } else {
      $("#img-option1").addClass("d-none");
      $("#img-option2").addClass("d-none");
      $("#img-error").removeClass("d-none")
    }
  });

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

  $("#loadPush-Img").on("click", function () {
    if(CheckImg($("#url-icon").val())) {
      $("#push-icon").attr("src", $("#url-icon").val())
    }
    //$("#push-icon").attr("src", $(this).val());
    /*var img = document.createElement('img');
    img.onload = function() { alert("Успех " + this.src) };
    img.onerror = function() { alert("Ошибка " + this.src) };
    img.src = ...*/
    //$("#push-icon").attr("src", DEFAULT_PUSH_ERROR);
    if (!$(this).val()) {
      $("#push-icon").attr("src", DEFAULT_PUSH_ICON)
    };
  });
  
  ChangeAlert();

})
function CheckImg(url) {
  var flag;
  var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
  var xhr = new XHR();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    alert( this.responseText );
    flag = true;
  }
  xhr.onerror = function() {
    alert( 'Ошибка ' + this.status );
    flag = false;
  }
  xhr.send();
  return flag;
}

function ChangeAlert() {
  // выбираем целевой элемент
  var target = document.querySelector(".alert");
  // создаём экземпляр MutationObserver
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var newVal = $(mutation.target).prop(mutation.attributeName);
      if (mutation.attributeName === "class") {
        if (!newVal.includes("d-none")) {
          $("#send-form").removeAttr("disabled");
          $("#CheckPushHelp").addClass("d-none");
        }
        /*else {
                 $("#send-form").attr("disabled");
               }*/
      }
      console.log(mutation.type);
    });
  });

  // конфигурация нашего observer:
  var config = {
    attributes: true
  };

  // передаём в качестве аргументов целевой элемент и его конфигурацию
  observer.observe(target, config);

  // позже можно остановить наблюдение
  //observer.disconnect();
}

function IconError() {
  $("#push-icon").attr("src", DEFAULT_PUSH_ERROR);
}


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


/*$("#img").on("input", function(){
  $("#push-img").html($(this).val());
  if(!$(this).val()){
    $("#push-img").html(DEFAULT_PUSH_TITLE);
  }
})*/

  /*if (CheckURL($(this))) {
      //$("#push-icon").attr("src", $(this).val());
      alert("ok");
    } else {
      alert("error 404")
}

function CheckURL(url) {
  
  var xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest(); // code for IE7+, Firefox, Chrome, Opera, Safari
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // code for IE6, IE5
  }
  xmlhttp.open('GET', url, false);
  xmlhttp.send();
  //xmlhttp.onreadystatechange = testfunc;
  xmlhttp.onreadystatechange = update;
  /*if (!xmlhttp.onreadystatechange) {
    return false
  } else {
    return true
  }*/
  //xmlhttp.send(null);

  function testfunc() {
    alert("83467");
    if (xmlhttp.readyState === 4) {
      consol.log("Шаг 4: ", xmlhttp.status, "заголовки ", xmlhttp.getAllResponseHeaders, "тело", xmlhttp.responseText)
    }
  }
  
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

