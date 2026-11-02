// console.log("Mapbox token:", mapToken);
        mapboxgl.accessToken = mapToken;
           const map = new mapboxgl.Map({
           container: 'map', // container ID
           center: [88.202288, 22.496656], // starting position [lng, lat]. Note that lat must be set between -90 and 90
           zoom: 9 // starting zoom
          });
