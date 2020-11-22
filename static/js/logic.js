//name url we are going to query - earthquake.usgs

var earthquakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//test data is valid
// console.log(earthquakeurl)

//use d3 to query url and and createfeatures
d3.json(earthquakeurl, function(data) {
    // console.log(data)
    createfeature(data.features);
});


function createfeature(earthquakedata) {
    //define function for circlemarkers by looking within dataset for appropriate labels
    function onEachLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: circleSize(feature.properties.mag),
            fillOpacity: .5,
            color: getColor(feature.properties.mag),
            fillcolor: getColor(feature.properties.mag)
        });
    }
    //define function to take features above and bind popups to show date, time and magnitude of EQ
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "<h/3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakedata, {
            onEachFeature: onEachFeature,
            pointToLayer: onEachLayer
        })
        //Take this layer and send to createmap 
    createMap(earthquakes);
}

//with createmap we will take earthquake layer and display this on maps called from mapbox API
//use APIKEY in config file to call to mapbox api. 
//NOTE- struggled to call to map box when listing criteria, opted to specify in the link itself what style I was looking for
function createMap(earthquakes) {
    var satellite = L.tileLayer("http://api.tiles.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        // maxZoom: 18,
        // id: "mapbox.satellite",
        // tilesize: 512,
        accessToken: API_KEY
    });
    var grayscale = L.tileLayer("http://api.tiles.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        // maxZoom: 18,
        // // tilesize: 512,
        // id: "mapbox.light",
        accessToken: API_KEY
    });
    var outdoor = L.tileLayer("http://api.tiles.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        // maxZoom: 18,
        // tilesize: 512,
        // id: "mapbox.outdoor",
        accessToken: API_KEY
    });

    //create variable to hold our three maps called above
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoor": outdoor
    };

    //create variable overlay to hold our Earthquake Layer so we can turn it on and off
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    //create variable for new map
    var myMap = L.map("map", {
        center: [
            0.00, 0.00

        ],
        zoom: 2,
        layers: [satellite, earthquakes]
    });
    //add layers to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

    //add legend to map
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend"),
            labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        for (var i = 0; i < labels.length; i++) {
            div.innerHTML += '<i style = "background:' + getColor(i) + '"></i>' + labels[i] + '<br>';
        }
        return div;
    };
    legend.addTo(myMap);

};

//function for circle size of markers
function circleSize(mag) {
    return mag ** 2;
};

//color coding for circles
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