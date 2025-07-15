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
// _____________________________________________________________________________________________________________________________________
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
// _____________________________________________________________________________________________________________________________________


/// ADDING CSV DATA
// Marker Clustering because the markers could be too many and too close together
//***************************************
// const markers = L.markerClusterGroup();
// // add the marker clusters to the map
//  map.addLayer(markers);
// ****************************************

//  icon for each category _________________________________________________________________________________________ 
const categoryIcons = {
  "Primary Health Center": L.icon({ iconUrl: "data/icons/primary_health_centre.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "Dispensary": L.icon({ iconUrl: "data/icons/dispensary.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "Maternity Home": L.icon({ iconUrl: "data/icons/maternity_home.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "Private Non Profit": L.icon({ iconUrl: "data/icons/private_non_profit.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "Educational Clinic": L.icon({ iconUrl: "data/icons/educational_clinic.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "Cottage Hospital": L.icon({ iconUrl: "data/icons/cottage_hospital.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "General Hospital": L.icon({ iconUrl: "data/icons/general_hospital.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "Medical Center": L.icon({ iconUrl: "data/icons/medical_centre.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "Military and Paramilitary Clinic": L.icon({ iconUrl: "data/icons/military_paramilitary_clinic.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "Specialist Hospital": L.icon({ iconUrl: "data/icons/specialist_hospital.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "Comprehensive Health Center": L.icon({ iconUrl: "data/icons/veterinary_clinic.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }), // bad svg
  "Federal Staff Clinic": L.icon({ iconUrl: "data/icons/veterinary_clinic.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }), // bad svg
  "Veterinary Clinic": L.icon({ iconUrl: "data/icons/veterinary_clinic.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  "Federal Medical Center": L.icon({ iconUrl: "data/icons/federal_medical_centre.svg", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] })
};
// ____________________________________________________________________________________________

// Fallback default icon
const defaultIcon = categoryIcons["Veterinary Clinic"];

// ✅ Create cluster groups globally once
const clusterGroups = {};

// Let each category (of health facilities in this case) have its own cluster group
for (let category in categoryIcons) {
    // the new dictionary "cluster groups" will have the catergory icons as keys
    // and the "L.markerClusterGroup()" as values
    clusterGroups[category] = L.markerClusterGroup();
}
clusterGroups["Other"] = L.markerClusterGroup();

  // Add the cluster groups to the map once, so they can be used later
  // This way, you avoid adding the same layer multiple times
for (let group in clusterGroups) {
    map.addLayer(clusterGroups[group]);
}

  // Use the omnivore library to read the CSV file and convert it to GeoJSON
omnivore.csv("data/csv/adamawa_health_facilities.csv")
  .on("ready", function() {
    const layer = this;

    layer.eachLayer(function(markerLayer) {
        // the properties of the feature(health facility)
      const props = markerLayer.feature.properties;
        // "?.trim()" is used to remove any leading or trailing whitespace
      const category = props.Category?.trim();

        // The keys of categoryIcons are the same as the keys of clusterGroups,
        // but the values are different (icons for categroyIcons and markerClusterGroup for clusterGroups)
      const iconToUse = categoryIcons[category] || defaultIcon;

      const marker = L.marker(markerLayer.getLatLng(), { icon: iconToUse });

      let popupContent = "<b>Facility Info</b><br>";
      for (let key in props) {
        popupContent += `<b>${key}</b>: ${props[key]}<br>`;
      }
      marker.bindPopup(popupContent);

      if (clusterGroups[category]) {
        clusterGroups[category].addLayer(marker);
      } else {
        clusterGroups["Other"].addLayer(marker);
      }
    });
  })
// csvLayer.addTo(map);

