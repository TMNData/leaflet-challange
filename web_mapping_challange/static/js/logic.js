// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query data
d3.json(queryUrl, function(data) {
  

// Create a GeoJSON layer containing the features array on the data
// Run the onEachFeature function once for each piece of data in the array
// point to layer to change default marker shape
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature : addPopup,
    pointToLayer: createMarker
  });

// Sending our earthquakes layer to the createMap function
  createMap(earthquakes);

});

// function to change color of circle based on meginitude

function markerColor(magnitude) {
      if (magnitude > 5) {
           return  "rgb(182, 42, 17)"
      } else if (magnitude > 4) {
           return "rgb(255, 60, 0)"
      } else if (magnitude > 3) {
           return "rgb(236, 134, 31)"
      } else if (magnitude > 2){
            return "rgb(241, 226, 14)"
      } else {
        return "rgb(105, 172, 29)"
      }
}
    
 // create marker with respect to data 
function createMarker(feature, latlng) {
  var markerOptions = {
    stroke: false,
    fillOpacity:0.9,
    color: markerColor(feature.properties.mag),
    fillColor: markerColor(feature.properties.mag),
    radius: (feature.properties.mag)*5
  }

  return L.circleMarker(latlng, markerOptions);

}

// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
    // Give each feature a popup describing the place and time of the earthquake
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <p> ${Date(feature.properties.time)} </p>`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes) {

       // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
     maxZoom: 18,
     id: 'mapbox/streets-v11',
     tileSize: 512,
     zoomOffset: -1,
     accessToken: API_KEY
   });
   var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXdhcmRlaCIsImEiOiJja2FkNGZ0OGgyMGtqMnlwbThnNXR3bWNpIn0.uFK4y-WgrYAmarpTNRzedg", {
     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
     maxZoom: 18,
     id: "dark-v10",
     accessToken: API_KEY
   });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    
   
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  }


