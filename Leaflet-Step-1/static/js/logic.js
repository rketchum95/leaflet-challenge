var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// console.log(queryUrl);
console.log(queryUrl);
// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

  function markerColor(depth) {
    switch (true){
     case depth > 90:
       return "ff0000";
     case depth >70: 
       return "FF6600";
     case depth < 50:
       return "FF9900";
     case depth < 30:
       return "FFCC00";
     case depth < 10:
       return "99CC00";
     default:
       return "00ff00";
     }
   }

   function markerSize(magnitude) {
     return magnitude *5;
   }

  function createFeatures(earthquakeData) {
    
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(features, layer) {
      layer.bindPopup("<h3>" + features.properties.place +
        "<hr><strong>Date: </strong>" + new Date(features.properties.time) + 
        "<br><strong>Magnitude: </strong>"  + features.properties.mag + 
        "<br><strong>Depth: </strong>" + features.geometry.coordinates[2] + ' km' 
        );
    };
      // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function(feature,latlng) {
          return L.circleMarker(latlng, {
            color: 
            fillColor: markerColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.75,
            stroke: false,
            radius: markerSize(feature.properties.mag)
          });
      }  
    });
    
    createMap(earthquakes);
  }


    // Sending our earthquakes layer to the createMap function
  function createMap(earthquakes) {

    // Add circles to map
// for (var i = 0; i < geometry.coordinates[2].length; i++) {
//     L.circleMarker(earthquakes, {
//     fillOpacity: 0.75,
//     // color: "white",
//     fillColor: markerColor,
//     // Adjust radius
//     // radius: countries[i].points / 7.5
//     })
//   }

   // Define streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
    
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "satellite-v9",
      accessToken: API_KEY
    });
  
     // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Satellite Map": satellitemap,
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        42.71, -122.45
      ],
      zoom: 6,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  };