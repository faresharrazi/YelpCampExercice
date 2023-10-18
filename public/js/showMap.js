console.log("SHOW MAP JS");
console.log(mapToken);
console.log(coordinates);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: [coordinates[0], coordinates[1]], // starting position [lng, lat]
zoom: 9, // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker()
.setLngLat([coordinates[0], coordinates[1]])
.addTo(map);

