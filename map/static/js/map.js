// ----------------------------地图初始化----------------------------
// 设置leaflet的地图样式
// 坐标系：wgs84，
// setView：初始化时地图中心，第二个参数是缩放比例
const map = L.map("mapDiv", {
  crs: L.CRS.EPSG3857,
  zoomControl: true,
  minZoom: 1,
  attributionControl: true,
  zoomAnimation: true, //缩放是否带动画
}).setView([39.9075, 116.38805555555555], 10);
// 地图样式，可以到mapbox自定义一幅地图，然后插入url

var mapbox_url = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";

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
alert("map loaded")

// ----------------------------通过调用geolocate，定位，但似乎是基于网络而不是gps定位的，不太准----------------------------
function geolocate() {
  alert("locating your position which may takes a few seconds...")
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
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
    return crd;
  }

  function error(err) {
    console.warn("ERROR(" + err.code + "): " + err.message);
    return [0, 0];
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
}

// ----------------------------通过调用loadPosData显示所有设备的位置----------------------------
var pinOn = function (Lat, Lnt, theme) {
  L.marker([Lat, Lnt], { icon: LocateIcon }).addTo(map);
};
var loadPosData = function () {
  let request_url =
    'http://127.0.0.1:8000/m/{"type": "NotFindRoute",' +
    '"Lat":' +
    Lat +
    ', "Place": "hhhhhhh", "Lng":' +
    Lng +
    "}";
  $.ajax({
    type: "GET",
    url: request_url,
    dataType: "json",
    success: function (response) {
      var arr = response.objects;
      arr.forEach((point, index, arr) => {
        var Lat = point["Lat"];
        var Lng = point["Lng"];
        pinOn(Lat, Lng);
      });
    },
  });
};

// ----------------------------通过调用route(),给出到最近设备的路线----------------------------
function route() {
  let request_url =
    'http://127.0.0.1:8000/m/{"type": "FindRoute",' +
    '"Lat":' +
    Lat +
    ', "Place": "hhhhhhh", "Lng":' +
    Lng +
    "}";
  $.ajax({
    type: "GET",
    url: request_url,
    dataType: "json",
    data: {
      type: "FindRoute",
      position: [113, 23],
    },
    success: function (response) {
      var res = response.objects;
      res.forEach((point, index, res) => {
        var place = point["Place"];
        var Lat = point["Lat"];
        var Lng = point["Lng"];
        var duration = point["Route"]["duration"];
        L.polyline([point["Route"]["steps"]], { color: "blue" })
          .addTo(map)
          .bindPopup(duration);
      });
    },
  });
}

