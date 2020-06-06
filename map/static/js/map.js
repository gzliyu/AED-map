const map = L.map("mapDiv", {
  crs: L.CRS.EPSG3857,
  zoomControl: true,
  minZoom: 1,
  attributionControl: true,
  zoomAnimation: true, //缩放是否带动画
}).setView([23.1008, 113.26472], 10);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    //   attribution:
    //     'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiZ3psaXl1IiwiYSI6ImNrOGg4NmpzejA5cjkzcXJ5emhtM3h1N3cifQ.P_C43vvgi7Wqyg63tk_Bsw",
  }
).addTo(map);
map.locate({
  setView: true,
  maxZoom: 16,
});

// var loadData = function () {
//   $.ajax(
//     { host_url } +
//       str({
//         lat: { lat },
//         lot: { lot },
//       }),
//     {
//       dataType: "json",
//       success: function (response) {
//         geojsonFeature = response;

//         var geojsonMarkerOptions = {
//           radius: 5,
//           fillColor: "#00FF00",
//           color: "#000",
//           weight: 1,
//           opacity: 1,
//           fillOpacity: 0.8,
//         };
//         L.geoJSON(response, {
//           pointToLayer: function (feature, latlng) {
//             return L.circleMarker(latlng, geojsonMarkerOptions);
//           },
//         }).addTo(map);
//       },
//     }
//   );
// };

var locate = function () {
  map.locate({
    setView: true,
    maxZoom: 16,
  });
  map.on("locationfound", function (e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(map).bindPopup("你就在这个圈内");
    L.circle(e.latlng, radius).addTo(map);
  });
};

// loadData();
locate();
