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

  var price = {
    pc: [10, 8, 5.5],
    server: [28, 23, 16],
    virtServer: [23, 19, 12.5],
    emergencyVisit: [27, 23, 19],
    planVisit: [19, 19, 19],
    inflation: {
      "01_2015": 19.83,
      "02_2015": 20.88,
      "03_2015": 23.13,
      "04_2015": 26.37,
      "05_2015": 26.95,
      "06_2015": 27.06,
      "07_2015": 26.79,
      "08_2015": 26.57,
      "09_2015": 27.18,
      "10_2015": 26.83,
      "11_2015": 27.37,
      "12_2015": 27.56,
      "01_2016": 27.81,
      "02_2016": 27.70,
      "03_2016": 27.97,
      "04_2016": 28.95,
      "05_2016": 28.98,
      "06_2016": 28.92,
      "07_2016": 28.89,
      "08_2016": 29.89
    }
  };

  var nPC=$("#pcNumber").val() || 0;
  var nServ=$("#serverNumber").val() || 0;
  var nVirtServ=$("#serverVirtualNumber").val() || 0;
  var nTotalServ = nServ + nVirtServ;
  var SLA=$("input[name=SLA]:checked", "#calcForm").val();
  var nPlanVisits=$("input[name=nVisitsSLA"+SLA+"]").val();
  var standardPrice = nPC*price.pc[SLA-1] + nServ*price.server[SLA-1] + nVirtServ*price.virtServer[SLA-1] + nPlanVisits*price.planVisit[SLA-1];
  var discount = Math.max( nPC<20       ? 0 : nPC<40        ? 0.1 : nPC<60  ?  0.2 : 0.25 ,
                           nTotalServ<6 ? 0 : nTotalServ<12 ? 0.1 : 0.15
                 );
  var d = new Date();
  var monthNumber = d.getMonth();
  monthNumber = ( monthNumber < 10 ? "0" : "" ) + monthNumber;
  monthYear = monthNumber + "_" + d.getFullYear();
  var euroRate = price.inflation[monthYear];
  return Math.round(standardPrice * (1 - discount) * euroRate);
}


$("#am_Recalculate").click(function () {
  $("#am_Total").html(calcTotal()+" UAH");
});