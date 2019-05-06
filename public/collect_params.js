var DEFAULT_PUSH_TITLE = "Купить кофеварку";
$(function(){
  $("#push-title").html(DEFAULT_PUSH_TITLE);
})
$("#title").on("input", function(){
  $("#push-title").html($(this).val());
  if(!$(this).val()){
    $("#push-title").html(DEFAULT_PUSH_TITLE);
  }
})
$(function(){
  $("#form2").on("submit", function(event){
    event.preventDefault();
    var Params = {};
    $("#form2").find("input").each(function(){
      Params[$(this).attr("id")] = $(this).val();
    });
    var Str = JSON.stringify(Params);
    alert(Str);
    //console.log($(this).serialize()); //все эл-ты input по name в строку

    /*$.ajax({
      url: "/test.php",
      method: "POST",
      data: {
        "img1": $("#img1").val()
      },
      success: function(){alert("success")}
    });*/
  });
});
/*{
  "notification": {
    "title": "Ералаш",
      "body": "Начало в 21:00",
        "icon": "https://eralash.ru.rsz.io/sites/all/themes/eralash_v5/logo.png?width=40&height=40",
          "click_action": "http://eralash.ru/"
  },
    "to": "YOUR-TOKEN-ID"
}*/

function Collect_Params(){
  this._url = $("#basic-url").val();
  this._headSelect = $("#heading").val();
  this._urlIcon = $("#url-icon").val();
  if ($("#img1").val()) {
    this._optionImg = "option1";
    this._img = $("#img1").val()
  } else if ($("#img2").val()) {
    this._optionImg = "option2";
    this._img = $("#img2").val()
  } else {alert("Error")}
};
