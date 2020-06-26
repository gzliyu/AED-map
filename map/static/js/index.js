function FOSSGISEngine(t, r) {
  var s = [];
  return {
    id: t,
    creditline:
      '<a href="https://routing.openstreetmap.de/about.html" target="_blank">FOSSGIS Routing Service</a>',
    draggable: !0,
    _transformSteps: function (t, d) {
      var u = {
          continue: "javascripts.directions.instructions.continue",
          "merge right": "javascripts.directions.instructions.merge_right",
          "merge left": "javascripts.directions.instructions.merge_left",
          "off ramp right": "javascripts.directions.instructions.offramp_right",
          "off ramp left": "javascripts.directions.instructions.offramp_left",
          "on ramp right": "javascripts.directions.instructions.onramp_right",
          "on ramp left": "javascripts.directions.instructions.onramp_left",
          "fork right": "javascripts.directions.instructions.fork_right",
          "fork left": "javascripts.directions.instructions.fork_left",
          "end of road right":
            "javascripts.directions.instructions.endofroad_right",
          "end of road left":
            "javascripts.directions.instructions.endofroad_left",
          "turn straight": "javascripts.directions.instructions.continue",
          "turn slight right":
            "javascripts.directions.instructions.slight_right",
          "turn right": "javascripts.directions.instructions.turn_right",
          "turn sharp right": "javascripts.directions.instructions.sharp_right",
          "turn uturn": "javascripts.directions.instructions.uturn",
          "turn sharp left": "javascripts.directions.instructions.sharp_left",
          "turn left": "javascripts.directions.instructions.turn_left",
          "turn slight left": "javascripts.directions.instructions.slight_left",
          roundabout: "javascripts.directions.instructions.roundabout",
          rotary: "javascripts.directions.instructions.roundabout",
          "exit roundabout":
            "javascripts.directions.instructions.exit_roundabout",
          "exit rotary": "javascripts.directions.instructions.exit_roundabout",
          depart: "javascripts.directions.instructions.start",
          arrive: "javascripts.directions.instructions.destination",
        },
        p = {
          continue: 0,
          "merge right": 21,
          "merge left": 20,
          "off ramp right": 24,
          "off ramp left": 25,
          "on ramp right": 2,
          "on ramp left": 6,
          "fork right": 18,
          "fork left": 19,
          "end of road right": 22,
          "end of road left": 23,
          "turn straight": 0,
          "turn slight right": 1,
          "turn right": 2,
          "turn sharp right": 3,
          "turn uturn": 4,
          "turn slight left": 5,
          "turn left": 6,
          "turn sharp left": 7,
          roundabout: 10,
          rotary: 10,
          "exit roundabout": 10,
          "exit rotary": 10,
          depart: 8,
          arrive: 14,
        },
        h = function (t) {
          return [
            "first",
            "second",
            "third",
            "fourth",
            "fifth",
            "sixth",
            "seventh",
            "eighth",
            "ninth",
            "tenth",
          ][t - 1];
        };
      return t.map(function (t, e) {
        var n;
        switch (t.maneuver.type) {
          case "on ramp":
          case "off ramp":
          case "merge":
          case "end of road":
          case "fork":
            n =
              t.maneuver.type +
              " " +
              (0 <= t.maneuver.modifier.indexOf("left") ? "left" : "right");
            break;
          case "depart":
          case "arrive":
          case "roundabout":
          case "rotary":
          case "exit roundabout":
          case "exit rotary":
            n = t.maneuver.type;
            break;
          case "roundabout turn":
          case "turn":
          default:
            n = "turn " + t.maneuver.modifier;
        }
        var o = u[n],
          i = L.PolylineUtil.decode(t.geometry, { precision: 5 }).map(function (
            t
          ) {
            return L.latLng(t);
          });
        Array.prototype.push.apply(d, i);
        var a,
          r = "<b>" + (e + 1) + ".</b> ",
          s = "<b>" + t.destinations + "</b>",
          c = !0;
        if (
          (t.name && t.ref
            ? (a = "<b>" + t.name + " (" + t.ref + ")</b>")
            : t.name
            ? (a = "<b>" + t.name + "</b>")
            : t.ref
            ? (a = "<b>" + t.ref + "</b>")
            : ((a = I18n.t("javascripts.directions.instructions.unnamed")),
              (c = !1)),
          t.maneuver.type.match(/^exit (rotary|roundabout)$/))
        )
          r += I18n.t(o, { name: a });
        else if (t.maneuver.type.match(/^(rotary|roundabout)$/))
          t.maneuver.exit
            ? t.maneuver.exit <= 10
              ? (r += I18n.t(o + "_with_exit_ordinal", {
                  exit: I18n.t(
                    "javascripts.directions.instructions.exit_counts." +
                      h(t.maneuver.exit)
                  ),
                  name: a,
                }))
              : (r += I18n.t(o + "_with_exit", {
                  exit: t.maneuver.exit,
                  name: a,
                }))
            : (r += I18n.t(o + "_without_exit", { name: a }));
        else if (t.maneuver.type.match(/^(on ramp|off ramp)$/)) {
          var l = {};
          t.exits &&
            t.maneuver.type.match(/^(off ramp)$/) &&
            (l.exit = t.exits),
            t.destinations && (l.directions = s),
            c && (l.directions = a),
            0 < Object.keys(l).length &&
              (o = o + "_with_" + Object.keys(l).join("_")),
            (r += I18n.t(o, l));
        } else r += I18n.t(o + "_without_exit", { name: a });
        return [
          [t.maneuver.location[1], t.maneuver.location[0]],
          p[n],
          r,
          t.distance,
          i,
        ];
      });
    },
    getRoute: function (t, i) {
      var e = [
        { name: "overview", value: "false" },
        { name: "geometries", value: "polyline" },
        { name: "steps", value: !0 },
      ];
      s.length === t.length
        ? e.push({ name: "hints", value: s.join(";") })
        : (s = []);
      var n = t
          .map(function (t) {
            return t.lng + "," + t.lat;
          })
          .join(";"),
        o = OSM.FOSSGIS_OSRM_URL + "routed-" + r + "/route/v1/driving/" + n,
        a = function (t) {
          if ("Ok" !== t.code) return i(!0);
          s = t.waypoints.map(function (t) {
            return t.hint;
          });
          var e = [],
            n = function (t) {
              return this._transformSteps(t.steps, e);
            },
            o = [].concat.apply([], t.routes[0].legs.map(n.bind(this)));
          i(!1, {
            line: e,
            steps: o,
            distance: t.routes[0].distance,
            time: t.routes[0].duration,
          });
        };
      return $.ajax({
        url: o,
        data: e,
        dataType: "json",
        success: a.bind(this),
        error: function () {
          i(!0);
        },
      });
    },
  };
}
function GraphHopperEngine(t, e) {
  var m = {
    "-3": 7,
    "-2": 6,
    "-1": 5,
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 14,
    5: 14,
    6: 10,
  };
  return {
    id: t,
    creditline:
      '<a href="https://www.graphhopper.com/" target="_blank">Graphhopper</a>',
    draggable: !1,
    getRoute: function (t, h) {
      return $.ajax({
        url: OSM.GRAPHHOPPER_URL,
        data: {
          vehicle: e,
          locale: I18n.currentLocale(),
          key: "LijBPDQGfu7Iiq80w3HzwB4RUDJbMbhs6BU0dEnn",
          "ch.disable": "car" === e,
          elevation: !1,
          instructions: !0,
          point: t.map(function (t) {
            return t.lat + "," + t.lng;
          }),
        },
        traditional: !0,
        dataType: "json",
        success: function (t) {
          if (!t.paths || 0 === t.paths.length) return h(!0);
          for (
            var e = t.paths[0],
              n = L.PolylineUtil.decode(e.points),
              o = [],
              i = e.instructions.length,
              a = 0;
            a < i;
            a++
          ) {
            var r = e.instructions[a],
              s = a === i - 1 ? 14 : m[r.sign],
              c = "<b>" + (a + 1) + ".</b> ";
            c += r.text;
            for (
              var l = n[r.interval[0]],
                d = r.distance,
                u = [],
                p = r.interval[0];
              p <= r.interval[1];
              p++
            )
              u.push({ lat: n[p][0], lng: n[p][1] });
            o.push([{ lat: l[0], lng: l[1] }, s, c, d, u]);
          }
          h(!1, {
            line: n,
            steps: o,
            distance: e.distance,
            time: e.time / 1e3,
            ascend: e.ascend,
            descend: e.descend,
          });
        },
        error: function () {
          h(!0);
        },
      });
    },
  };
}
$(document).ready(function () {
  function n(t, e) {
    var n,
      o = !1,
      i = {
        left: t.getWest() - 1e-4,
        top: t.getNorth() + 1e-4,
        right: t.getEast() + 1e-4,
        bottom: t.getSouth() - 1e-4,
      };
    (n = "http://127.0.0.1:8111/load_and_zoom?"),
      e && (i.select = e.type + e.id);
    var a = $("<iframe>")
      .hide()
      .appendTo("body")
      .attr("src", n + r.stringify(i))
      .on("load", function () {
        $(this).remove(), (o = !0);
      });
    return (
      setTimeout(function () {
        o || (alert(I18n.t("site.index.remote_failed")), a.remove());
      }, 1e3),
      !1
    );
  }
  var i,
    r = require("querystring-component"),
    a = new L.OSM.Map("map", {
      zoomControl: !1,
      layerControl: !1,
      contextmenu: !0,
    });
  OSM.loadSidebarContent = function (t, o) {
    var e = t;
    a.setSidebarOverlaid(!1),
      clearTimeout(i),
      (i = setTimeout(function () {
        $("#sidebar_loader").show();
      }, 200)),
      0 <= e.indexOf("?") ? (e += "&xhr=1") : (e += "?xhr=1"),
      $("#sidebar_content").empty(),
      $.ajax({
        url: e,
        dataType: "html",
        complete: function (t) {
          clearTimeout(i), $("#flash").empty(), $("#sidebar_loader").hide();
          var e = $(t.responseText);
          if (t.getResponseHeader("X-Page-Title")) {
            var n = t.getResponseHeader("X-Page-Title");
            document.title = decodeURIComponent(n);
          }
          $("head").find('link[type="application/atom+xml"]').remove(),
            $("head").append(e.filter('link[type="application/atom+xml"]')),
            $("#sidebar_content").html(
              e.not('link[type="application/atom+xml"]')
            ),
            o && o();
        },
      });
  };
  var t = OSM.mapParams();
  a.attributionControl.setPrefix(""),
    a.updateLayers(t.layers),
    a.on("baselayerchange", function (t) {
      a.getZoom() > t.layer.options.maxZoom &&
        a.setView(a.getCenter(), t.layer.options.maxZoom, { reset: !0 });
    });
  var e = "rtl" === $("html").attr("dir") ? "topleft" : "topright";
  L.OSM.zoom({ position: e }).addTo(a);
  var o = L.control
    .locate({
      position: e,
      icon: "icon geolocate",
      iconLoading: "icon geolocate",
      strings: {
        title: I18n.t("javascripts.map.locate.title"),
        metersUnit: I18n.t("javascripts.map.locate.metersUnit"),
        feetUnit: I18n.t("javascripts.map.locate.feetUnit"),
        popup: I18n.t("javascripts.map.locate.popup"),
      },
    })
    .addTo(a)
    .getContainer();
  $(o)
    .removeClass("leaflet-control-locate leaflet-bar")
    .addClass("control-locate")
    .children("a")
    .attr("href", "#")
    .removeClass("leaflet-bar-part leaflet-bar-part-single")
    .addClass("control-button");
  var s = L.OSM.sidebar("#map-ui").addTo(a);
  L.OSM.layers({ position: e, layers: a.baseLayers, sidebar: s }).addTo(a),
    L.OSM.key({ position: e, sidebar: s }).addTo(a),
    L.OSM.share({ position: e, sidebar: s, short: !0 }).addTo(a),
    L.OSM.note({ position: e, sidebar: s }).addTo(a),
    L.OSM.query({ position: e, sidebar: s }).addTo(a),
    L.control.scale().addTo(a),
    OSM.initializeContextMenu(a),
    "api_offline" !== OSM.STATUS &&
      "database_offline" !== OSM.STATUS &&
      (OSM.initializeNotes(a),
      0 <= t.layers.indexOf(a.noteLayer.options.code) &&
        a.addLayer(a.noteLayer),
      OSM.initializeBrowse(a),
      0 <= t.layers.indexOf(a.dataLayer.options.code) &&
        a.addLayer(a.dataLayer),
      0 <= t.layers.indexOf(a.gpsLayer.options.code) && a.addLayer(a.gpsLayer));
  var c = "rtl" === $("html").attr("dir") ? "right" : "left";
  $(".leaflet-control .control-button").tooltip({
    placement: c,
    container: "body",
  });
  var l = new Date();
  l.setYear(l.getFullYear() + 10),
    a.on("moveend layeradd layerremove", function () {
      updateLinks(
        a.getCenter().wrap(),
        a.getZoom(),
        a.getLayersCode(),
        a._object
      ),
        $.removeCookie("_osm_location"),
        $.cookie("_osm_location", OSM.locationCookie(a), {
          expires: l,
          path: "/",
        });
    }),
    "hide" !== $.cookie("_osm_welcome") && $(".welcome").addClass("visible"),
    $(".welcome .close-wrap").on("click", function () {
      $(".welcome").removeClass("visible"),
        $.cookie("_osm_welcome", "hide", { expires: l, path: "/" });
    });
  var d = new Date();
  d.setYear(d.getFullYear() + 1),
    $("#banner .close-wrap").on("click", function (t) {
      var e = t.target.id;
      $("#banner").hide(),
        t.preventDefault(),
        e && $.cookie(e, "hide", { expires: d, path: "/" });
    }),
    OSM.PIWIK &&
      a.on("layeradd", function (t) {
        if (t.layer.options) {
          var e = OSM.PIWIK.goals[t.layer.options.keyid];
          e && $("body").trigger("piwikgoal", e);
        }
      }),
    t.bounds ? a.fitBounds(t.bounds) : a.setView([t.lat, t.lon], t.zoom),
    t.marker && L.marker([t.mlat, t.mlon]).addTo(a),
    $("#homeanchor").on("click", function (t) {
      t.preventDefault();
      var e = $(this).data(),
        n = L.latLng(e.lat, e.lon);
      a.setView(n, e.zoom), L.marker(n, { icon: OSM.getUserIcon() }).addTo(a);
    }),
    $("a[data-editor=remote]").click(function (t) {
      var e = OSM.mapParams(this.search);
      n(a.getBounds(), e.object), t.preventDefault();
    }),
    OSM.params().edit_help &&
      ($("#editanchor")
        .removeAttr("title")
        .tooltip({
          placement: "bottom",
          title: I18n.t("javascripts.edit_help"),
        })
        .tooltip("show"),
      $("body").one("click", function () {
        $("#editanchor").tooltip("hide");
      })),
    (OSM.Index = function (e) {
      var t = {};
      return (
        (t.pushstate = t.popstate = function () {
          e.setSidebarOverlaid(!0),
            (document.title = I18n.t("layouts.project_name.title"));
        }),
        (t.load = function () {
          var t = r.parse(location.search.substring(1));
          return (
            t.query &&
              $("#sidebar .search_form input[name=query]").value(t.query),
            "autofocus" in document.createElement("input") ||
              $("#sidebar .search_form input[name=query]").focus(),
            e.getState()
          );
        }),
        t
      );
    }),
    (OSM.Browse = function (o, n) {
      function i(t, e, n) {
        o.addObject({ type: t, id: parseInt(e, 10) }, function (t) {
          window.location.hash ||
            !t.isValid() ||
            (!n && o.getBounds().contains(t)) ||
            OSM.router.withoutMoveListener(function () {
              o.fitBounds(t);
            });
        }),
          $(".colour-preview-box").each(function () {
            $(this).css("background-color", $(this).data("colour"));
          });
      }
      var t = {};
      return (
        (t.pushstate = t.popstate = function (t, e) {
          OSM.loadSidebarContent(t, function () {
            i(n, e);
          });
        }),
        (t.load = function (t, e) {
          i(n, e, !0);
        }),
        (t.unload = function () {
          o.removeObject();
        }),
        t
      );
    });
  var u = OSM.History(a);
  (OSM.router = OSM.Router(a, {
    "/": OSM.Index(a),
    "/search": OSM.Search(a),
    "/directions": OSM.Directions(a),
    "/export": OSM.Export(a),
    "/note/new": OSM.NewNote(a),
    "/history/friends": u,
    "/history/nearby": u,
    "/history": u,
    "/user/:display_name/history": u,
    "/note/:id": OSM.Note(a),
    "/node/:id(/history)": OSM.Browse(a, "node"),
    "/way/:id(/history)": OSM.Browse(a, "way"),
    "/relation/:id(/history)": OSM.Browse(a, "relation"),
    "/changeset/:id": OSM.Changeset(a),
    "/query": OSM.Query(a),
  })),
    "remote" === OSM.preferred_editor &&
      "/edit" === document.location.pathname &&
      (n(a.getBounds(), t.object), OSM.router.setCurrentPath("/")),
    OSM.router.load(),
    $(document).on("click", "a", function (t) {
      t.isDefaultPrevented() ||
        t.isPropagationStopped() ||
        1 < t.which ||
        t.metaKey ||
        t.ctrlKey ||
        t.shiftKey ||
        t.altKey ||
        (location.protocol === this.protocol &&
          location.host === this.host &&
          OSM.router.route(this.pathname + this.search + this.hash) &&
          t.preventDefault());
    });
}),
  (L.OSM.sidebar = function (t) {
    var n,
      e = {},
      o = $(t),
      i = $(),
      a = $();
    return (
      (e.addTo = function (t) {
        return (n = t), e;
      }),
      (e.addPane = function (t) {
        t.hide().appendTo(o);
      }),
      (e.togglePane = function (t, e) {
        i.hide().trigger("hide"),
          a.removeClass("active"),
          i === t
            ? ($(o).hide(), (i = a = $()))
            : ($(o).show(), (i = t), (a = e || $())),
          n.invalidateSize({ pan: !1, animate: !1 }),
          i.show().trigger("show"),
          a.addClass("active");
      }),
      e
    );
  }),
  (function (t, e) {
    "function" == typeof define && define.amd
      ? define(["leaflet"], t)
      : "object" == typeof exports &&
        (void 0 !== e && e.L
          ? (module.exports = t(L))
          : (module.exports = t(require("leaflet")))),
      void 0 !== e && e.L && (e.L.Control.Locate = t(L));
  })(function (c) {
    var n = function (e, n, t) {
        (t = t.split(" ")).forEach(function (t) {
          c.DomUtil[e].call(this, n, t);
        });
      },
      e = function (t, e) {
        n("addClass", t, e);
      },
      o = function (t, e) {
        n("removeClass", t, e);
      },
      t = c.Marker.extend({
        initialize: function (t, e) {
          c.Util.setOptions(this, e), (this._latlng = t), this.createIcon();
        },
        createIcon: function () {
          var t = this.options,
            e = "";
          t.color !== undefined && (e += "stroke:" + t.color + ";"),
            t.weight !== undefined && (e += "stroke-width:" + t.weight + ";"),
            t.fillColor !== undefined && (e += "fill:" + t.fillColor + ";"),
            t.fillOpacity !== undefined &&
              (e += "fill-opacity:" + t.fillOpacity + ";"),
            t.opacity !== undefined && (e += "opacity:" + t.opacity + ";");
          var n = this._getIconSVG(t, e);
          (this._locationIcon = c.divIcon({
            className: n.className,
            html: n.svg,
            iconSize: [n.w, n.h],
          })),
            this.setIcon(this._locationIcon);
        },
        _getIconSVG: function (t, e) {
          var n = t.radius,
            o = n + t.weight,
            i = 2 * o;
          return {
            className: "leaflet-control-locate-location",
            svg:
              '<svg xmlns="http://www.w3.org/2000/svg" width="' +
              i +
              '" height="' +
              i +
              '" version="1.1" viewBox="-' +
              o +
              " -" +
              o +
              " " +
              i +
              " " +
              i +
              '"><circle r="' +
              n +
              '" style="' +
              e +
              '" /></svg>',
            w: i,
            h: i,
          };
        },
        setStyle: function (t) {
          c.Util.setOptions(this, t), this.createIcon();
        },
      }),
      i = t.extend({
        initialize: function (t, e, n) {
          c.Util.setOptions(this, n),
            (this._latlng = t),
            (this._heading = e),
            this.createIcon();
        },
        setHeading: function (t) {
          this._heading = t;
        },
        _getIconSVG: function (t, e) {
          var n = t.radius,
            o = t.width + t.weight,
            i = 2 * (n + t.depth + t.weight),
            a = "M0,0 l" + t.width / 2 + "," + t.depth + " l-" + o + ",0 z";
          return {
            className: "leaflet-control-locate-heading",
            svg:
              '<svg xmlns="http://www.w3.org/2000/svg" width="' +
              o +
              '" height="' +
              i +
              '" version="1.1" viewBox="-' +
              o / 2 +
              " 0 " +
              o +
              " " +
              i +
              '" style="' +
              ("transform: rotate(" + this._heading + "deg)") +
              '"><path d="' +
              a +
              '" style="' +
              e +
              '" /></svg>',
            w: o,
            h: i,
          };
        },
      }),
      a = c.Control.extend({
        options: {
          position: "topleft",
          layer: undefined,
          setView: "untilPanOrZoom",
          keepCurrentZoomLevel: !1,
          initialZoomLevel: !1,
          getLocationBounds: function (t) {
            return t.bounds;
          },
          flyTo: !1,
          clickBehavior: {
            inView: "stop",
            outOfView: "setView",
            inViewNotFollowing: "inView",
          },
          returnToPrevBounds: !1,
          cacheLocation: !0,
          drawCircle: !0,
          drawMarker: !0,
          showCompass: !0,
          markerClass: t,
          compassClass: i,
          circleStyle: {
            className: "leaflet-control-locate-circle",
            color: "#136AEC",
            fillColor: "#136AEC",
            fillOpacity: 0.15,
            weight: 0,
          },
          markerStyle: {
            className: "leaflet-control-locate-marker",
            color: "#fff",
            fillColor: "#2A93EE",
            fillOpacity: 1,
            weight: 3,
            opacity: 1,
            radius: 9,
          },
          compassStyle: {
            fillColor: "#2A93EE",
            fillOpacity: 1,
            weight: 0,
            color: "#fff",
            opacity: 1,
            radius: 9,
            width: 9,
            depth: 6,
          },
          followCircleStyle: {},
          followMarkerStyle: {},
          followCompassStyle: {},
          icon: "fa fa-map-marker",
          iconLoading: "fa fa-spinner fa-spin",
          iconElementTag: "span",
          circlePadding: [0, 0],
          metric: !0,
          createButtonCallback: function (t, e) {
            var n = c.DomUtil.create(
              "a",
              "leaflet-bar-part leaflet-bar-part-single",
              t
            );
            return (
              (n.title = e.strings.title),
              { link: n, icon: c.DomUtil.create(e.iconElementTag, e.icon, n) }
            );
          },
          onLocationError: function (t) {
            alert(t.message);
          },
          onLocationOutsideMapBounds: function (t) {
            t.stop(), alert(t.options.strings.outsideMapBoundsMsg);
          },
          showPopup: !0,
          strings: {
            title: "Show me where I am",
            metersUnit: "meters",
            feetUnit: "feet",
            popup: "You are within {distance} {unit} from this point",
            outsideMapBoundsMsg:
              "You seem located outside the boundaries of the map",
          },
          locateOptions: { maxZoom: Infinity, watch: !0, setView: !1 },
        },
        initialize: function (t) {
          for (var e in t)
            "object" == typeof this.options[e]
              ? c.extend(this.options[e], t[e])
              : (this.options[e] = t[e]);
          (this.options.followMarkerStyle = c.extend(
            {},
            this.options.markerStyle,
            this.options.followMarkerStyle
          )),
            (this.options.followCircleStyle = c.extend(
              {},
              this.options.circleStyle,
              this.options.followCircleStyle
            )),
            (this.options.followCompassStyle = c.extend(
              {},
              this.options.compassStyle,
              this.options.followCompassStyle
            ));
        },
        onAdd: function (t) {
          var e = c.DomUtil.create(
            "div",
            "leaflet-control-locate leaflet-bar leaflet-control"
          );
          (this._layer = this.options.layer || new c.LayerGroup()),
            this._layer.addTo(t),
            (this._event = undefined),
            (this._compassHeading = null),
            (this._prevBounds = null);
          var n = this.options.createButtonCallback(e, this.options);
          return (
            (this._link = n.link),
            (this._icon = n.icon),
            c.DomEvent.on(this._link, "click", c.DomEvent.stopPropagation)
              .on(this._link, "click", c.DomEvent.preventDefault)
              .on(this._link, "click", this._onClick, this)
              .on(this._link, "dblclick", c.DomEvent.stopPropagation),
            this._resetVariables(),
            this._map.on("unload", this._unload, this),
            e
          );
        },
        _onClick: function () {
          this._justClicked = !0;
          var t = this._isFollowing();
          if (
            ((this._userPanned = !1),
            (this._userZoomed = !1),
            this._active && !this._event)
          )
            this.stop();
          else if (this._active && this._event !== undefined) {
            var e = this.options.clickBehavior,
              n = e.outOfView;
            switch (
              (this._map.getBounds().contains(this._event.latlng) &&
                (n = t ? e.inView : e.inViewNotFollowing),
              e[n] && (n = e[n]),
              n)
            ) {
              case "setView":
                this.setView();
                break;
              case "stop":
                if ((this.stop(), this.options.returnToPrevBounds))
                  (this.options.flyTo
                    ? this._map.flyToBounds
                    : this._map.fitBounds
                  ).bind(this._map)(this._prevBounds);
            }
          } else
            this.options.returnToPrevBounds &&
              (this._prevBounds = this._map.getBounds()),
              this.start();
          this._updateContainerStyle();
        },
        start: function () {
          this._activate(),
            this._event &&
              (this._drawMarker(this._map),
              this.options.setView && this.setView()),
            this._updateContainerStyle();
        },
        stop: function () {
          this._deactivate(),
            this._cleanClasses(),
            this._resetVariables(),
            this._removeMarker();
        },
        stopFollowing: function () {
          (this._userPanned = !0),
            this._updateContainerStyle(),
            this._drawMarker();
        },
        _activate: function () {
          if (
            !this._active &&
            (this._map.locate(this.options.locateOptions),
            (this._active = !0),
            this._map.on("locationfound", this._onLocationFound, this),
            this._map.on("locationerror", this._onLocationError, this),
            this._map.on("dragstart", this._onDrag, this),
            this._map.on("zoomstart", this._onZoom, this),
            this._map.on("zoomend", this._onZoomEnd, this),
            this.options.showCompass)
          ) {
            var t = "ondeviceorientationabsolute" in window;
            if (t || "ondeviceorientation" in window) {
              var e = this,
                n = function () {
                  c.DomEvent.on(
                    window,
                    t ? "deviceorientationabsolute" : "deviceorientation",
                    e._onDeviceOrientation,
                    e
                  );
                };
              DeviceOrientationEvent &&
              "function" == typeof DeviceOrientationEvent.requestPermission
                ? DeviceOrientationEvent.requestPermission().then(function (t) {
                    "granted" === t && n();
                  })
                : n();
            }
          }
        },
        _deactivate: function () {
          this._map.stopLocate(),
            (this._active = !1),
            this.options.cacheLocation || (this._event = undefined),
            this._map.off("locationfound", this._onLocationFound, this),
            this._map.off("locationerror", this._onLocationError, this),
            this._map.off("dragstart", this._onDrag, this),
            this._map.off("zoomstart", this._onZoom, this),
            this._map.off("zoomend", this._onZoomEnd, this),
            this.options.showCompass &&
              ((this._compassHeading = null),
              "ondeviceorientationabsolute" in window
                ? c.DomEvent.off(
                    window,
                    "deviceorientationabsolute",
                    this._onDeviceOrientation,
                    this
                  )
                : "ondeviceorientation" in window &&
                  c.DomEvent.off(
                    window,
                    "deviceorientation",
                    this._onDeviceOrientation,
                    this
                  ));
        },
        setView: function () {
          if ((this._drawMarker(), this._isOutsideMapBounds()))
            (this._event = undefined),
              this.options.onLocationOutsideMapBounds(this);
          else if (this._justClicked && !1 !== this.options.initialZoomLevel)
            (t = this.options.flyTo ? this._map.flyTo : this._map.setView).bind(
              this._map
            )(
              [this._event.latitude, this._event.longitude],
              this.options.initialZoomLevel
            );
          else if (this.options.keepCurrentZoomLevel) {
            (t = this.options.flyTo ? this._map.flyTo : this._map.panTo).bind(
              this._map
            )([this._event.latitude, this._event.longitude]);
          } else {
            var t = this.options.flyTo
              ? this._map.flyToBounds
              : this._map.fitBounds;
            (this._ignoreEvent = !0),
              t.bind(this._map)(this.options.getLocationBounds(this._event), {
                padding: this.options.circlePadding,
                maxZoom: this.options.locateOptions.maxZoom,
              }),
              c.Util.requestAnimFrame(function () {
                this._ignoreEvent = !1;
              }, this);
          }
        },
        _drawCompass: function () {
          if (this._event) {
            var t = this._event.latlng;
            if (
              this.options.showCompass &&
              t &&
              null !== this._compassHeading
            ) {
              var e = this._isFollowing()
                ? this.options.followCompassStyle
                : this.options.compassStyle;
              this._compass
                ? (this._compass.setLatLng(t),
                  this._compass.setHeading(this._compassHeading),
                  this._compass.setStyle && this._compass.setStyle(e))
                : (this._compass = new this.options.compassClass(
                    t,
                    this._compassHeading,
                    e
                  ).addTo(this._layer));
            }
            !this._compass ||
              (this.options.showCompass && null !== this._compassHeading) ||
              (this._compass.removeFrom(this._layer), (this._compass = null));
          }
        },
        _drawMarker: function () {
          function t() {
            return "string" == typeof s
              ? c.Util.template(s, { distance: e, unit: n })
              : "function" == typeof s
              ? s({ distance: e, unit: n })
              : s;
          }
          this._event.accuracy === undefined && (this._event.accuracy = 0);
          var e,
            n,
            o = this._event.accuracy,
            i = this._event.latlng;
          if (this.options.drawCircle) {
            var a = this._isFollowing()
              ? this.options.followCircleStyle
              : this.options.circleStyle;
            this._circle
              ? this._circle.setLatLng(i).setRadius(o).setStyle(a)
              : (this._circle = c.circle(i, o, a).addTo(this._layer));
          }
          if (
            (this.options.metric
              ? ((e = o.toFixed(0)), (n = this.options.strings.metersUnit))
              : ((e = (3.2808399 * o).toFixed(0)),
                (n = this.options.strings.feetUnit)),
            this.options.drawMarker)
          ) {
            var r = this._isFollowing()
              ? this.options.followMarkerStyle
              : this.options.markerStyle;
            this._marker
              ? (this._marker.setLatLng(i),
                this._marker.setStyle && this._marker.setStyle(r))
              : (this._marker = new this.options.markerClass(i, r).addTo(
                  this._layer
                ));
          }
          this._drawCompass();
          var s = this.options.strings.popup;
          this.options.showPopup &&
            s &&
            this._marker &&
            this._marker.bindPopup(t())._popup.setLatLng(i),
            this.options.showPopup &&
              s &&
              this._compass &&
              this._compass.bindPopup(t())._popup.setLatLng(i);
        },
        _removeMarker: function () {
          this._layer.clearLayers(),
            (this._marker = undefined),
            (this._circle = undefined);
        },
        _unload: function () {
          this.stop(), this._map.off("unload", this._unload, this);
        },
        _setCompassHeading: function (t) {
          !isNaN(parseFloat(t)) && isFinite(t)
            ? ((t = Math.round(t)),
              (this._compassHeading = t),
              c.Util.requestAnimFrame(this._drawCompass, this))
            : (this._compassHeading = null);
        },
        _onCompassNeedsCalibration: function () {
          this._setCompassHeading();
        },
        _onDeviceOrientation: function (t) {
          this._active &&
            (t.webkitCompassHeading
              ? this._setCompassHeading(t.webkitCompassHeading)
              : t.absolute &&
                t.alpha &&
                this._setCompassHeading(360 - t.alpha));
        },
        _onLocationError: function (t) {
          (3 == t.code && this.options.locateOptions.watch) ||
            (this.stop(), this.options.onLocationError(t, this));
        },
        _onLocationFound: function (t) {
          if (
            (!this._event ||
              this._event.latlng.lat !== t.latlng.lat ||
              this._event.latlng.lng !== t.latlng.lng ||
              this._event.accuracy !== t.accuracy) &&
            this._active
          ) {
            switch (
              ((this._event = t),
              this._drawMarker(),
              this._updateContainerStyle(),
              this.options.setView)
            ) {
              case "once":
                this._justClicked && this.setView();
                break;
              case "untilPan":
                this._userPanned || this.setView();
                break;
              case "untilPanOrZoom":
                this._userPanned || this._userZoomed || this.setView();
                break;
              case "always":
                this.setView();
            }
            this._justClicked = !1;
          }
        },
        _onDrag: function () {
          this._event &&
            !this._ignoreEvent &&
            ((this._userPanned = !0),
            this._updateContainerStyle(),
            this._drawMarker());
        },
        _onZoom: function () {
          this._event &&
            !this._ignoreEvent &&
            ((this._userZoomed = !0),
            this._updateContainerStyle(),
            this._drawMarker());
        },
        _onZoomEnd: function () {
          this._event && this._drawCompass(),
            this._event &&
              !this._ignoreEvent &&
              this._marker &&
              !this._map
                .getBounds()
                .pad(-0.3)
                .contains(this._marker.getLatLng()) &&
              ((this._userPanned = !0),
              this._updateContainerStyle(),
              this._drawMarker());
        },
        _isFollowing: function () {
          return (
            !!this._active &&
            ("always" === this.options.setView ||
              ("untilPan" === this.options.setView
                ? !this._userPanned
                : "untilPanOrZoom" === this.options.setView
                ? !this._userPanned && !this._userZoomed
                : void 0))
          );
        },
        _isOutsideMapBounds: function () {
          return (
            this._event !== undefined &&
            this._map.options.maxBounds &&
            !this._map.options.maxBounds.contains(this._event.latlng)
          );
        },
        _updateContainerStyle: function () {
          this._container &&
            (this._active && !this._event
              ? this._setClasses("requesting")
              : this._isFollowing()
              ? this._setClasses("following")
              : this._active
              ? this._setClasses("active")
              : this._cleanClasses());
        },
        _setClasses: function (t) {
          "requesting" == t
            ? (o(this._container, "active following"),
              e(this._container, "requesting"),
              o(this._icon, this.options.icon),
              e(this._icon, this.options.iconLoading))
            : "active" == t
            ? (o(this._container, "requesting following"),
              e(this._container, "active"),
              o(this._icon, this.options.iconLoading),
              e(this._icon, this.options.icon))
            : "following" == t &&
              (o(this._container, "requesting"),
              e(this._container, "active following"),
              o(this._icon, this.options.iconLoading),
              e(this._icon, this.options.icon));
        },
        _cleanClasses: function () {
          c.DomUtil.removeClass(this._container, "requesting"),
            c.DomUtil.removeClass(this._container, "active"),
            c.DomUtil.removeClass(this._container, "following"),
            o(this._icon, this.options.iconLoading),
            e(this._icon, this.options.icon);
        },
        _resetVariables: function () {
          (this._active = !1),
            (this._justClicked = !1),
            (this._userPanned = !1),
            (this._userZoomed = !1);
        },
      });
    return (
      (c.control.locate = function (t) {
        return new c.Control.Locate(t);
      }),
      a
    );
  }, window),
  (L.OSM.layers = function (u) {
    var t = L.control(u);
    return (
      (t.onAdd = function (s) {
        function o(t) {
          t.stopPropagation(),
            t.preventDefault(),
            u.sidebar.togglePane(c, e),
            $(".leaflet-control .control-button").tooltip("hide");
        }
        var i = u.layers,
          t = $("<div>").attr("class", "control-layers"),
          e = $("<a>")
            .attr("class", "control-button")
            .attr("href", "#")
            .attr("title", I18n.t("javascripts.map.layers.title"))
            .html('<span class="icon layers"></span>')
            .on("click", o)
            .appendTo(t),
          c = $("<div>").attr("class", "layers-ui");
        $("<div>")
          .attr("class", "sidebar_heading")
          .appendTo(c)
          .append(
            $("<span>")
              .text(I18n.t("javascripts.close"))
              .attr("class", "icon close")
              .bind("click", o)
          )
          .append($("<h4>").text(I18n.t("javascripts.map.layers.header")));
        var n = $("<div>").attr("class", "section base-layers").appendTo(c),
          l = $("<ul class='list-unstyled'>").appendTo(n);
        if (
          (i.forEach(function (a) {
            var t = $("<li>").appendTo(l);
            s.hasLayer(a) && t.addClass("active");
            var r = $("<div>").appendTo(t);
            s.whenReady(function () {
              function t() {
                i.invalidateSize(), o({ animate: !1 }), s.on("moveend", n);
              }
              function e() {
                s.off("moveend", n);
              }
              function n() {
                o();
              }
              function o(t) {
                i.setView(s.getCenter(), Math.max(s.getZoom() - 2, 0), t);
              }
              var i = L.map(r[0], {
                attributionControl: !1,
                zoomControl: !1,
                keyboard: !1,
              }).addLayer(new a.constructor({ apikey: a.options.apikey }));
              i.dragging.disable(),
                i.touchZoom.disable(),
                i.doubleClickZoom.disable(),
                i.scrollWheelZoom.disable(),
                c.on("show", t).on("hide", e);
            });
            var e = $("<label>").appendTo(t),
              n = $("<input>")
                .attr("type", "radio")
                .prop("checked", s.hasLayer(a))
                .appendTo(e);
            e.append(a.options.name),
              t.on("click", function () {
                i.forEach(function (t) {
                  t === a ? s.addLayer(t) : s.removeLayer(t);
                }),
                  s.fire("baselayerchange", { layer: a });
              }),
              t.on("dblclick", o),
              s.on("layeradd layerremove", function () {
                t.toggleClass("active", s.hasLayer(a)),
                  n.prop("checked", s.hasLayer(a));
              });
          }),
          "api_offline" !== OSM.STATUS && "database_offline" !== OSM.STATUS)
        ) {
          var a = $("<div>")
            .attr("class", "section overlay-layers")
            .appendTo(c);
          $("<p>")
            .text(I18n.t("javascripts.map.layers.overlays"))
            .attr("class", "text-muted")
            .appendTo(a);
          var d = $("<ul class='list-unstyled'>").appendTo(a),
            r = function (t, e, n) {
              var o = $("<li>").tooltip({ placement: "top" }).appendTo(d),
                i = $("<label>").appendTo(o),
                a = s.hasLayer(t),
                r = $("<input>")
                  .attr("type", "checkbox")
                  .prop("checked", a)
                  .appendTo(i);
              i.append(I18n.t("javascripts.map.layers." + e)),
                r.on("change", function () {
                  (a = r.is(":checked")) ? s.addLayer(t) : s.removeLayer(t),
                    s.fire("overlaylayerchange", { layer: t });
                }),
                s.on("layeradd layerremove", function () {
                  r.prop("checked", s.hasLayer(t));
                }),
                s.on("zoomend", function () {
                  var t = s.getBounds().getSize() >= n;
                  $(r).prop("disabled", t),
                    t && $(r).is(":checked")
                      ? ($(r).prop("checked", !1).trigger("change"), (a = !0))
                      : t ||
                        $(r).is(":checked") ||
                        !a ||
                        $(r).prop("checked", !0).trigger("change"),
                    $(o).attr("class", t ? "disabled" : ""),
                    o.attr(
                      "data-original-title",
                      t
                        ? I18n.t(
                            "javascripts.site.map_" + e + "_zoom_in_tooltip"
                          )
                        : ""
                    );
                });
            };
          r(s.noteLayer, "notes", OSM.MAX_NOTE_REQUEST_AREA),
            r(s.dataLayer, "data", OSM.MAX_REQUEST_AREA),
            r(s.gpsLayer, "gps", Number.POSITIVE_INFINITY);
        }
        return u.sidebar.addPane(c), t[0];
      }),
      t
    );
  }),
  (L.OSM.key = function (d) {
    var t = L.control(d);
    return (
      (t.onAdd = function (o) {
        function t() {
          o.on("zoomend baselayerchange", a), l.load("/key", a);
        }
        function e() {
          o.off("zoomend baselayerchange", a);
        }
        function n(t) {
          t.stopPropagation(),
            t.preventDefault(),
            s.hasClass("disabled") || d.sidebar.togglePane(c, s),
            $(".leaflet-control .control-button").tooltip("hide");
        }
        function i() {
          var t = -1 === ["mapnik", "cyclemap"].indexOf(o.getMapBaseLayerId());
          s.toggleClass("disabled", t).attr(
            "data-original-title",
            I18n.t(
              t ? "javascripts.key.tooltip_disabled" : "javascripts.key.tooltip"
            )
          );
        }
        function a() {
          var e = o.getMapBaseLayerId(),
            n = o.getZoom();
          $(".mapkey-table-entry").each(function () {
            var t = $(this).data();
            e === t.layer && n >= t.zoomMin && n <= t.zoomMax
              ? $(this).show()
              : $(this).hide();
          });
        }
        var r = $("<div>").attr("class", "control-key"),
          s = $("<a>")
            .attr("class", "control-button")
            .attr("href", "#")
            .html('<span class="icon key"></span>')
            .on("click", n)
            .appendTo(r),
          c = $("<div>").attr("class", "key-ui");
        $("<div>")
          .attr("class", "sidebar_heading")
          .appendTo(c)
          .append(
            $("<span>")
              .text(I18n.t("javascripts.close"))
              .attr("class", "icon close")
              .bind("click", n)
          )
          .append($("<h4>").text(I18n.t("javascripts.key.title")));
        var l = $("<div>").attr("class", "section").appendTo(c);
        return (
          d.sidebar.addPane(c),
          c.on("show", t).on("hide", e),
          o.on("baselayerchange", i),
          i(),
          r[0]
        );
      }),
      t
    );
  }),
  (L.OSM.note = function (t) {
    var e = L.control(t);
    return (
      (e.onAdd = function (e) {
        function t() {
          var t = "database_offline" === OSM.STATUS || e.getZoom() < 12;
          o.toggleClass("disabled", t).attr(
            "data-original-title",
            I18n.t(
              t
                ? "javascripts.site.createnote_disabled_tooltip"
                : "javascripts.site.createnote_tooltip"
            )
          );
        }
        var n = $("<div>").attr("class", "control-note"),
          o = $("<a>")
            .attr("class", "control-button")
            .attr("href", "#")
            .html('<span class="icon note"></span>')
            .appendTo(n);
        return e.on("zoomend", t), t(), n[0];
      }),
      e
    );
  }),
  (L.OSM.share = function (x) {
    var t = L.control(x),
      S = L.marker([0, 0], { draggable: !0 }),
      M = new L.LocationFilter({ enableButton: !1, adjustButton: !1 });
    return (
      (t.onAdd = function (r) {
        function t() {
          r.removeLayer(S),
            (r.options.scrollWheelZoom = r.options.doubleClickZoom = !0),
            M.disable(),
            l();
        }
        function e(t) {
          t.stopPropagation(),
            t.preventDefault(),
            $("#mapnik_scale").val(u()),
            S.setLatLng(r.getCenter()),
            l(),
            x.sidebar.togglePane(f, m),
            $(".leaflet-control .control-button").tooltip("hide");
        }
        function n() {
          $(this).is(":checked")
            ? (S.setLatLng(r.getCenter()),
              r.addLayer(S),
              (r.options.scrollWheelZoom = r.options.doubleClickZoom =
                "center"))
            : (r.removeLayer(S),
              (r.options.scrollWheelZoom = r.options.doubleClickZoom = !0)),
            l();
        }
        function o() {
          $(this).is(":checked")
            ? (M.setBounds(r.getBounds().pad(-0.2)), M.enable())
            : M.disable(),
            l();
        }
        function i() {
          S.setLatLng(r.getCenter()), l();
        }
        function a() {
          r.hasLayer(S) &&
            (r.off("move", i), r.on("moveend", s), r.panTo(S.getLatLng()));
        }
        function s() {
          r.off("moveend", s), r.on("move", i), l();
        }
        function c(t) {
          var e = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
          };
          return null === t
            ? ""
            : String(t).replace(/[&<>"']/g, function (t) {
                return e[t];
              });
        }
        function l() {
          var t = r.getBounds();
          $("#link_marker").prop("checked", r.hasLayer(S)),
            $("#image_filter").prop("checked", M.isEnabled()),
            $("#short_input").val(r.getShortUrl(S)),
            $("#long_input").val(r.getUrl(S)),
            $("#short_link").attr("href", r.getShortUrl(S)),
            $("#long_link").attr("href", r.getUrl(S));
          var e = { bbox: t.toBBoxString(), layer: r.getMapBaseLayerId() };
          if (r.hasLayer(S)) {
            var n = S.getLatLng().wrap();
            e.marker = n.lat + "," + n.lng;
          }
          $("#embed_html").val(
            '<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="' +
              c(
                OSM.SERVER_PROTOCOL +
                  "://" +
                  OSM.SERVER_URL +
                  "/export/embed.html?" +
                  $.param(e)
              ) +
              '" style="border: 1px solid black"></iframe><br/><small><a href="' +
              c(r.getUrl(S)) +
              '">' +
              c(I18n.t("javascripts.share.view_larger_map")) +
              "</a></small>"
          ),
            $("#geo_uri").attr("href", r.getGeoUri(S)).html(r.getGeoUri(S)),
            M.isEnabled() && (t = M.getBounds());
          var o = $("#mapnik_scale").val(),
            i = L.bounds(
              L.CRS.EPSG3857.project(t.getSouthWest()),
              L.CRS.EPSG3857.project(t.getNorthEast())
            ).getSize(),
            a = Math.floor(Math.sqrt((i.x * i.y) / 0.3136));
          $("#mapnik_minlon").val(t.getWest()),
            $("#mapnik_minlat").val(t.getSouth()),
            $("#mapnik_maxlon").val(t.getEast()),
            $("#mapnik_maxlat").val(t.getNorth()),
            o < a && ((o = p(a)), $("#mapnik_scale").val(o)),
            $("#mapnik_image_width").text(Math.round(i.x / o / 28e-5)),
            $("#mapnik_image_height").text(Math.round(i.y / o / 28e-5)),
            "mapnik" === r.getMapBaseLayerId()
              ? ($("#export-image").show(), $("#export-warning").hide())
              : ($("#export-image").hide(), $("#export-warning").show());
        }
        function d() {
          $(this).select();
        }
        function u() {
          var t = r.getBounds(),
            e = t.getCenter().lat,
            n =
              (6378137 *
                Math.PI *
                Math.cos((e * Math.PI) / 180) *
                (t.getEast() - t.getWest())) /
              180,
            o = r.getSize().x / n,
            i = 1 / 3622.0492;
          return Math.round(1 / (o * i));
        }
        function p(t) {
          var e = 5 * Math.pow(10, Math.floor(Math.LOG10E * Math.log(t)) - 2);
          return e * Math.ceil(t / e);
        }
        var h = $("<div>").attr("class", "control-share"),
          m = $("<a>")
            .attr("class", "control-button")
            .attr("href", "#")
            .attr("title", I18n.t("javascripts.share.title"))
            .html('<span class="icon share"></span>')
            .on("click", e)
            .appendTo(h),
          f = $("<div>").attr("class", "share-ui");
        $("<div>")
          .attr("class", "sidebar_heading")
          .appendTo(f)
          .append(
            $("<span>")
              .text(I18n.t("javascripts.close"))
              .attr("class", "icon close")
              .bind("click", e)
          )
          .append($("<h4>").text(I18n.t("javascripts.share.title")));
        var v = $("<div>").attr("class", "section share-link").appendTo(f);
        $("<h4>").text(I18n.t("javascripts.share.link")).appendTo(v);
        var g = $("<form>").attr("class", "standard-form").appendTo(v);
        $("<div>")
          .attr("class", "standard-form-row")
          .appendTo(g)
          .append(
            $("<label>")
              .attr("for", "link_marker")
              .append(
                $("<input>")
                  .attr("id", "link_marker")
                  .attr("type", "checkbox")
                  .bind("change", n)
              )
              .append(I18n.t("javascripts.share.include_marker"))
          ),
          $("<div>")
            .attr("class", "share-tabs")
            .appendTo(g)
            .append(
              $("<a>")
                .attr("class", "active")
                .attr("for", "long_input")
                .attr("id", "long_link")
                .text(I18n.t("javascripts.share.long_link"))
            )
            .append(
              $("<a>")
                .attr("for", "short_input")
                .attr("id", "short_link")
                .text(I18n.t("javascripts.share.short_link"))
            )
            .append(
              $("<a>")
                .attr("for", "embed_html")
                .attr("href", "#")
                .text(I18n.t("javascripts.share.embed"))
            )
            .on("click", "a", function (t) {
              t.preventDefault();
              var e = "#" + $(this).attr("for");
              v.find(".share-tabs a").removeClass("active"),
                $(this).addClass("active"),
                v.find(".share-tab").hide(),
                v
                  .find(".share-tab:has(" + e + ")")
                  .show()
                  .find("input, textarea")
                  .select();
            }),
          $("<div>")
            .attr("class", "standard-form-row share-tab")
            .css("display", "block")
            .appendTo(g)
            .append(
              $("<input>")
                .attr("id", "long_input")
                .attr("type", "text")
                .on("click", d)
            ),
          $("<div>")
            .attr("class", "standard-form-row share-tab")
            .appendTo(g)
            .append(
              $("<input>")
                .attr("id", "short_input")
                .attr("type", "text")
                .on("click", d)
            ),
          $("<div>")
            .attr("class", "standard-form-row share-tab")
            .appendTo(g)
            .append($("<textarea>").attr("id", "embed_html").on("click", d))
            .append(
              $("<p>")
                .attr("class", "text-muted")
                .text(I18n.t("javascripts.share.paste_html"))
                .appendTo(v)
            );
        var _ = $("<div>").attr("class", "section share-geo-uri").appendTo(f);
        $("<h4>").text(I18n.t("javascripts.share.geo_uri")).appendTo(_),
          $("<div>").appendTo(_).append($("<a>").attr("id", "geo_uri"));
        var y = $("<div>").attr("class", "section share-image").appendTo(f);
        $("<h4>").text(I18n.t("javascripts.share.image")).appendTo(y),
          $("<div>")
            .attr("id", "export-warning")
            .attr("class", "text-muted")
            .text(I18n.t("javascripts.share.only_standard_layer"))
            .appendTo(y),
          (g = $("<form>")
            .attr("id", "export-image")
            .attr("class", "standard-form")
            .attr("action", "/export/finish")
            .attr("method", "post")
            .appendTo(y)),
          $("<div>")
            .attr("class", "standard-form-row")
            .appendTo(g)
            .append(
              $("<label>")
                .attr("for", "image_filter")
                .append(
                  $("<input>")
                    .attr("id", "image_filter")
                    .attr("type", "checkbox")
                    .bind("change", o)
                )
                .append(I18n.t("javascripts.share.custom_dimensions"))
            ),
          $("<div>")
            .attr("class", "standard-form-row")
            .appendTo(g)
            .append(
              $("<label>")
                .attr("for", "mapnik_format")
                .text(I18n.t("javascripts.share.format"))
            )
            .append(
              $("<select>")
                .attr("name", "mapnik_format")
                .attr("id", "mapnik_format")
                .append(
                  $("<option>").val("png").text("PNG").prop("selected", !0)
                )
                .append($("<option>").val("jpeg").text("JPEG"))
                .append($("<option>").val("svg").text("SVG"))
                .append($("<option>").val("pdf").text("PDF"))
            ),
          $("<div>")
            .attr("class", "standard-form-row")
            .appendTo(g)
            .append(
              $("<label>")
                .attr("for", "mapnik_scale")
                .text(I18n.t("javascripts.share.scale"))
            )
            .append("1 : ")
            .append(
              $("<input>")
                .attr("name", "mapnik_scale")
                .attr("id", "mapnik_scale")
                .attr("type", "text")
                .on("change", l)
            ),
          ["minlon", "minlat", "maxlon", "maxlat"].forEach(function (t) {
            $("<input>")
              .attr("id", "mapnik_" + t)
              .attr("name", t)
              .attr("type", "hidden")
              .appendTo(g);
          }),
          $("<input>")
            .attr("name", "format")
            .attr("value", "mapnik")
            .attr("type", "hidden")
            .appendTo(g);
        var b = $("meta[name=csrf-param]").attr("content"),
          w = $("meta[name=csrf-token]").attr("content");
        return (
          $("<input>")
            .attr("name", b)
            .attr("value", w)
            .attr("type", "hidden")
            .appendTo(g),
          $("<p>")
            .attr("class", "text-muted")
            .html(
              I18n.t("javascripts.share.image_size") +
                ' <span id="mapnik_image_width"></span> x <span id="mapnik_image_height"></span>'
            )
            .appendTo(g),
          $("<input>")
            .attr("type", "submit")
            .attr("value", I18n.t("javascripts.share.download"))
            .appendTo(g),
          M.on("change", l).addTo(r),
          S.on("dragend", a),
          r.on("move", i),
          r.on("moveend layeradd layerremove", l),
          x.sidebar.addPane(f),
          f.on("hide", t),
          h[0]
        );
      }),
      t
    );
  }),
  (function () {
    "use strict";
    var c = function (t) {
        return (
          ((t = "number" == typeof t ? { precision: t } : t || {}).precision =
            t.precision || 5),
          (t.factor = t.factor || Math.pow(10, t.precision)),
          (t.dimension = t.dimension || 2),
          t
        );
      },
      n = {
        encode: function (t, e) {
          e = c(e);
          for (var n = [], o = 0, i = t.length; o < i; ++o) {
            var a = t[o];
            if (2 === e.dimension) n.push(a.lat || a[0]), n.push(a.lng || a[1]);
            else for (var r = 0; r < e.dimension; ++r) n.push(a[r]);
          }
          return this.encodeDeltas(n, e);
        },
        decode: function (t, e) {
          e = c(e);
          for (
            var n = this.decodeDeltas(t, e), o = [], i = 0, a = n.length;
            i + (e.dimension - 1) < a;

          ) {
            for (var r = [], s = 0; s < e.dimension; ++s) r.push(n[i++]);
            o.push(r);
          }
          return o;
        },
        encodeDeltas: function (t, e) {
          e = c(e);
          for (var n = [], o = 0, i = t.length; o < i; )
            for (var a = 0; a < e.dimension; ++a, ++o) {
              var r = t[o].toFixed(e.precision),
                s = r - (n[a] || 0);
              (n[a] = r), (t[o] = s);
            }
          return this.encodeFloats(t, e);
        },
        decodeDeltas: function (t, e) {
          e = c(e);
          for (
            var n = [], o = this.decodeFloats(t, e), i = 0, a = o.length;
            i < a;

          )
            for (var r = 0; r < e.dimension; ++r, ++i)
              o[i] =
                Math.round((n[r] = o[i] + (n[r] || 0)) * e.factor) / e.factor;
          return o;
        },
        encodeFloats: function (t, e) {
          e = c(e);
          for (var n = 0, o = t.length; n < o; ++n)
            t[n] = Math.round(t[n] * e.factor);
          return this.encodeSignedIntegers(t);
        },
        decodeFloats: function (t, e) {
          e = c(e);
          for (
            var n = this.decodeSignedIntegers(t), o = 0, i = n.length;
            o < i;
            ++o
          )
            n[o] /= e.factor;
          return n;
        },
        encodeSignedIntegers: function (t) {
          for (var e = 0, n = t.length; e < n; ++e) {
            var o = t[e];
            t[e] = o < 0 ? ~(o << 1) : o << 1;
          }
          return this.encodeUnsignedIntegers(t);
        },
        decodeSignedIntegers: function (t) {
          for (
            var e = this.decodeUnsignedIntegers(t), n = 0, o = e.length;
            n < o;
            ++n
          ) {
            var i = e[n];
            e[n] = 1 & i ? ~(i >> 1) : i >> 1;
          }
          return e;
        },
        encodeUnsignedIntegers: function (t) {
          for (var e = "", n = 0, o = t.length; n < o; ++n)
            e += this.encodeUnsignedInteger(t[n]);
          return e;
        },
        decodeUnsignedIntegers: function (t) {
          for (var e = [], n = 0, o = 0, i = 0, a = t.length; i < a; ++i) {
            var r = t.charCodeAt(i) - 63;
            (n |= (31 & r) << o), r < 32 ? (e.push(n), (o = n = 0)) : (o += 5);
          }
          return e;
        },
        encodeSignedInteger: function (t) {
          return (
            (t = t < 0 ? ~(t << 1) : t << 1), this.encodeUnsignedInteger(t)
          );
        },
        encodeUnsignedInteger: function (t) {
          for (var e, n = ""; 32 <= t; )
            (e = 63 + (32 | (31 & t))),
              (n += String.fromCharCode(e)),
              (t >>= 5);
          return (e = t + 63), (n += String.fromCharCode(e));
        },
      };
    if (
      ("object" == typeof module &&
        "object" == typeof module.exports &&
        (module.exports = n),
      "object" == typeof L)
    ) {
      L.Polyline.prototype.fromEncoded ||
        (L.Polyline.fromEncoded = function (t, e) {
          return L.polyline(n.decode(t), e);
        }),
        L.Polygon.prototype.fromEncoded ||
          (L.Polygon.fromEncoded = function (t, e) {
            return L.polygon(n.decode(t), e);
          });
      var t = {
        encodePath: function () {
          return n.encode(this.getLatLngs());
        },
      };
      L.Polyline.prototype.encodePath || L.Polyline.include(t),
        L.Polygon.prototype.encodePath || L.Polygon.include(t),
        (L.PolylineUtil = n);
    }
  })(),
  (L.OSM.query = function (t) {
    var e = L.control(t);
    return (
      (e.onAdd = function (n) {
        function t() {
          var t = o.hasClass("disabled"),
            e = n.getZoom() < 14;
          o
            .toggleClass("disabled", e)
            .attr(
              "data-original-title",
              I18n.t(
                e
                  ? "javascripts.site.queryfeature_disabled_tooltip"
                  : "javascripts.site.queryfeature_tooltip"
              )
            ),
            e && !t ? o.trigger("disabled") : t && !e && o.trigger("enabled");
        }
        var e = $("<div>").attr("class", "control-query"),
          o = $("<a>")
            .attr("class", "control-button")
            .attr("href", "#")
            .html('<span class="icon query"></span>')
            .appendTo(e);
        return n.on("zoomend", t), t(), e[0];
      }),
      e
    );
  }),
  (function (t) {
    var e;
    if ("function" == typeof define && define.amd) define(["leaflet"], t);
    else if ("object" == typeof module && "object" == typeof module.exports)
      (e = require("leaflet")), (module.exports = t(e));
    else {
      if ("undefined" == typeof window.L)
        throw new Error("Leaflet must be loaded first");
      t(window.L);
    }
  })(function (d) {
    d.Map.mergeOptions({ contextmenuItems: [] }),
      (d.Map.ContextMenu = d.Handler.extend({
        _touchstart: d.Browser.msPointer
          ? "MSPointerDown"
          : d.Browser.pointer
          ? "pointerdown"
          : "touchstart",
        statics: { BASE_CLS: "leaflet-contextmenu" },
        initialize: function (t) {
          d.Handler.prototype.initialize.call(this, t),
            (this._items = []),
            (this._visible = !1);
          var e = (this._container = d.DomUtil.create(
            "div",
            d.Map.ContextMenu.BASE_CLS,
            t._container
          ));
          (e.style.zIndex = 1e4),
            (e.style.position = "absolute"),
            t.options.contextmenuWidth &&
              (e.style.width = t.options.contextmenuWidth + "px"),
            this._createItems(),
            d.DomEvent.on(e, "click", d.DomEvent.stop)
              .on(e, "mousedown", d.DomEvent.stop)
              .on(e, "dblclick", d.DomEvent.stop)
              .on(e, "contextmenu", d.DomEvent.stop);
        },
        addHooks: function () {
          var t = this._map.getContainer();
          d.DomEvent.on(t, "mouseleave", this._hide, this).on(
            document,
            "keydown",
            this._onKeyDown,
            this
          ),
            d.Browser.touch &&
              d.DomEvent.on(document, this._touchstart, this._hide, this),
            this._map.on(
              {
                contextmenu: this._show,
                mousedown: this._hide,
                zoomstart: this._hide,
              },
              this
            );
        },
        removeHooks: function () {
          var t = this._map.getContainer();
          d.DomEvent.off(t, "mouseleave", this._hide, this).off(
            document,
            "keydown",
            this._onKeyDown,
            this
          ),
            d.Browser.touch &&
              d.DomEvent.off(document, this._touchstart, this._hide, this),
            this._map.off(
              {
                contextmenu: this._show,
                mousedown: this._hide,
                zoomstart: this._hide,
              },
              this
            );
        },
        showAt: function (t, e) {
          t instanceof d.LatLng && (t = this._map.latLngToContainerPoint(t)),
            this._showAtPoint(t, e);
        },
        hide: function () {
          this._hide();
        },
        addItem: function (t) {
          return this.insertItem(t);
        },
        insertItem: function (t, e) {
          e = e !== undefined ? e : this._items.length;
          var n = this._createItem(this._container, t, e);
          return (
            this._items.push(n),
            (this._sizeChanged = !0),
            this._map.fire("contextmenu.additem", {
              contextmenu: this,
              el: n.el,
              index: e,
            }),
            n.el
          );
        },
        removeItem: function (t) {
          var e = this._container;
          return (
            isNaN(t) || (t = e.children[t]),
            t
              ? (this._removeItem(d.Util.stamp(t)),
                (this._sizeChanged = !0),
                this._map.fire("contextmenu.removeitem", {
                  contextmenu: this,
                  el: t,
                }),
                t)
              : null
          );
        },
        removeAllItems: function () {
          for (var t, e = this._container.children; e.length; )
            (t = e[0]), this._removeItem(d.Util.stamp(t));
          return e;
        },
        hideAllItems: function () {
          var t, e;
          for (t = 0, e = this._items.length; t < e; t++)
            this._items[t].el.style.display = "none";
        },
        showAllItems: function () {
          var t, e;
          for (t = 0, e = this._items.length; t < e; t++)
            this._items[t].el.style.display = "";
        },
        setDisabled: function (t, e) {
          var n = this._container,
            o = d.Map.ContextMenu.BASE_CLS + "-item";
          isNaN(t) || (t = n.children[t]),
            t &&
              d.DomUtil.hasClass(t, o) &&
              (e
                ? (d.DomUtil.addClass(t, o + "-disabled"),
                  this._map.fire("contextmenu.disableitem", {
                    contextmenu: this,
                    el: t,
                  }))
                : (d.DomUtil.removeClass(t, o + "-disabled"),
                  this._map.fire("contextmenu.enableitem", {
                    contextmenu: this,
                    el: t,
                  })));
        },
        isVisible: function () {
          return this._visible;
        },
        _createItems: function () {
          var t,
            e,
            n = this._map.options.contextmenuItems;
          for (t = 0, e = n.length; t < e; t++)
            this._items.push(this._createItem(this._container, n[t]));
        },
        _createItem: function (t, e, n) {
          if (e.separator || "-" === e) return this._createSeparator(t, n);
          var o = d.Map.ContextMenu.BASE_CLS + "-item",
            i = e.disabled ? o + " " + o + "-disabled" : o,
            a = this._insertElementAt("a", i, t, n),
            r = this._createEventHandler(
              a,
              e.callback,
              e.context,
              e.hideOnSelect
            ),
            s = this._getIcon(e),
            c = this._getIconCls(e),
            l = "";
          return (
            s
              ? (l =
                  '<img class="' +
                  d.Map.ContextMenu.BASE_CLS +
                  '-icon" src="' +
                  s +
                  '"/>')
              : c &&
                (l =
                  '<span class="' +
                  d.Map.ContextMenu.BASE_CLS +
                  "-icon " +
                  c +
                  '"></span>'),
            (a.innerHTML = l + e.text),
            (a.href = "#"),
            d.DomEvent.on(a, "mouseover", this._onItemMouseOver, this)
              .on(a, "mouseout", this._onItemMouseOut, this)
              .on(a, "mousedown", d.DomEvent.stopPropagation)
              .on(a, "click", r),
            d.Browser.touch &&
              d.DomEvent.on(a, this._touchstart, d.DomEvent.stopPropagation),
            d.Browser.pointer ||
              d.DomEvent.on(a, "click", this._onItemMouseOut, this),
            { id: d.Util.stamp(a), el: a, callback: r }
          );
        },
        _removeItem: function (t) {
          var e, n, o, i, a;
          for (o = 0, i = this._items.length; o < i; o++)
            if ((e = this._items[o]).id === t)
              return (
                (n = e.el),
                (a = e.callback) &&
                  (d.DomEvent.off(n, "mouseover", this._onItemMouseOver, this)
                    .off(n, "mouseover", this._onItemMouseOut, this)
                    .off(n, "mousedown", d.DomEvent.stopPropagation)
                    .off(n, "click", a),
                  d.Browser.touch &&
                    d.DomEvent.off(
                      n,
                      this._touchstart,
                      d.DomEvent.stopPropagation
                    ),
                  d.Browser.pointer ||
                    d.DomEvent.on(n, "click", this._onItemMouseOut, this)),
                this._container.removeChild(n),
                this._items.splice(o, 1),
                e
              );
          return null;
        },
        _createSeparator: function (t, e) {
          var n = this._insertElementAt(
            "div",
            d.Map.ContextMenu.BASE_CLS + "-separator",
            t,
            e
          );
          return { id: d.Util.stamp(n), el: n };
        },
        _createEventHandler: function (i, a, r, s) {
          var c = this,
            l = (this._map, d.Map.ContextMenu.BASE_CLS + "-item-disabled");
          s = s === undefined || s;
          return function () {
            if (!d.DomUtil.hasClass(i, l)) {
              var t = c._map,
                e = c._showLocation.containerPoint,
                n = t.containerPointToLayerPoint(e),
                o = {
                  containerPoint: e,
                  layerPoint: n,
                  latlng: t.layerPointToLatLng(n),
                  relatedTarget: c._showLocation.relatedTarget,
                };
              s && c._hide(),
                a && a.call(r || t, o),
                c._map.fire("contextmenu.select", { contextmenu: c, el: i });
            }
          };
        },
        _insertElementAt: function (t, e, n, o) {
          var i,
            a = document.createElement(t);
          return (
            (a.className = e),
            o !== undefined && (i = n.children[o]),
            i ? n.insertBefore(a, i) : n.appendChild(a),
            a
          );
        },
        _show: function (t) {
          this._showAtPoint(t.containerPoint, t);
        },
        _showAtPoint: function (t, e) {
          if (this._items.length) {
            this._map;
            var n = d.extend(e || {}, { contextmenu: this });
            (this._showLocation = { containerPoint: t }),
              e &&
                e.relatedTarget &&
                (this._showLocation.relatedTarget = e.relatedTarget),
              this._setPosition(t),
              this._visible ||
                ((this._container.style.display = "block"),
                (this._visible = !0)),
              this._map.fire("contextmenu.show", n);
          }
        },
        _hide: function () {
          this._visible &&
            ((this._visible = !1),
            (this._container.style.display = "none"),
            this._map.fire("contextmenu.hide", { contextmenu: this }));
        },
        _getIcon: function (t) {
          return (d.Browser.retina && t.retinaIcon) || t.icon;
        },
        _getIconCls: function (t) {
          return (d.Browser.retina && t.retinaIconCls) || t.iconCls;
        },
        _setPosition: function (t) {
          var e,
            n = this._map.getSize(),
            o = this._container,
            i = this._getElementSize(o);
          this._map.options.contextmenuAnchor &&
            ((e = d.point(this._map.options.contextmenuAnchor)),
            (t = t.add(e))),
            (o._leaflet_pos = t).x + i.x > n.x
              ? ((o.style.left = "auto"),
                (o.style.right =
                  Math.min(Math.max(n.x - t.x, 0), n.x - i.x - 1) + "px"))
              : ((o.style.left = Math.max(t.x, 0) + "px"),
                (o.style.right = "auto")),
            t.y + i.y > n.y
              ? ((o.style.top = "auto"),
                (o.style.bottom =
                  Math.min(Math.max(n.y - t.y, 0), n.y - i.y - 1) + "px"))
              : ((o.style.top = Math.max(t.y, 0) + "px"),
                (o.style.bottom = "auto"));
        },
        _getElementSize: function (t) {
          var e = this._size,
            n = t.style.display;
          return (
            (e && !this._sizeChanged) ||
              ((e = {}),
              (t.style.left = "-999999px"),
              (t.style.right = "auto"),
              (t.style.display = "block"),
              (e.x = t.offsetWidth),
              (e.y = t.offsetHeight),
              (t.style.left = "auto"),
              (t.style.display = n),
              (this._sizeChanged = !1)),
            e
          );
        },
        _onKeyDown: function (t) {
          27 === t.keyCode && this._hide();
        },
        _onItemMouseOver: function (t) {
          d.DomUtil.addClass(t.target || t.srcElement, "over");
        },
        _onItemMouseOut: function (t) {
          d.DomUtil.removeClass(t.target || t.srcElement, "over");
        },
      })),
      d.Map.addInitHook("addHandler", "contextmenu", d.Map.ContextMenu),
      (d.Mixin.ContextMenu = {
        bindContextMenu: function (t) {
          return d.setOptions(this, t), this._initContextMenu(), this;
        },
        unbindContextMenu: function () {
          return this.off("contextmenu", this._showContextMenu, this), this;
        },
        addContextMenuItem: function (t) {
          this.options.contextmenuItems.push(t);
        },
        removeContextMenuItemWithIndex: function (t) {
          for (var e = [], n = 0; n < this.options.contextmenuItems.length; n++)
            this.options.contextmenuItems[n].index == t && e.push(n);
          for (var o = e.pop(); o !== undefined; )
            this.options.contextmenuItems.splice(o, 1), (o = e.pop());
        },
        replaceContextMenuItem: function (t) {
          this.removeContextMenuItemWithIndex(t.index),
            this.addContextMenuItem(t);
        },
        _initContextMenu: function () {
          (this._items = []),
            this.on("contextmenu", this._showContextMenu, this);
        },
        _showContextMenu: function (t) {
          var e, n, o, i, a;
          if (this._map.contextmenu) {
            for (
              n = d.extend({ relatedTarget: this }, t),
                o = this._map.mouseEventToContainerPoint(t.originalEvent),
                this.options.contextmenuInheritItems ||
                  this._map.contextmenu.hideAllItems(),
                i = 0,
                a = this.options.contextmenuItems.length;
              i < a;
              i++
            )
              (e = this.options.contextmenuItems[i]),
                this._items.push(this._map.contextmenu.insertItem(e, e.index));
            this._map.once("contextmenu.hide", this._hideContextMenu, this),
              this._map.contextmenu.showAt(o, n);
          }
        },
        _hideContextMenu: function () {
          var t, e;
          for (t = 0, e = this._items.length; t < e; t++)
            this._map.contextmenu.removeItem(this._items[t]);
          (this._items.length = 0),
            this.options.contextmenuInheritItems ||
              this._map.contextmenu.showAllItems();
        },
      });
    var t,
      e,
      n,
      o = [d.Marker, d.Path],
      i = {
        contextmenu: !1,
        contextmenuItems: [],
        contextmenuInheritItems: !0,
      };
    for (e = 0, n = o.length; e < n; e++)
      (t = o[e]).prototype.options
        ? t.mergeOptions(i)
        : (t.prototype.options = i),
        t.addInitHook(function () {
          this.options.contextmenu && this._initContextMenu();
        }),
        t.include(d.Mixin.ContextMenu);
    return d.Map.ContextMenu;
  }),
  (require = (function (i, a, t) {
    function r(n, t) {
      if (!a[n]) {
        if (!i[n]) {
          var e = "function" == typeof require && require;
          if (!t && e) return e(n, !0);
          if (s) return s(n, !0);
          throw new Error("Cannot find module '" + n + "'");
        }
        var o = (a[n] = { exports: {} });
        i[n][0].call(
          o.exports,
          function (t) {
            var e = i[n][1][t];
            return r(e || t);
          },
          o,
          o.exports
        );
      }
      return a[n].exports;
    }
    for (
      var s = "function" == typeof require && require, e = 0;
      e < t.length;
      e++
    )
      r(t[e]);
    return r;
  })(
    {
      "querystring-component": [
        function (t, e) {
          e.exports = t("Xr2wId");
        },
        {},
      ],
      Xr2wId: [
        function (t, e, n) {
          var a = t("trim");
          (n.parse = function (t) {
            if ("string" != typeof t) return {};
            if ("" === (t = a(t))) return {};
            for (var e = {}, n = t.split("&"), o = 0; o < n.length; o++) {
              var i = n[o].split("=");
              e[i[0]] = null === i[1] ? "" : decodeURIComponent(i[1]);
            }
            return e;
          }),
            (n.stringify = function (t) {
              if (!t) return "";
              var e = [];
              for (var n in t)
                e.push(encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
              return e.join("&");
            });
        },
        { trim: 1 },
      ],
      1: [
        function (t, e, n) {
          function o(t) {
            return t.replace(/^\s*|\s*$/g, "");
          }
          ((n = e.exports = o).left = function (t) {
            return t.replace(/^\s*/, "");
          }),
            (n.right = function (t) {
              return t.replace(/\s*$/, "");
            });
        },
        {},
      ],
    },
    {},
    []
  )),
  (OSM.initializeContextMenu = function (a) {
    var r = require("querystring-component");
    a.contextmenu.addItem({
      text: I18n.t("javascripts.context.directions_from"),
      callback: function s(t) {
        var e = OSM.zoomPrecision(a.getZoom()),
          n = t.latlng.wrap(),
          o = n.lat.toFixed(e),
          i = n.lng.toFixed(e);
        OSM.router.route(
          "/directions?" +
            r.stringify({ from: o + "," + i, to: $("#route_to").val() })
        );
      },
    }),
      a.contextmenu.addItem({
        text: I18n.t("javascripts.context.directions_to"),
        callback: function c(t) {
          var e = OSM.zoomPrecision(a.getZoom()),
            n = t.latlng.wrap(),
            o = n.lat.toFixed(e),
            i = n.lng.toFixed(e);
          OSM.router.route(
            "/directions?" +
              r.stringify({ from: $("#route_from").val(), to: o + "," + i })
          );
        },
      }),
      a.contextmenu.addItem({
        text: I18n.t("javascripts.context.add_note"),
        callback: function l(t) {
          var e = OSM.zoomPrecision(a.getZoom()),
            n = t.latlng.wrap(),
            o = n.lat.toFixed(e),
            i = n.lng.toFixed(e);
          OSM.router.route("/note/new?lat=" + o + "&lon=" + i);
        },
      }),
      a.contextmenu.addItem({
        text: I18n.t("javascripts.context.show_address"),
        callback: function d(t) {
          var e = OSM.zoomPrecision(a.getZoom()),
            n = t.latlng.wrap(),
            o = n.lat.toFixed(e),
            i = n.lng.toFixed(e);
          OSM.router.route(
            "/search?whereami=1&query=" + encodeURIComponent(o + "," + i)
          );
        },
      }),
      a.contextmenu.addItem({
        text: I18n.t("javascripts.context.query_features"),
        callback: function u(t) {
          var e = OSM.zoomPrecision(a.getZoom()),
            n = t.latlng.wrap(),
            o = n.lat.toFixed(e),
            i = n.lng.toFixed(e);
          OSM.router.route("/query?lat=" + o + "&lon=" + i);
        },
      }),
      a.contextmenu.addItem({
        text: I18n.t("javascripts.context.centre_map"),
        callback: function e(t) {
          a.panTo(t.latlng);
        },
      }),
      a.on("mousedown", function (t) {
        t.originalEvent.shiftKey
          ? a.contextmenu.disable()
          : a.contextmenu.enable();
      });
    var t = function t() {
      a.contextmenu.setDisabled(2, a.getZoom() < 12),
        a.contextmenu.setDisabled(4, a.getZoom() < 14);
    };
    a.on("zoomend", t), t();
  }),
  (function (d, u) {
    function p(t) {
      var e,
        n = d(t.ownerDocument);
      return {
        x: (e = (t = d(t)).offset()).left + t.outerWidth() / 2 - n.scrollLeft(),
        y: e.top + t.outerHeight() / 2 - n.scrollTop(),
      };
    }
    function h(t) {
      var e,
        n = d(t.ownerDocument);
      return {
        x: (e = (t = d(t)).offset()).left - n.scrollLeft(),
        y: e.top - n.scrollTop(),
      };
    }
    var n = /^key/,
      o = /^(?:mouse|contextmenu)|click/;
    (d.fn.simulate = function (t, e) {
      return this.each(function () {
        new d.simulate(this, t, e);
      });
    }),
      (d.simulate = function (t, e, n) {
        var o = d.camelCase("simulate-" + e);
        (this.target = t),
          (this.options = n),
          this[o] ? this[o]() : this.simulateEvent(t, e, n);
      }),
      d.extend(d.simulate, {
        keyCode: {
          BACKSPACE: 8,
          COMMA: 188,
          DELETE: 46,
          DOWN: 40,
          END: 35,
          ENTER: 13,
          ESCAPE: 27,
          HOME: 36,
          LEFT: 37,
          NUMPAD_ADD: 107,
          NUMPAD_DECIMAL: 110,
          NUMPAD_DIVIDE: 111,
          NUMPAD_ENTER: 108,
          NUMPAD_MULTIPLY: 106,
          NUMPAD_SUBTRACT: 109,
          PAGE_DOWN: 34,
          PAGE_UP: 33,
          PERIOD: 190,
          RIGHT: 39,
          SPACE: 32,
          TAB: 9,
          UP: 38,
        },
        buttonCode: { LEFT: 0, MIDDLE: 1, RIGHT: 2 },
      }),
      d.extend(d.simulate.prototype, {
        simulateEvent: function (t, e, n) {
          var o = this.createEvent(e, n);
          this.dispatchEvent(t, e, o, n);
        },
        createEvent: function (t, e) {
          return n.test(t)
            ? this.keyEvent(t, e)
            : o.test(t)
            ? this.mouseEvent(t, e)
            : void 0;
        },
        mouseEvent: function (t, e) {
          var n, o, i, a;
          return (
            (e = d.extend(
              {
                bubbles: !0,
                cancelable: "mousemove" !== t,
                view: window,
                detail: 0,
                screenX: 0,
                screenY: 0,
                clientX: 1,
                clientY: 1,
                ctrlKey: !1,
                altKey: !1,
                shiftKey: !1,
                metaKey: !1,
                button: 0,
                relatedTarget: u,
              },
              e
            )),
            document.createEvent
              ? ((n = document.createEvent("MouseEvents")).initMouseEvent(
                  t,
                  e.bubbles,
                  e.cancelable,
                  e.view,
                  e.detail,
                  e.screenX,
                  e.screenY,
                  e.clientX,
                  e.clientY,
                  e.ctrlKey,
                  e.altKey,
                  e.shiftKey,
                  e.metaKey,
                  e.button,
                  e.relatedTarget || document.body.parentNode
                ),
                0 === n.pageX &&
                  0 === n.pageY &&
                  Object.defineProperty &&
                  ((o = n.relatedTarget.ownerDocument || document),
                  (i = o.documentElement),
                  (a = o.body),
                  Object.defineProperty(n, "pageX", {
                    get: function () {
                      return (
                        e.clientX +
                        ((i && i.scrollLeft) || (a && a.scrollLeft) || 0) -
                        ((i && i.clientLeft) || (a && a.clientLeft) || 0)
                      );
                    },
                  }),
                  Object.defineProperty(n, "pageY", {
                    get: function () {
                      return (
                        e.clientY +
                        ((i && i.scrollTop) || (a && a.scrollTop) || 0) -
                        ((i && i.clientTop) || (a && a.clientTop) || 0)
                      );
                    },
                  })))
              : document.createEventObject &&
                ((n = document.createEventObject()),
                d.extend(n, e),
                (n.button =
                  { 0: 1, 1: 4, 2: 2 }[n.button] ||
                  (-1 === n.button ? 0 : n.button))),
            n
          );
        },
        keyEvent: function (t, e) {
          var n;
          if (
            ((e = d.extend(
              {
                bubbles: !0,
                cancelable: !0,
                view: window,
                ctrlKey: !1,
                altKey: !1,
                shiftKey: !1,
                metaKey: !1,
                keyCode: 0,
                charCode: u,
              },
              e
            )),
            document.createEvent)
          )
            try {
              (n = document.createEvent("KeyEvents")).initKeyEvent(
                t,
                e.bubbles,
                e.cancelable,
                e.view,
                e.ctrlKey,
                e.altKey,
                e.shiftKey,
                e.metaKey,
                e.keyCode,
                e.charCode
              );
            } catch (o) {
              (n = document.createEvent("Events")).initEvent(
                t,
                e.bubbles,
                e.cancelable
              ),
                d.extend(n, {
                  view: e.view,
                  ctrlKey: e.ctrlKey,
                  altKey: e.altKey,
                  shiftKey: e.shiftKey,
                  metaKey: e.metaKey,
                  keyCode: e.keyCode,
                  charCode: e.charCode,
                });
            }
          else
            document.createEventObject &&
              ((n = document.createEventObject()), d.extend(n, e));
          return (
            (/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()) ||
              "[object Opera]" === {}.toString.call(window.opera)) &&
              ((n.keyCode = 0 < e.charCode ? e.charCode : e.keyCode),
              (n.charCode = u)),
            n
          );
        },
        dispatchEvent: function (t, e, n) {
          t[e]
            ? t[e]()
            : t.dispatchEvent
            ? t.dispatchEvent(n)
            : t.fireEvent && t.fireEvent("on" + e, n);
        },
        simulateFocus: function () {
          function t() {
            n = !0;
          }
          var e,
            n = !1,
            o = d(this.target);
          o.bind("focus", t),
            o[0].focus(),
            n ||
              ((e = d.Event("focusin")).preventDefault(),
              o.trigger(e),
              o.triggerHandler("focus")),
            o.unbind("focus", t);
        },
        simulateBlur: function () {
          function t() {
            n = !0;
          }
          var e,
            n = !1,
            o = d(this.target);
          o.bind("blur", t),
            o[0].blur(),
            setTimeout(function () {
              o[0].ownerDocument.activeElement === o[0] &&
                o[0].ownerDocument.body.focus(),
                n ||
                  ((e = d.Event("focusout")).preventDefault(),
                  o.trigger(e),
                  o.triggerHandler("blur")),
                o.unbind("blur", t);
            }, 1);
        },
      }),
      d.extend(d.simulate.prototype, {
        simulateDrag: function () {
          var t = 0,
            e = this.target,
            n = this.options,
            o = "corner" === n.handle ? h(e) : p(e),
            i = Math.floor(o.x),
            a = Math.floor(o.y),
            r = { clientX: i, clientY: a },
            s = n.dx || (n.x !== u ? n.x - i : 0),
            c = n.dy || (n.y !== u ? n.y - a : 0),
            l = n.moves || 3;
          for (this.simulateEvent(e, "mousedown", r); t < l; t++)
            (i += s / l),
              (a += c / l),
              (r = { clientX: Math.round(i), clientY: Math.round(a) }),
              this.simulateEvent(e.ownerDocument, "mousemove", r);
          d.contains(document, e)
            ? (this.simulateEvent(e, "mouseup", r),
              this.simulateEvent(e, "click", r))
            : this.simulateEvent(document, "mouseup", r);
        },
      });
  })(jQuery),
  (OSM.Search = function (i) {
    function t(t) {
      t.preventDefault(), t.stopPropagation();
      var e = $(this).parents(".search_more");
      $(this).hide(),
        e.find(".loader").show(),
        $.get($(this).attr("href"), function (t) {
          e.replaceWith(t);
        });
    }
    function e() {
      var t = $(this).data("marker");
      if (!t) {
        var e = $(this).find("a.set_position").data();
        (t = L.marker([e.lat, e.lon], { icon: OSM.getUserIcon() })),
          $(this).data("marker", t);
      }
      s.addLayer(t), $(this).closest("li").addClass("selected");
    }
    function n() {
      var t = $(this).data("marker");
      t && s.removeLayer(t), $(this).closest("li").removeClass("selected");
    }
    function a(t) {
      t.minLon && t.minLat && t.maxLon && t.maxLat
        ? i.fitBounds([
            [t.minLat, t.minLon],
            [t.maxLat, t.maxLon],
          ])
        : i.setView([t.lat, t.lon], t.zoom);
    }
    function o(t) {
      var e = $(this).data();
      a(e), (e.type && e.id) || (t.preventDefault(), t.stopPropagation());
    }
    var r = require("querystring-component");
    $(".search_form input[name=query]").on("input", function (t) {
      "" === $(t.target).val()
        ? $(".describe_location").fadeIn(100)
        : $(".describe_location").fadeOut(100);
    }),
      $(".search_form a.button.switch_link").on("click", function (t) {
        t.preventDefault();
        var e = $(t.target).parent().parent().find("input[name=query]").val();
        e
          ? OSM.router.route(
              "/directions?from=" + encodeURIComponent(e) + OSM.formatHash(i)
            )
          : OSM.router.route("/directions" + OSM.formatHash(i));
      }),
      $(".search_form").on("submit", function (t) {
        t.preventDefault(), $("header").addClass("closed");
        var e = $(this).find("input[name=query]").val();
        e
          ? OSM.router.route(
              "/search?query=" + encodeURIComponent(e) + OSM.formatHash(i)
            )
          : OSM.router.route("/" + OSM.formatHash(i));
      }),
      $(".describe_location").on("click", function (t) {
        t.preventDefault();
        var e = i.getCenter().wrap(),
          n = OSM.zoomPrecision(i.getZoom());
        OSM.router.route(
          "/search?whereami=1&query=" +
            encodeURIComponent(e.lat.toFixed(n) + "," + e.lng.toFixed(n))
        );
      }),
      $("#sidebar_content")
        .on("click", ".search_more a", t)
        .on("click", ".search_results_entry a.set_position", o)
        .on("mouseover", "li.search_results_entry:has(a.set_position)", e)
        .on("mouseout", "li.search_results_entry:has(a.set_position)", n)
        .on(
          "mousedown",
          "li.search_results_entry:has(a.set_position)",
          function () {
            var e = !1;
            $(this)
              .one("click", function (t) {
                e ||
                  $(t.target).is("a") ||
                  $(this).find("a.set_position").simulate("click", t);
              })
              .one("mousemove", function () {
                e = !0;
              });
          }
        );
    var s = L.layerGroup().addTo(i),
      c = {};
    return (
      (c.pushstate = c.popstate = function (t) {
        var e = r.parse(t.substring(t.indexOf("?") + 1));
        $(".search_form input[name=query]").val(e.query),
          $(".describe_location").hide(),
          OSM.loadSidebarContent(t, c.load);
      }),
      (c.load = function () {
        return (
          $(".search_results_entry").each(function (n) {
            var o = $(this);
            $.ajax({
              url: o.data("href"),
              method: "GET",
              data: {
                zoom: i.getZoom(),
                minlon: i.getBounds().getWest(),
                minlat: i.getBounds().getSouth(),
                maxlon: i.getBounds().getEast(),
                maxlat: i.getBounds().getNorth(),
              },
              success: function (t) {
                if ((o.html(t), 0 === n)) {
                  var e = o.find("*[data-lat][data-lon]:first").first();
                  e.length && a(e.data());
                }
              },
            });
          }),
          i.getState()
        );
      }),
      (c.unload = function () {
        s.clearLayers(),
          $(".search_form input[name=query]").val(""),
          $(".describe_location").fadeIn(100);
      }),
      c
    );
  }),
  (OSM.initializeBrowse = function (e) {
    function n() {
      var t = e.getBounds();
      (s && s.contains(t)) || o();
    }
    function r(t, e, n, o) {
      $("#browse_status").html(
        $("<p class='warning'></p>")
          .text(
            I18n.t("browse.start_rjs.feature_warning", {
              num_features: t,
              max_features: e,
            })
          )
          .prepend($("<span class='icon close'></span>").click(o))
          .append(
            $("<input type='submit'>")
              .val(I18n.t("browse.start_rjs.load_data"))
              .click(n)
          )
      );
    }
    function o() {
      var i = e.getBounds(),
        t = "/api/" + OSM.API_VERSION + "/map?bbox=" + i.toBBoxString(),
        a = 2e3;
      l && l.abort(),
        (l = $.ajax({
          url: t,
          success: function (t) {
            function e() {
              $("#browse_status").empty(), d.addData(o), (s = i);
            }
            function n() {
              $("#browse_status").empty();
            }
            d.clearLayers(), (c = null);
            var o = d.buildFeatures(t);
            o.length < a ? e() : r(o.length, a, e, n), (l = null);
          },
        }));
    }
    function i(t) {
      c && c.setStyle(c.originalStyle),
        (t.originalStyle = t.options),
        t.setStyle({ color: "#0000ff", weight: 8 }),
        OSM.router.route("/" + t.feature.type + "/" + t.feature.id),
        (c = t);
    }
    var s,
      c,
      l,
      d = e.dataLayer;
    d.setStyle({
      way: { weight: 3, color: "#000000", opacity: 0.4 },
      area: { weight: 3, color: "#ff0000" },
      node: { color: "#00ff00" },
    }),
      (d.isWayArea = function () {
        return !1;
      }),
      d.on("click", function (t) {
        i(t.layer);
      }),
      e.on("layeradd", function (t) {
        t.layer === d && (e.on("moveend", n), n());
      }),
      e.on("layerremove", function (t) {
        t.layer === d && (e.off("moveend", n), $("#browse_status").empty());
      });
  }),
  (OSM.Export = function (n) {
    function e() {
      return L.latLngBounds(
        L.latLng($("#minlat").val(), $("#minlon").val()),
        L.latLng($("#maxlat").val(), $("#maxlon").val())
      );
    }
    function t() {
      var t = e();
      n.fitBounds(t), l.setBounds(t), l.enable(), r();
    }
    function o(t) {
      t.preventDefault(),
        $("#drag_box").hide(),
        l.setBounds(n.getBounds().pad(-0.2)),
        l.enable(),
        r();
    }
    function i() {
      a(l.isEnabled() ? l.getBounds() : n.getBounds()), r();
    }
    function a(t) {
      var e = OSM.zoomPrecision(n.getZoom());
      $("#minlon").val(t.getWest().toFixed(e)),
        $("#minlat").val(t.getSouth().toFixed(e)),
        $("#maxlon").val(t.getEast().toFixed(e)),
        $("#maxlat").val(t.getNorth().toFixed(e)),
        $("#export_overpass").attr(
          "href",
          "https://overpass-api.de/api/map?bbox=" +
            $("#minlon").val() +
            "," +
            $("#minlat").val() +
            "," +
            $("#maxlon").val() +
            "," +
            $("#maxlat").val()
        );
    }
    function r() {
      $("#export_osm_too_large").toggle(e().getSize() > OSM.MAX_REQUEST_AREA),
        $("#export_commit").toggle(e().getSize() < OSM.MAX_REQUEST_AREA);
    }
    function s(t) {
      e().getSize() > OSM.MAX_REQUEST_AREA && t.preventDefault();
    }
    var c = {},
      l = new L.LocationFilter({ enableButton: !1, adjustButton: !1 }).on(
        "change",
        i
      );
    return (
      (c.pushstate = c.popstate = function (t) {
        $("#export_tab").addClass("current"), OSM.loadSidebarContent(t, c.load);
      }),
      (c.load = function () {
        return (
          n.addLayer(l).on("moveend", i),
          $("#maxlat, #minlon, #maxlon, #minlat").change(t),
          $("#drag_box").click(o),
          $(".export_form").on("submit", s),
          i(),
          n.getState()
        );
      }),
      (c.unload = function () {
        n.removeLayer(l).off("moveend", i),
          $("#export_tab").removeClass("current");
      }),
      c
    );
  }),
  (OSM.initializeNotes = function (o) {
    function i(t, e) {
      var n = t;
      return (
        n
          ? n.setIcon(c[e.properties.status])
          : (((n = L.marker(e.geometry.coordinates.reverse(), {
              icon: c[e.properties.status],
              title: e.properties.comments[0].text,
              opacity: 0.8,
              interactive: !0,
            })).id = e.properties.id),
            n.addTo(r)),
        n
      );
    }
    function e() {
      function t(t) {
        function e(t) {
          var e = n[t.properties.id];
          delete n[t.properties.id], (s[t.properties.id] = i(e, t));
        }
        var n = s;
        for (var o in ((s = {}), t.features.forEach(e), n)) r.removeLayer(n[o]);
        a = null;
      }
      var e = o.getBounds();
      if (e.getSize() <= OSM.MAX_NOTE_REQUEST_AREA) {
        var n =
          "/api/" + OSM.API_VERSION + "/notes.json?bbox=" + e.toBBoxString();
        a && a.abort(), (a = $.ajax({ url: n, success: t }));
      }
    }
    var a,
      r = o.noteLayer,
      s = {},
      c = {
        new: L.icon({
          iconUrl: OSM.NEW_NOTE_MARKER,
          iconSize: [25, 40],
          iconAnchor: [12, 40],
        }),
        open: L.icon({
          iconUrl: OSM.OPEN_NOTE_MARKER,
          iconSize: [25, 40],
          iconAnchor: [12, 40],
        }),
        closed: L.icon({
          iconUrl: OSM.CLOSED_NOTE_MARKER,
          iconSize: [25, 40],
          iconAnchor: [12, 40],
        }),
      };
    o
      .on("layeradd", function (t) {
        t.layer === r && (e(), o.on("moveend", e));
      })
      .on("layerremove", function (t) {
        t.layer === r && (o.off("moveend", e), r.clearLayers(), (s = {}));
      }),
      r.on("click", function (t) {
        t.layer.id && OSM.router.route("/note/" + t.layer.id);
      }),
      (r.getLayerId = function (t) {
        return t.id;
      });
  }),
  (OSM.History = function (r) {
    function e(t) {
      var e = l.getLayer(t);
      e && e.setStyle({ fillOpacity: 0.3, color: "#FF6600", weight: 3 }),
        $("#changeset_" + t).addClass("selected");
    }
    function n(t) {
      var e = l.getLayer(t);
      e && e.setStyle({ fillOpacity: 0, color: "#FF9500", weight: 2 }),
        $("#changeset_" + t).removeClass("selected");
    }
    function o(t, e) {
      $("#changeset_" + t)
        .find("a.changeset_id")
        .simulate("click", e);
    }
    function t() {
      var t = { list: "1" };
      "/history" === window.location.pathname &&
        (t.bbox = r.getBounds().wrap().toBBoxString()),
        $.ajax({
          url: window.location.pathname,
          method: "GET",
          data: t,
          success: function (t) {
            $("#sidebar_content .changesets").html(t), s();
          },
        });
      var e = $('link[type="application/atom+xml"]'),
        n = e.attr("href").split("?")[0];
      e.attr("href", n + "?bbox=" + t.bbox);
    }
    function i(t) {
      t.preventDefault(), t.stopPropagation();
      var e = $(this).parents(".changeset_more");
      $(this).hide(),
        e.find(".loader").show(),
        $.get($(this).attr("href"), function (t) {
          e.replaceWith(t), s();
        });
    }
    function a() {
      l.clearLayers(),
        d.forEach(function (t) {
          var e = r.project(L.latLng(t.bbox.minlat, t.bbox.minlon)),
            n = r.project(L.latLng(t.bbox.maxlat, t.bbox.maxlon)),
            o = n.x - e.x,
            i = e.y - n.y,
            a = 20;
          o < a && ((e.x -= (a - o) / 2), (n.x += (a - o) / 2)),
            i < a && ((e.y += (a - i) / 2), (n.y -= (a - i) / 2)),
            (t.bounds = L.latLngBounds(r.unproject(e), r.unproject(n)));
        }),
        d.sort(function (t, e) {
          return e.bounds.getSize() - t.bounds.getSize();
        });
      for (var t = 0; t < d.length; ++t) {
        var e = d[t],
          n = L.rectangle(e.bounds, {
            weight: 2,
            color: "#FF9500",
            opacity: 1,
            fillColor: "#FFFFAF",
            fillOpacity: 0,
          });
        (n.id = e.id), n.addTo(l);
      }
    }
    function s() {
      if (
        ((d = $("[data-changeset]")
          .map(function (t, e) {
            return $(e).data("changeset");
          })
          .get()
          .filter(function (t) {
            return t.bbox;
          })),
        a(),
        "/history" !== window.location.pathname)
      ) {
        var t = l.getBounds();
        t.isValid() && r.fitBounds(t);
      }
    }
    var c = {};
    $("#sidebar_content")
      .on("click", ".changeset_more a", i)
      .on("mouseover", "[data-changeset]", function () {
        e($(this).data("changeset").id);
      })
      .on("mouseout", "[data-changeset]", function () {
        n($(this).data("changeset").id);
      })
      .on("mousedown", "[data-changeset]", function () {
        var e = !1;
        $(this)
          .one("click", function (t) {
            e || $(t.target).is("a") || o($(this).data("changeset").id, t);
          })
          .one("mousemove", function () {
            e = !0;
          });
      });
    var l = L.featureGroup()
      .on("mouseover", function (t) {
        e(t.layer.id);
      })
      .on("mouseout", function (t) {
        n(t.layer.id);
      })
      .on("click", function (t) {
        o(t.layer.id, t);
      });
    l.getLayerId = function (t) {
      return t.id;
    };
    var d = [];
    return (
      (c.pushstate = c.popstate = function (t) {
        $("#history_tab").addClass("current"),
          OSM.loadSidebarContent(t, c.load);
      }),
      (c.load = function () {
        r.addLayer(l),
          "/history" === window.location.pathname && r.on("moveend", t),
          r.on("zoomend", a),
          t();
      }),
      (c.unload = function () {
        r.removeLayer(l),
          r.off("moveend", t),
          $("#history_tab").removeClass("current");
      }),
      c
    );
  }),
  (OSM.Note = function (o) {
    function i(t, e, n) {
      $(t).find("input[type=submit]").prop("disabled", !0),
        $.ajax({
          url: n,
          type: e,
          oauth: !0,
          data: { text: $(t.text).val() },
          success: function () {
            OSM.loadSidebarContent(window.location.pathname, c.load);
          },
        });
    }
    function e(t) {
      s.find("input[type=submit]").on("click", function (t) {
        t.preventDefault();
        var e = $(t.target).data();
        i(t.target.form, e.method, e.url);
      }),
        s.find("textarea").on("input", function (t) {
          var e = t.target.form;
          "" === $(t.target).val()
            ? ($(e.close).val(I18n.t("javascripts.notes.show.resolve")),
              $(e.comment).prop("disabled", !0))
            : ($(e.close).val(
                I18n.t("javascripts.notes.show.comment_and_resolve")
              ),
              $(e.comment).prop("disabled", !1));
        }),
        s.find("textarea").val("").trigger("input");
      var e = $(".details").data(),
        n = L.latLng(e.coordinates.split(","));
      o.hasLayer(a) ||
        ((a = L.circleMarker(n, {
          weight: 2.5,
          radius: 20,
          fillOpacity: 0.5,
          color: "#FF6200",
        })),
        o.addLayer(a)),
        o.hasLayer(r) && o.removeLayer(r),
        (r = L.marker(n, { icon: l[e.status], opacity: 1, interactive: !0 })),
        o.addLayer(r),
        t && t();
    }
    function n() {
      var t = $(".details").data(),
        e = L.latLng(t.coordinates.split(","));
      (window.location.hash && !window.location.hash.match(/^#?c[0-9]+$/)) ||
        OSM.router.withoutMoveListener(function () {
          o.setView(e, 15, { reset: !0 });
        });
    }
    var a,
      r,
      s = $("#sidebar_content"),
      c = {},
      l = {
        new: L.icon({
          iconUrl: OSM.NEW_NOTE_MARKER,
          iconSize: [25, 40],
          iconAnchor: [12, 40],
        }),
        open: L.icon({
          iconUrl: OSM.OPEN_NOTE_MARKER,
          iconSize: [25, 40],
          iconAnchor: [12, 40],
        }),
        closed: L.icon({
          iconUrl: OSM.CLOSED_NOTE_MARKER,
          iconSize: [25, 40],
          iconAnchor: [12, 40],
        }),
      };
    return (
      (c.pushstate = c.popstate = function (t) {
        OSM.loadSidebarContent(t, function () {
          e(function () {
            var t = $(".details").data(),
              e = L.latLng(t.coordinates.split(","));
            o.getBounds().contains(e) || n();
          });
        });
      }),
      (c.load = function () {
        e(n);
      }),
      (c.unload = function () {
        o.hasLayer(a) && o.removeLayer(a), o.hasLayer(r) && o.removeLayer(r);
      }),
      c
    );
  }),
  (OSM.NewNote = function (i) {
    function a(e, t, n) {
      function o(t, e) {
        u.find("textarea").val(""),
          r(t),
          (c = null),
          d.removeLayer(e),
          p.removeClass("active"),
          OSM.router.route("/note/" + t.properties.id);
      }
      var i = e.getLatLng().wrap();
      (e.options.draggable = !1),
        e.dragging.disable(),
        $(t).find("input[type=submit]").prop("disabled", !0),
        $.ajax({
          url: n,
          type: "POST",
          oauth: !0,
          data: { lat: i.lat, lon: i.lng, text: $(t.text).val() },
          success: function (t) {
            o(t, e);
          },
        });
    }
    function r(t) {
      var e = L.marker(t.geometry.coordinates.reverse(), {
        icon: h[t.properties.status],
        opacity: 0.9,
        interactive: !0,
      });
      return (e.id = t.properties.id), e.addTo(d), e;
    }
    function s(t, e) {
      "dragstart" === e && i.hasLayer(n)
        ? i.removeLayer(n)
        : (i.hasLayer(n) && i.removeLayer(n),
          (n = L.circleMarker(t, {
            weight: 2.5,
            radius: 20,
            fillOpacity: 0.5,
            color: "#FF6200",
          })),
          i.addLayer(n));
    }
    var c,
      n,
      l = require("querystring-component"),
      d = i.noteLayer,
      u = $("#sidebar_content"),
      e = {},
      p = $(".control-note .control-button"),
      h = {
        new: L.icon({
          iconUrl: OSM.NEW_NOTE_MARKER,
          iconSize: [25, 40],
          iconAnchor: [12, 40],
        }),
        open: L.icon({
          iconUrl: OSM.OPEN_NOTE_MARKER,
          iconSize: [25, 40],
          iconAnchor: [12, 40],
        }),
        closed: L.icon({
          iconUrl: OSM.CLOSED_NOTE_MARKER,
          iconSize: [25, 40],
          iconAnchor: [12, 40],
        }),
      };
    return (
      p.on("click", function (t) {
        t.preventDefault(),
          t.stopPropagation(),
          $(this).hasClass("disabled") || OSM.router.route("/note/new");
      }),
      (e.pushstate = e.popstate = function (t) {
        OSM.loadSidebarContent(t, function () {
          e.load(t);
        });
      }),
      (e.load = function (t) {
        function e(t) {
          $(t.target.form.add).prop("disabled", "" === $(t.target).val());
        }
        if (!p.hasClass("disabled") && !p.hasClass("active")) {
          p.addClass("active"), i.addLayer(d);
          var n,
            o = l.parse(t.substring(t.indexOf("?") + 1));
          return (
            (n = o.lat && o.lon ? L.latLng(o.lat, o.lon) : i.getCenter()),
            i.panInside(n, { padding: [50, 50] }),
            (c = L.marker(n, {
              icon: h["new"],
              opacity: 0.9,
              draggable: !0,
            })).on("dragstart dragend", function (t) {
              s(c.getLatLng(), t.type);
            }),
            c.addTo(d),
            s(c.getLatLng()),
            c
              .on("remove", function () {
                p.removeClass("active");
              })
              .on("dragstart", function () {
                $(c).stopTime("removenote");
              })
              .on("dragend", function () {
                u.find("textarea").focus();
              }),
            u.find("textarea").on("input", e).focus(),
            u.find("input[type=submit]").on("click", function (t) {
              t.preventDefault(), a(c, t.target.form, "/api/0.6/notes.json");
            }),
            i.getState()
          );
        }
      }),
      (e.unload = function () {
        d.removeLayer(c), i.removeLayer(n), p.removeClass("active");
      }),
      e
    );
  }),
  (OSM.Directions = function (s) {
    function t(n, t) {
      var o = {};
      return (
        (o.marker = L.marker([0, 0], {
          icon: L.icon({
            iconUrl: t,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: OSM.MARKER_SHADOW,
            shadowSize: [41, 41],
          }),
          draggable: !0,
          autoPan: !0,
        })),
        o.marker.on("drag dragend", function (t) {
          var e = "drag" === t.type;
          (e && !h.draggable) ||
            (e && p) ||
            (o.setLatLng(t.target.getLatLng()), s.hasLayer(v) && d(!1, !e));
        }),
        n.on("keydown", function () {
          n.removeClass("error");
        }),
        n.on("change", function (t) {
          u = !0;
          var e = t.target.value;
          o.setValue(e);
        }),
        (o.setValue = function (t, e) {
          (o.value = t),
            delete o.latlng,
            n.removeClass("error"),
            n.val(t),
            e ? o.setLatLng(e) : o.getGeocode();
        }),
        (o.getGeocode = function () {
          if (o.value) {
            o.awaitingGeocode = !0;
            var t = s.getBounds().toBBoxString();
            $.getJSON(
              OSM.NOMINATIM_URL +
                "search?q=" +
                encodeURIComponent(o.value) +
                "&format=json&viewbox=" +
                t,
              function (t) {
                if (
                  ((o.awaitingGeocode = !1),
                  (o.hasGeocode = !0),
                  0 === t.length)
                )
                  return (
                    n.addClass("error"),
                    void alert(
                      I18n.t("javascripts.directions.errors.no_place", {
                        place: o.value,
                      })
                    )
                  );
                o.setLatLng(L.latLng(t[0])),
                  n.val(t[0].display_name),
                  u && d(!(u = !1), !0);
              }
            );
          }
        }),
        (o.setLatLng = function (t) {
          var e = OSM.zoomPrecision(s.getZoom());
          n.val(t.lat.toFixed(e) + ", " + t.lng.toFixed(e)),
            (o.hasGeocode = !0),
            (o.latlng = t),
            o.marker.setLatLng(t).addTo(s);
        }),
        o
      );
    }
    function c(t) {
      return t < 1e3
        ? Math.round(t) + "m"
        : t < 1e4
        ? (t / 1e3).toFixed(1) + "km"
        : Math.round(t / 1e3) + "km";
    }
    function l(t) {
      var e = Math.round(t / 60),
        n = Math.floor(e / 60);
      return n + ":" + ((e -= 60 * n) < 10 ? "0" : "") + e;
    }
    function a(e) {
      return n.findIndex(function (t) {
        return t.id === e;
      });
    }
    function r(t) {
      (h = n[t]), o.val(t);
    }
    function d(o, i) {
      p && p.abort();
      for (var t = 0; t < 2; ++t) {
        var e = _[t];
        e.hasGeocode || e.awaitingGeocode || (e.getGeocode(), (u = !0));
      }
      if (_[0].awaitingGeocode || _[1].awaitingGeocode) u = !0;
      else {
        var n = _[0].latlng,
          a = _[1].latlng;
        if (n && a) {
          $("header").addClass("closed");
          var r = OSM.zoomPrecision(s.getZoom());
          OSM.router.replace(
            "/directions?" +
              m.stringify({
                engine: h.id,
                route:
                  n.lat.toFixed(r) +
                  "," +
                  n.lng.toFixed(r) +
                  ";" +
                  a.lat.toFixed(r) +
                  "," +
                  a.lng.toFixed(r),
              })
          ),
            $("#sidebar_content").html(
              $(".directions_form .loader_copy").html()
            ),
            s.setSidebarOverlaid(!1),
            (p = h.getRoute([n, a], function (t, e) {
              if (((p = null), t))
                return (
                  s.removeLayer(v),
                  void (
                    i &&
                    $("#sidebar_content").html(
                      '<p class="search_results_error">' +
                        I18n.t("javascripts.directions.errors.no_route") +
                        "</p>"
                    )
                  )
                );
              v.setLatLngs(e.line).addTo(s),
                o && s.fitBounds(v.getBounds().pad(0.05));
              var n =
                '<h2><a class="geolink" href="#"><span class="icon close"></span></a>' +
                I18n.t("javascripts.directions.directions") +
                '</h2><p id="routing_summary">' +
                I18n.t("javascripts.directions.distance") +
                ": " +
                c(e.distance) +
                ". " +
                I18n.t("javascripts.directions.time") +
                ": " +
                l(e.time) +
                ".";
              "undefined" != typeof e.ascend &&
                "undefined" != typeof e.descend &&
                (n +=
                  "<br />" +
                  I18n.t("javascripts.directions.ascend") +
                  ": " +
                  Math.round(e.ascend) +
                  "m. " +
                  I18n.t("javascripts.directions.descend") +
                  ": " +
                  Math.round(e.descend) +
                  "m."),
                (n += '</p><table id="turnbyturn" />'),
                $("#sidebar_content").html(n),
                e.steps.forEach(function (t) {
                  var e = t[0],
                    n = t[1],
                    o = t[2],
                    i = t[3],
                    a = t[4];
                  i =
                    i < 5
                      ? ""
                      : i < 200
                      ? String(10 * Math.round(i / 10)) + "m"
                      : i < 1500
                      ? String(100 * Math.round(i / 100)) + "m"
                      : i < 5e3
                      ? String(Math.round(i / 100) / 10) + "km"
                      : String(Math.round(i / 1e3)) + "km";
                  var r = $("<tr class='turn'/>");
                  r.append("<td><div class='direction i" + n + "'/></td> "),
                    r.append("<td class='instruction'>" + o),
                    r.append("<td class='distance'>" + i),
                    r.on("click", function () {
                      f.setLatLng(e)
                        .setContent("<p>" + o + "</p>")
                        .openOn(s);
                    }),
                    r.hover(
                      function () {
                        g.setLatLngs(a).addTo(s);
                      },
                      function () {
                        s.removeLayer(g);
                      }
                    ),
                    $("#turnbyturn").append(r);
                }),
                $("#sidebar_content").append(
                  '<p id="routing_credit">' +
                    I18n.t("javascripts.directions.instructions.courtesy", {
                      link: h.creditline,
                    }) +
                    "</p>"
                ),
                $("#sidebar_content a.geolink").on("click", function (t) {
                  t.preventDefault(),
                    s.removeLayer(v),
                    $("#sidebar_content").html(""),
                    s.setSidebarOverlaid(!0);
                });
            }));
        }
      }
    }
    var u,
      p,
      h,
      m = require("querystring-component"),
      f = L.popup({ autoPanPadding: [100, 100] }),
      v = L.polyline([], { color: "#03f", opacity: 0.3, weight: 10 }),
      g = L.polyline([], { color: "#ff0", opacity: 0.5, weight: 12 }),
      _ = [
        t($("input[name='route_from']"), OSM.MARKER_GREEN),
        t($("input[name='route_to']"), OSM.MARKER_RED),
      ],
      e = new Date();
    e.setYear(e.getFullYear() + 10);
    var n = OSM.Directions.engines;
    n.sort(function (t, e) {
      var n = I18n.t("javascripts.directions.engines." + t.id),
        o = I18n.t("javascripts.directions.engines." + e.id);
      return n.localeCompare(o);
    });
    var o = $("select.routing_engines");
    n.forEach(function (t, e) {
      o.append(
        "<option value='" +
          e +
          "'>" +
          I18n.t("javascripts.directions.engines." + t.id) +
          "</option>"
      );
    }),
      $(".directions_form .reverse_directions").on("click", function () {
        var t = _[0].latlng,
          e = _[1].latlng,
          n = "",
          o = "";
        t && (n = t.lat + "," + t.lng),
          e && (o = e.lat + "," + e.lng),
          OSM.router.route(
            "/directions?" +
              m.stringify({
                from: $("#route_to").val(),
                to: $("#route_from").val(),
                route: o + ";" + n,
              })
          );
      }),
      $(".directions_form .close").on("click", function (t) {
        t.preventDefault();
        var e = _[0].value;
        e
          ? OSM.router.route(
              "/?query=" + encodeURIComponent(e) + OSM.formatHash(s)
            )
          : OSM.router.route("/" + OSM.formatHash(s));
      });
    var i = a("fossgis_osrm_car");
    $.cookie("_osm_directions_engine") &&
      (i = a($.cookie("_osm_directions_engine"))),
      r(i),
      o.on("change", function (t) {
        (h = n[t.target.selectedIndex]),
          $.cookie("_osm_directions_engine", h.id, { expires: e, path: "/" }),
          s.hasLayer(v) && d(!0, !0);
      }),
      $(".directions_form").on("submit", function (t) {
        t.preventDefault(), d(!0, !0);
      }),
      $(".routing_marker").on("dragstart", function (t) {
        var e = t.originalEvent.dataTransfer;
        e.effectAllowed = "move";
        var n = { type: $(this).data("type") };
        if ((e.setData("text", JSON.stringify(n)), e.setDragImage)) {
          var o = $("<img>").attr("src", $(t.originalEvent.target).attr("src"));
          e.setDragImage(o.get(0), 12, 21);
        }
      });
    var y = {};
    return (
      (y.pushstate = y.popstate = function () {
        $(".search_form").hide(),
          $(".directions_form").show(),
          $("#map").on("dragend dragover", function (t) {
            t.preventDefault();
          }),
          $("#map").on("drop", function (t) {
            t.preventDefault();
            var e = t.originalEvent,
              n = JSON.parse(e.dataTransfer.getData("text")).type,
              o = L.DomEvent.getMousePosition(e, s.getContainer());
            o.y += 20;
            var i = s.containerPointToLatLng(o);
            _["from" === n ? 0 : 1].setLatLng(i), d(!0, !0);
          });
        var t = m.parse(location.search.substring(1)),
          e = (t.route || "").split(";"),
          n = e[0] && L.latLng(e[0].split(",")),
          o = e[1] && L.latLng(e[1].split(","));
        if (t.engine) {
          var i = a(t.engine);
          0 <= i && r(i);
        }
        _[0].setValue(t.from || "", n),
          _[1].setValue(t.to || "", o),
          s.setSidebarOverlaid(!n || !o),
          d(!0, !0);
      }),
      (y.load = function () {
        y.pushstate();
      }),
      (y.unload = function () {
        $(".search_form").show(),
          $(".directions_form").hide(),
          $("#map").off("dragend dragover drop"),
          s
            .removeLayer(f)
            .removeLayer(v)
            .removeLayer(_[0].marker)
            .removeLayer(_[1].marker);
      }),
      y
    );
  }),
  (OSM.Directions.engines = []),
  (OSM.Directions.addEngine = function (t, e) {
    ("http:" === document.location.protocol || e) &&
      OSM.Directions.engines.push(t);
  }),
  OSM.Directions.addEngine(new FOSSGISEngine("fossgis_osrm_car", "car"), !0),
  OSM.Directions.addEngine(new FOSSGISEngine("fossgis_osrm_bike", "bike"), !0),
  OSM.Directions.addEngine(new FOSSGISEngine("fossgis_osrm_foot", "foot"), !0),
  OSM.Directions.addEngine(new GraphHopperEngine("graphhopper_car", "car"), !0),
  OSM.Directions.addEngine(
    new GraphHopperEngine("graphhopper_bicycle", "bike"),
    !0
  ),
  OSM.Directions.addEngine(
    new GraphHopperEngine("graphhopper_foot", "foot"),
    !0
  ),
  (OSM.Changeset = function (n) {
    function o(t, e) {
      n.addObject({ type: "changeset", id: parseInt(t, 10) }, function (t) {
        window.location.hash ||
          !t.isValid() ||
          (!e && n.getBounds().contains(t)) ||
          OSM.router.withoutMoveListener(function () {
            n.fitBounds(t);
          });
      });
    }
    function i(t, e, n, o) {
      var i;
      $(t).find("input[type=submit]").prop("disabled", !0),
        (i = o ? { text: $(t.text).val() } : {}),
        $.ajax({
          url: n,
          type: e,
          oauth: !0,
          data: i,
          success: function () {
            OSM.loadSidebarContent(window.location.pathname, s.load);
          },
        });
    }
    function a() {
      t.find("input[name=comment]").on("click", function (t) {
        t.preventDefault();
        var e = $(t.target).data();
        i(t.target.form, e.method, e.url, !0);
      }),
        t.find(".action-button").on("click", function (t) {
          t.preventDefault();
          var e = $(t.target).data();
          i(t.target.form, e.method, e.url);
        }),
        t.find("textarea").on("input", function (t) {
          var e = t.target.form;
          "" === $(t.target).val()
            ? $(e.comment).prop("disabled", !0)
            : $(e.comment).prop("disabled", !1);
        }),
        t.find("textarea").val("").trigger("input");
    }
    var r,
      s = {},
      t = $("#sidebar_content");
    return (
      (s.pushstate = s.popstate = function (t, e) {
        OSM.loadSidebarContent(t, function () {
          s.load(t, e);
        });
      }),
      (s.load = function (t, e) {
        e && (r = e), a(), o(r, !0);
      }),
      (s.unload = function () {
        n.removeObject();
      }),
      s
    );
  }),
  (OSM.Query = function (d) {
    function l(t) {
      if (t.tags) for (var e in t.tags) if (r.indexOf(e) < 0) return !0;
      return !1;
    }
    function u(t) {
      var e = t.tags,
        n = "";
      if ("administrative" === e.boundary && e.admin_level)
        n = I18n.t(
          "geocoder.search_osm_nominatim.admin_levels.level" + e.admin_level,
          {
            defaultValue: I18n.t(
              "geocoder.search_osm_nominatim.prefix.boundary.administrative"
            ),
          }
        );
      else {
        var o,
          i,
          a = I18n.t("geocoder.search_osm_nominatim.prefix");
        for (o in e) if (((i = e[o]), a[o] && a[o][i])) return a[o][i];
        for (o in e) {
          if (((i = e[o]), a[o]))
            return (
              i.substr(0, 1).toUpperCase() + i.substr(1).replace(/_/g, " ")
            );
        }
      }
      return n || (n = I18n.t("javascripts.query." + t.type)), n;
    }
    function p(t) {
      for (var e = t.tags, n = I18n.locales.get(), o = 0; o < n.length; o++)
        if (e["name:" + n[o]]) return e["name:" + n[o]];
      return e.name
        ? e.name
        : e.ref
        ? e.ref
        : e["addr:housename"]
        ? e["addr:housename"]
        : e["addr:housenumber"] && e["addr:street"]
        ? e["addr:housenumber"] + " " + e["addr:street"]
        : "#" + t.id;
    }
    function h(t) {
      var e;
      return (
        "node" === t.type && t.lat && t.lon
          ? (e = L.circleMarker([t.lat, t.lon], _))
          : "way" === t.type && t.geometry && 0 < t.geometry.length
          ? (e = L.polyline(
              t.geometry
                .filter(function (t) {
                  return null !== t;
                })
                .map(function (t) {
                  return [t.lat, t.lon];
                }),
              _
            ))
          : "relation" === t.type &&
            t.members &&
            (e = L.featureGroup(
              t.members.map(h).filter(function (t) {
                return void 0 !== t;
              })
            )),
        e
      );
    }
    function m(t, e, n, a, r, s) {
      var c = a.find("ul");
      c.empty(),
        a.show(),
        a.find(".loader").oneTime(1e3, "loading", function () {
          $(this).show();
        }),
        a.data("ajax") && a.data("ajax").abort(),
        a.data(
          "ajax",
          $.ajax({
            url: g,
            method: "POST",
            data: { data: "[timeout:10][out:json];" + n },
            success: function (t) {
              var e;
              a.find(".loader").stopTime("loading").hide(),
                r
                  ? ((e = t.elements.reduce(function (t, e) {
                      var n = e.type + e.id;
                      return (
                        "geometry" in e && delete e.bounds,
                        (t[n] = $.extend({}, t[n], e)),
                        t
                      );
                    }, {})),
                    (e = Object.keys(e).map(function (t) {
                      return e[t];
                    })))
                  : (e = t.elements),
                s && (e = e.sort(s));
              for (var n = 0; n < e.length; n++) {
                var o = e[n];
                if (l(o)) {
                  var i = $("<li>")
                    .addClass("query-result list-group-item")
                    .data("geometry", h(o))
                    .text(u(o) + " ")
                    .appendTo(c);
                  $("<a>")
                    .attr("href", "/" + o.type + "/" + o.id)
                    .text(p(o))
                    .appendTo(i);
                }
              }
              t.remark &&
                $("<li>")
                  .addClass("query-result list-group-item")
                  .text(
                    I18n.t("javascripts.query.error", {
                      server: g,
                      error: t.remark,
                    })
                  )
                  .appendTo(c),
                0 === c.find("li").length &&
                  $("<li>")
                    .addClass("query-result list-group-item")
                    .text(I18n.t("javascripts.query.nothing_found"))
                    .appendTo(c);
            },
            error: function (t, e, n) {
              a.find(".loader").stopTime("loading").hide(),
                $("<li>")
                  .addClass("query-result list-group-item")
                  .text(
                    I18n.t("javascripts.query." + e, { server: g, error: n })
                  )
                  .appendTo(c);
            },
          })
        );
    }
    function f(t, e) {
      return (
        (t.bounds.maxlon - t.bounds.minlon) *
          (t.bounds.maxlat - t.bounds.minlat) -
        (e.bounds.maxlat - e.bounds.minlat) *
          (e.bounds.maxlat - e.bounds.minlat)
      );
    }
    function i(t, e) {
      var n = L.latLng(t, e).wrap(),
        o = d.getBounds().wrap(),
        i = OSM.zoomPrecision(d.getZoom()),
        a =
          o.getSouth().toFixed(i) +
          "," +
          o.getWest().toFixed(i) +
          "," +
          o.getNorth().toFixed(i) +
          "," +
          o.getEast().toFixed(i),
        r = 10 * Math.pow(1.5, 19 - d.getZoom()),
        s = "around:" + r + "," + t + "," + e,
        c =
          "(" +
          ("node(" + s + ")") +
          ";" +
          ("way(" + s + ")") +
          ";);out tags geom(" +
          a +
          ");" +
          ("relation(" + s + ")") +
          ";out geom(" +
          a +
          ");",
        l =
          "is_in(" +
          t +
          "," +
          e +
          ")->.a;way(pivot.a);out tags bb;out ids geom(" +
          a +
          ");relation(pivot.a);out tags bb;";
      $("#sidebar_content .query-intro").hide(),
        v && d.removeLayer(v),
        (v = L.circle(n, r, _).addTo(d)),
        $(document).everyTime(
          75,
          "fadeQueryMarker",
          function (t) {
            10 === t
              ? d.removeLayer(v)
              : v.setStyle({
                  opacity: 1 - 0.1 * t,
                  fillOpacity: 0.5 - 0.05 * t,
                });
          },
          10
        ),
        m(n, r, c, $("#query-nearby"), !1),
        m(n, r, l, $("#query-isin"), !0, f);
    }
    function t(t) {
      var e = OSM.zoomPrecision(d.getZoom()),
        n = t.latlng.wrap(),
        o = n.lat.toFixed(e),
        i = n.lng.toFixed(e);
      OSM.router.route("/query?lat=" + o + "&lon=" + i);
    }
    function e() {
      o.addClass("active"),
        d.on("click", t),
        $(d.getContainer()).addClass("query-active");
    }
    function n() {
      v && d.removeLayer(v),
        $(d.getContainer())
          .removeClass("query-active")
          .removeClass("query-disabled"),
        d.off("click", t),
        o.removeClass("active");
    }
    var v,
      a = require("querystring-component"),
      g = OSM.OVERPASS_URL,
      o = $(".control-query .control-button"),
      r = [
        "source",
        "source_ref",
        "source:ref",
        "history",
        "attribution",
        "created_by",
        "tiger:county",
        "tiger:tlid",
        "tiger:upload_uuid",
        "KSJ2:curve_id",
        "KSJ2:lat",
        "KSJ2:lon",
        "KSJ2:coordinate",
        "KSJ2:filename",
        "note:ja",
      ],
      _ = {
        color: "#FF6200",
        weight: 4,
        opacity: 1,
        fillOpacity: 0.5,
        interactive: !1,
      };
    o
      .on("click", function (t) {
        t.preventDefault(),
          t.stopPropagation(),
          o.hasClass("active") ? n() : o.hasClass("disabled") || e();
      })
      .on("disabled", function () {
        o.hasClass("active") &&
          (d.off("click", t),
          $(d.getContainer())
            .removeClass("query-active")
            .addClass("query-disabled"),
          $(this).tooltip("show"));
      })
      .on("enabled", function () {
        o.hasClass("active") &&
          (d.on("click", t),
          $(d.getContainer())
            .removeClass("query-disabled")
            .addClass("query-active"),
          $(this).tooltip("hide"));
      }),
      $("#sidebar_content")
        .on("mouseover", ".query-results li.query-result", function () {
          var t = $(this).data("geometry");
          t && d.addLayer(t), $(this).addClass("selected");
        })
        .on("mouseout", ".query-results li.query-result", function () {
          var t = $(this).data("geometry");
          t && d.removeLayer(t), $(this).removeClass("selected");
        })
        .on("mousedown", ".query-results li.query-result", function () {
          var n = !1;
          $(this)
            .one("click", function (t) {
              if (!n) {
                var e = $(this).data("geometry");
                e && d.removeLayer(e),
                  $(t.target).is("a") || $(this).find("a").simulate("click", t);
              }
            })
            .one("mousemove", function () {
              n = !0;
            });
        });
    var s = {};
    return (
      (s.pushstate = s.popstate = function (t) {
        OSM.loadSidebarContent(t, function () {
          s.load(t, !0);
        });
      }),
      (s.load = function (t, e) {
        var n = a.parse(t.substring(t.indexOf("?") + 1)),
          o = L.latLng(n.lat, n.lon);
        window.location.hash ||
          e ||
          d.getBounds().contains(o) ||
          OSM.router.withoutMoveListener(function () {
            d.setView(o, 15);
          }),
          i(n.lat, n.lon);
      }),
      (s.unload = function (t) {
        t || n();
      }),
      s
    );
  }),
  (OSM.Router = function (i, t) {
    function e(t, o) {
      var i = new RegExp(
          "^" +
            t
              .replace(n, "\\$&")
              .replace(a, "(?:$1)?")
              .replace(r, function (t, e) {
                return e ? t : "([^/]+)";
              })
              .replace(s, "(.*?)") +
            "(?:\\?.*)?$"
        ),
        e = {
          match: function (t) {
            return i.test(t);
          },
          run: function (t, e) {
            var n = [];
            return (
              e &&
                (n = i.exec(e).map(function (t, e) {
                  return 0 < e && t ? decodeURIComponent(t) : t;
                })),
              (n = n.concat(Array.prototype.slice.call(arguments, 2))),
              (o[t] || $.noop).apply(o, n)
            );
          },
        };
      return e;
    }
    var n = /[-{}[\]+?.,\\^$|#\s]/g,
      a = /\((.*?)\)/g,
      r = /(\(\?)?:\w+/g,
      s = /\*\w+/g,
      c = [];
    for (var o in t) c.push(new e(o, t[o]));
    c.recognize = function (t) {
      for (var e = 0; e < this.length; e++)
        if (this[e].match(t)) return this[e];
    };
    var l =
        window.location.pathname.replace(/(.)\/$/, "$1") +
        window.location.search,
      d = c.recognize(l),
      u = location.hash || OSM.formatHash(i),
      p = {};
    return (
      window.history && window.history.pushState
        ? ($(window).on("popstate", function (t) {
            if (t.originalEvent.state) {
              var e = window.location.pathname + window.location.search,
                n = c.recognize(e);
              e !== l &&
                (d.run("unload", null, n === d),
                (l = e),
                (d = n).run("popstate", l),
                i.setState(t.originalEvent.state, { animate: !1 }));
            }
          }),
          (p.route = function (t) {
            var e = t.replace(/#.*/, ""),
              n = c.recognize(e);
            if (!n) return !1;
            d.run("unload", null, n === d);
            var o = OSM.parseHash(t);
            return (
              i.setState(o),
              window.history.pushState(o, document.title, t),
              (l = e),
              (d = n).run("pushstate", l),
              !0
            );
          }),
          (p.replace = function (t) {
            window.history.replaceState(OSM.parseHash(t), document.title, t);
          }),
          (p.stateChange = function (t) {
            t.center
              ? window.history.replaceState(
                  t,
                  document.title,
                  OSM.formatHash(t)
                )
              : window.history.replaceState(t, document.title, window.location);
          }))
        : ((p.route = p.replace = function (t) {
            window.location.assign(t);
          }),
          (p.stateChange = function (t) {
            t.center && window.location.replace(OSM.formatHash(t));
          })),
      (p.updateHash = function () {
        var t = OSM.formatHash(i);
        t !== u && ((u = t), p.stateChange(OSM.parseHash(t)));
      }),
      (p.hashUpdated = function () {
        var t = location.hash;
        if (t !== u) {
          u = t;
          var e = OSM.parseHash(t);
          i.setState(e), p.stateChange(e, t);
        }
      }),
      (p.withoutMoveListener = function (t) {
        function e() {
          i.off("moveend", p.updateHash),
            i.once("moveend", function () {
              i.on("moveend", p.updateHash);
            });
        }
        i.once("movestart", e), t(), i.off("movestart", e);
      }),
      (p.load = function () {
        var t = d.run("load", l);
        p.stateChange(t || {});
      }),
      (p.setCurrentPath = function (t) {
        (l = t), (d = c.recognize(l));
      }),
      i.on("moveend baselayerchange overlaylayerchange", p.updateHash),
      $(window).on("hashchange", p.hashUpdated),
      p
    );
  });
