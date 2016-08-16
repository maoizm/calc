/**
 * Created by mao on 10.08.2016.
 */

function isInt(n) {
  return Math.floor(n) == n && $.isNumeric(n);
}

$("#pcNumber").on('input', function () {
  var input=$(this);
  var v=input.val();
  if( !isInt(v) || v < 1 ) {
    input.parent().removeClass("has-success").addClass("has-error");
  } else {
    input.parent().removeClass("has-error").addClass("has-success");
  }
});


// $("#serverNumber").on('input', function () {
//   var input=$(this);
//   var v=input.val();
//   if( !isInt(v) || v < 0 ) {
//     input.parent().removeClass("has-success").addClass("has-error");
//     // $("#serverVirtualNumber").parent().removeClass("has-success").addClass("has-error");
//   } else if( v < $("#serverVirtualNumber").val() ) {
//     input.parent().removeClass("has-success").addClass("has-error");
//     $("#serverVirtualNumber").parent().removeClass("has-success").addClass("has-error");
//   } else {
//     input.parent().removeClass("has-error").addClass("has-success");
//     //$("#serverVirtualNumber").parent().removeClass("has-error").addClass("has-success");
//   }
// });
//
// $("#serverVirtualNumber").on('input', function () {
//   var input=$(this);
//   var v=input.val();
//   if( !isInt(v) || v < 0 ) {
//     input.parent().removeClass("has-success").addClass("has-error");
//     // $("#serverNumber").parent().removeClass("has-success").addClass("has-error");
//   } else if( v > $("#serverNumber").val() ) {
//     input.parent().removeClass("has-success").addClass("has-error");
//     $("#serverNumber").parent().removeClass("has-success").addClass("has-error");
//   } else {
//     input.parent().removeClass("has-error").addClass("has-success");
//     //$("#serverNumber").parent().removeClass("has-error").addClass("has-success");
//   }
// });

function calcTotal() {
  var nPC=$("#pcNumber").val() || 0;
  var nServ=$("#serverNumber").val() || 0;
  var nServVirtual=$("#serverVirtualNumber").val() || 0;
  var SLA=$('input[name=SLA]:checked', '#calcForm').val();
  var nVisits=SLA.substring(3,4);
  return Math.trunc(Math.random()*9000+1000)+" "+nPC+" "+nServ+" "+nServVirtual+" "+SLA;
}


$("#am_Recalculate").click(function () {
  $("#am_Total").html(calcTotal()+" UAH");
});