var user = "integraciones.visanet@necomplus.com";
var password = "d5e7nk$M";

var urlApiSeguridad = "https://apitestenv.vnforapps.com/api.security/v1/security";
var urlApiSesion = "https://apitestenv.vnforapps.com/api.ecommerce/v2/ecommerce/token/session/";

var urlJs = "https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true";

function pagar() {
  generarToken();
}

function generarToken() {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlApiSeguridad,
    "method": "POST",
    "headers": {
      "Authorization": "Basic aW50ZWdyYWNpb25lcy52aXNhbmV0QG5lY29tcGx1cy5jb206ZDVlN25rJE0=",
      "Accept": "*/*"
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    generarSesion(response);
    localStorage.setItem("token", response);
  });
}

function generarSesion(token) {

  var merchantId = document.getElementById("merchantId").value;
  var importe = document.getElementById("importe").value;
  console.log('importe: ', importe);

  var data = {
    "amount": importe,
    "antifraud": null,
    "channel": "web",
    "recurrenceMaxAmount": null
  };

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlApiSesion + merchantId,
    "method": "POST",
    "headers": {
      "Authorization": token,
      "Content-Type": "application/json",
    },
    "processData": false,
    "data": JSON.stringify(data)
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    generarBoton(response['sessionKey']);
  });
}

function generarBoton(sessionKey) {
  var merchantId = document.getElementById("merchantId").value;
  var moneda = document.getElementById("moneda").value;
  var nombre = document.getElementById("nombre").value;
  var apellido = document.getElementById("apellido").value;
  var importe = document.getElementById("importe").value;
  var email = document.getElementById("email").value;

  var json = {
    "merchantId": merchantId,
    "moneda": moneda,
    "nombre": nombre,
    "apellido": apellido,
    "importe": importe,
    "email": email
  }

  localStorage.setItem("data", JSON.stringify(json));

  let form = document.createElement("form");
  form.setAttribute('method', "post");
  form.setAttribute('action', "http://localhost/boton_js");
  form.setAttribute('id', "boton_pago");
  document.getElementById("btn_pago").appendChild(form);

  let scriptEl = document.createElement('script');
  scriptEl.setAttribute('src', urlJs);
  scriptEl.setAttribute('data-sessiontoken', sessionKey);
  scriptEl.setAttribute('data-merchantid', merchantId);
  scriptEl.setAttribute('data-purchasenumber', 51465465);
  scriptEl.setAttribute('data-channel', 'web');
  scriptEl.setAttribute('data-amount', importe);
  scriptEl.setAttribute('data-cardholdername', nombre);
  scriptEl.setAttribute('data-cardholderlastname', apellido);
  scriptEl.setAttribute('data-cardholderemail', email);
  scriptEl.setAttribute('data-timeouturl', 'http://localhost/boton_js');
  document.getElementById("boton_pago").appendChild(scriptEl);

}