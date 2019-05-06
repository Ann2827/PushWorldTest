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
