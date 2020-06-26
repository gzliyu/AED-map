function route() {
  $.ajax({
    type: "GET",
    url:
      'http://127.0.0.1:8000/m/{"type": "FindRoute", "Lat": 23.185217, "Place": "hhhhhhh", "Lng":113.478258}',
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
route();
