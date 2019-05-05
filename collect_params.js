function Collect_Params(){
  this._url = $("#basic-url").val();
  this._headSelect = $("#heading").val();
  if ($("#img1").val()) {
    this._optionImg = "option1";
    this._img = $("#img1").val()
  } else if ($("#img2").val()) {
    this._optionImg = "option2";
    this._img = $("#img2").val()
  } else {alert("Error")}
};
$("#send-form").on("click", function(){
  var Params = new Collect_Params();
  var Str = JSON.stringify(Params);
  alert(Str);
})
