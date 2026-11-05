// console.log("Map JS loaded");

const mapToken = window.mapToken;
const coordinates = window.coordinates;


// console.log("Map Token:", mapToken);
 //console.log("Coordinates:", coordinates);

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: coordinates,
    zoom: 10
});

const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25,})
    .setHTML("<p>Eaxt Location provided after booking</p>"))
    .addTo(map);