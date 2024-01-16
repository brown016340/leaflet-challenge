// Create a initial map object
var myMap = L.map('map',{
    center:[0,0],
    zoom: 2
})

// define url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


d3.json(url).then(function(data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };

    }
    // color range
    function mapColor(depth) {
        if (depth <= 10) {
            return "#90ee90";
        } else if (depth <= 30) {
            return "#ffff00";
        } else if (depth <= 50) {
            return "#ffd700"; 
        } else if (depth <= 70) {
            return "#ffa500";
        } else if (depth <= 90) {
            return "#ff4500"; 
        } else {
            return "#ff0000"; 
        }
    }
    
    
    // magnitude size
    function mapRadius(magnitude) {
        if (magnitude <= 1) {
            return 5;
        } else if (magnitude <= 2) {
            return 7;
        } else if (magnitude <= 3) {
            return 9;
        } else if (magnitude <= 4) {
            return 11;
        } else if (magnitude <= 5) {
            return 13;
        } else if (magnitude > 5) {
            return 15;
        } else {
            return 1;
        }
    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        // pop-up data
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2]);

        }
    }).addTo(myMap);
});
// legend
// Add Legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        gradesDepth = [0, 10, 30, 50, 70, 90],
        gradesMagnitude = [0, 1, 2, 3, 4, 5],
        labelsDepth = [],
        labelsMagnitude = [];

    // Depth Legend
    div.innerHTML += '<h4>Depth</h4>';
    for (var i = 0; i < gradesDepth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + mapColor(gradesDepth[i] + 1) + '"></i> ' +
            gradesDepth[i] + (gradesDepth[i + 1] ? '&ndash;' + gradesDepth[i + 1] + '<br>' : '+');
    }

    // Magnitude Legend
    div.innerHTML += '<h4>Magnitude</h4>';
    for (var j = 0; j < gradesMagnitude.length; j++) {
        div.innerHTML +=
            '<i style="background:' + mapColor(gradesDepth[gradesDepth.length - 1] + 1) + '; border: 2px solid black;"></i> ' +
            gradesMagnitude[j] + (gradesMagnitude[j + 1] ? '&ndash;' + gradesMagnitude[j + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);