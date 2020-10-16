var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// color for legend
function getColor(d) {
    return d > 5 ? '#ca4e3f':
           d > 4 ? '#dbb18a':
           d > 3 ? '#74bbd3':
           d > 2 ? '#337ab7':
           d > 1 ? '#827ab6':
                   '#242a46';
}

d3.json(baseURL, function(EQdata) {  
    createFeatures(EQdata.features);  
});

function createFeatures(earthquakeData) {
  
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Place: " + feature.properties.place + "</h3><hr><p>Time: " + new Date(feature.properties.time) + "</p><p>Magnitude: " + feature.properties.mag + "</p>");    
  }

  // // pull icon
  // var ballIcon = L.icon({
  //   iconUrl: '../static/images/ballicon.png',
  //   iconSize: [30,30],
  //   popupAnchor: [-10, -30],
  // }); 

  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJson(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {radius: feature.properties.mag * 5,
                                      fillColor: getColor(feature.properties.mag),
                                      color: "#000",
                                      weight: 1,
                                      opacity: 1,
                                      fillOpacity: 0.8});
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/hyrum78/ckg9tsvf803p519pet1f9cbmk/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaHlydW03OCIsImEiOiJja2c1bGdpZjQwdWIwMnJtc2dscmd0eHFzIn0.lEHm3LRxyN6_azwPjzIf5A", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
      "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
      Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: true
  }).addTo(myMap);

  // Set up legend
  var legend = L.control({
      position: "bottomright"
  });

  legend.onAdd = function () {

  var div = L.DomUtil.create('div', 'info legend'),
      magnitudes = [0, 1, 2, 3, 4, 5];

  for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' + 
  + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
  }

    return div;
};

legend.addTo(myMap);

// .addTo(myMap);

// d3.csv("../static/assets/data/NBALocation.csv", function(data) {

//   // Create a new marker cluster group
//   var markers = L.markerClusterGroup();

//   // Loop through data
//   for (var i = 0; i < data.length; i++) {

//     // Set the data location property to a variable
//     var location = [data[i].lat, data[i].lng];
//     console.log(data)

//     // Check for location property
//     if (location) {

//       // Add a new marker to the cluster group and bind a pop-up
//       markers.addLayer(L.marker([location[0], location[1]])
//         .bindPopup(data[i].Name));
//     }

//   }

//   // Add our marker cluster layer to the map
//   myMap.addLayer(markers);
  

}