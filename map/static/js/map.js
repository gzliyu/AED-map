const map = L.map("mapDiv", {
  crs: L.CRS.EPSG3857,
  zoomControl: true,
  minZoom: 1,
  attributionControl: true,
  zoomAnimation: true, //缩放是否带动画
}).setView([39.9075, 116.38805555555555], 10);

var mapbox_url =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";

L.tileLayer(mapbox_url, {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1,
  accessToken:
    "pk.eyJ1IjoiZ3psaXl1IiwiYSI6ImNrOGg4NmpzejA5cjkzcXJ5emhtM3h1N3cifQ.P_C43vvgi7Wqyg63tk_Bsw",
}).addTo(map);

var locate = function () {
  var options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;
    L.circleMarker([crd.latitude, crd.longitude])
      .addTo(map)
      .bindPopup("You are here!");
    L.circle([crd.latitude, crd.longitude], crd.accuracy / 2).addTo(map);
    map.panTo([crd.latitude, crd.longitude], {
      animate: true,
    });
  }

  function error(err) {
    console.warn("ERROR(" + err.code + "): " + err.message);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
};

var pinOn = function (Lat, Lnt, theme) {
  L.marker([Lat, Lnt], { icon: LocateIcon }).addTo(map);
};
var loadData = function () {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/m/2",
    dataType: "json",
    success: function (response) {
      var arr = response.objects;

      arr.forEach((point, index, arr) => {
        var Lat = point["Lat"];
        var Lng = point["Lnt"];
        var des = point["des"];
        pinOn(Lat, Lng);
      });
    },
  });
};

// locate();
loadData();
// loadData();
