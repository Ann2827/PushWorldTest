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
/*$("#send-form").on("click", function(){
  var Params = new Collect_Params();
  var Str = JSON.stringify(Params);
  alert(Str);
});*/
$(function(){
  $("#form2").on("submit", function(event){
    // Преобразуем форму в массив
    //alert("123");
    
    //var form_data = $("#form2").serializeArray;
//alert(form_data);
    //console.log( $(this).serialize() );
    event.preventDefault();
    $.ajax({
      url: "test.php",
      type: "post", // Делаем POST запрос
      data: {
        "img1": $("#img1").val()
      },
      success: function(){alert("success")}
    });
    
  });
  //return false;
});

//$("#form2").on