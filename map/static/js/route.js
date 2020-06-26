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

function route() {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/m/2",
    dataType: "json",
    data: {
      type: "FindRoute",
      position: [113, 23],
    },
    success: function (response) {
      var res = response.objects;
      arr.forEach((point, index, res) => {
        var place = point["Place"];
        var Lat = point["Lat"];
        var Lng = point["Lng"];
        alert(place);
        pinOn(Lat, Lng);
        var duration = point["Route"]["duration"];
        L.polyline([point["Route"]["steps"]], { color: "blue" })
          .addTo(map)
          .bindPopup(duration);
      });
    },
  });
}
// locate();
loadData();
