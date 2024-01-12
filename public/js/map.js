
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style url 
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 1.2 // starting zoom
});
// console.log(coordinates);
// Create a new marker.
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup().setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
    .addTo(map);