var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

console.log(queryURL)

d3.json(queryURL, function(data) {
    console.log(data)
    createfeature(data.features);
});

function circleSize(mag) {
    return mag ** 2;
};

function getColor(mag) {
    if (mag >= 5) {
        return "red";
    } else if (mag >= 4) {
        return ("orange");
    } else if (mag >= 3) {
        return ("yellow");
    } else if (mag >= 2) {
        return ("yellowgreen");
    } else if (mag >= 1) {
        return ("green");
    } else {
        return "green";
    }
};


function createfeature(earthquakedata) {
    // var latitude = [];
    // var longitude = [];
    // var allmag = [];
    // var allLocation = [];
    // var allTime = [];

    var markers = [];

    function onEachLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: circleSize(feature.properties.mag),
            fillOpacity: .5,
            color: getColor(feature.properties.mag),
            fillcolor: getColor(feature.properties.mag)
        });
    }

    // function(feature, latlng) {
    //     var geoJSONMarker = {
    //         radius: markerSize(feature.properties.mag),
    //         fillcolor: getColor(feature.properties.mag),
    //         color: "pink",
    //         weight: 0.5,
    //         opacity: 0.5,
    //         fillOpacity: 0.8
    //     };
    //     return L.circleMarker(latlng, geoJSONMarker);
    // },

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "<h/3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
    }
    var earthquakes = L.geoJSON(earthquakedata, {
        onEachFeature: onEachFeature,
        pointToLayer: onEachLayer
    })

    createMap(earthquakes);
}

function createMap(earthquakes) {
    var satellite = L.tileLayer("http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.satellite",
        // tilesize: 512,
        accessToken: "pk.eyJ1IjoiamVzc3doaXRlMDQxMyIsImEiOiJja2doNDc3czcxN3N3MnlwZHFicW43eW9zIn0.JakbJtL_u6-lbAEYwMPqmA"
    });
    var grayscale = L.tileLayer("http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        // tilesize: 512,
        id: "mapbox.light",
        accessToken: "pk.eyJ1IjoiamVzc3doaXRlMDQxMyIsImEiOiJja2htcGR1cXgwOGdpMnRub2R1d3NoZDF0In0.OLHV6huGFMdkDFcKHZNjog"
    });
    var outdoor = L.tileLayer("http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        tilesize: 512,
        id: "mapbox.outdoor",
        accessToken: "pk.eyJ1IjoiamVzc3doaXRlMDQxMyIsImEiOiJja2htcGR1cXgwOGdpMnRub2R1d3NoZDF0In0.OLHV6huGFMdkDFcKHZNjog"
    });
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoor": outdoor
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };
    var myMap = L.map("map", {
        center: [
            0.00, 0.00

        ],
        zoom: 2,
        layers: [satellite, earthquakes]
    });
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend"),
            labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        for (var i = 0; i < labels.length; i++) {
            div.innerHTML += '<i style = "background:' + getColor(i) + '"></i>' + labels[i] + '<br>';
        }
        return div;
        info.addTo(myMap);
    };
}