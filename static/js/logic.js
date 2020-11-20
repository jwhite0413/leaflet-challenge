var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

console.log(queryURL)

d3.json(queryURL, function(data) {
    createFeatures(data.features);
    console.log(data.features)
});

function createFeatures(earthquakedata) {
    // var latitude = [];
    // var longitude = [];
    // var allMagnitude = [];
    // var allLocation = [];
    // var allTime = [];

    // var markers = [];
    function onEachLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: circleSize(feature.properties.mag),
            fillOpacity: .05,
            color: getColor(feature.properties.mag),
            fillcolor: getColor(feature.properties.mag)
        });
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "<h/3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
    }
    var earthquakes = L.geoJSON(earthquakedata, {
        onEachFeature: onEachFeature,
        pointToLayer: onEachLayer
    });

    createMap(earthquakes);
};



// function createMap(earthquakes) {
//     var lightmap = L.titleLayer('https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js')
// }


// <script src='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js'></script>
// <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />