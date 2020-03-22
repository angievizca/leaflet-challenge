// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer){
      layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function getRadius(magnitude) {
        return magnitude * 30000;
      }
    
    function circleColor(magnitude) {
        if (magnitude < 1) {
          return "#ccff33"
        }
        else if (magnitude < 2) {
          return "#ffff33"
        }
        else if (magnitude < 3) {
          return "#ffcc33"
        }
        else if (magnitude < 4) {
          return "#ff9933"
        }
        else if (magnitude < 5) {
          return "#ff6633"
        }
        else {
          return "#ff3333"
        }
      }
    var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (earthquakeData, latlng) {
      return L.circle(latlng,
        {radius: getRadius(earthquakeData.properties.mag),
          fillColor: circleColor(earthquakeData.properties.mag),
          fillOpacity: .7,
          stroke: true,
          color: "black",
          weight: .5
      })
    },
    onEachFeature: onEachFeature
  });


  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    // "Street Map": streetmap,
    // "Dark Map": darkmap
  };

 
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the grayscale and earthquakes layers to display on load
  var map = L.map("map", {
    center: [
      37.0902, -95.7129
    ],
    zoom: 5,
    layers: [grayscalemap, earthquakes]
  });
// Pass in baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

         // Create a layer control
  
// color function to be used when creating the legend
  function getColor(d) {
    return d > 5 ? '#F30' :
    d > 4  ? '#F60' :
    d > 3  ? '#F90' :
    d > 2  ? '#FC0' :
    d > 1   ? '#FF0' :
              '#9F3';
  }
  
  
  // Create legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(map);

}