/*
    Site for displaying different types of geospatial data on a map using Leaflet.js
    https://github.com/mapbox/leaflet-omnivore
*/

// const map = L.map("map", {
// center: [45.6532, -73.7192], // Montreal, Canada
// center: [40.7128, -74.0060], // New York
// center: [51.5074, -0.1278], // London, UK
// center: [7.3775, 3.9470],// Ibadan, Nigeria
//     center: [9.8447,12.6109], // Adamawa, Nigeria
//     zoom:10
// });

// Map itself
const map = L.map("map", {
    center: [9.8447, 12.6109],
    zoom: 8,
});

// OSM BASEMAP
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
})
osm.addTo(map);

// L.marker([9.8447,12.6109]).addTo(map)
//     .bindPopup('Adamawa State.<br> Hospitals')
// .openPopup();

// ADDING GEOJSON DATA 
// var geojsonLayer = omnivore.geojson("data/geojson/election.json", null,
//     L.geoJSON(
//         null, {
//             // Style for each feature
//             style: function(feature) {
//                 return {
//                     fillColor: "blue",
//                     fillOpacity: 0.8,
//                     weight: 2,
//                     color: "#ffffff"
//                 }
//             },
//             // POP-UP for each feature
//             onEachFeature: function(feature, layer) {
//                 if (feature.properties) {
//                     layer.bindPopup(`
//                         <h3>${feature.properties.district || 'Unnamed Polygon'}</h3>
//                         <p>Type: ${feature.properties.type || 'N/A'}</p>
//                     `)
//                 }
//             }
//         }
//     )
// );
// geojsonLayer.addTo(map);

// geojsonLayer.on("ready", function() {
//     map.fitBounds(geojsonLayer.getBounds());
// })



/// ADDING CSV DATA
// Marker Clustering because the markers could be too many and too close together
const markers = L.markerClusterGroup();
// add the marker clusters to the map
 map.addLayer(markers);

// Use the omnivore library to read the CSV file and convert it to GeoJSON
var csvLayer = omnivore.csv("data/csv/adamawa_health_facilities.csv", null,
    L.geoJSON(
        null, {
            // convert the markers(points) to layers
            pointToLayer: function(feature, latlng) {
                return markers.addLayer(L.circleMarker(latlng))
            },

            // Popup Content for each marker
            onEachFeature: function(feature, layer){
                if (feature.properties) {
                    const properties = feature.properties;
                    let popupContent = `<div class="health-facility-popup">`;
                    for (key in properties){
                        if (properties.hasOwnProperty(key)) {
                            popupContent += `<b>${key}:</b> ${properties[key]}<br>`;
                        }
                    }
                    popupContent += `</div>`;
                    layer.bindPopup(popupContent);
                }
            }
        }
    )
);

csvLayer.addTo(map);

