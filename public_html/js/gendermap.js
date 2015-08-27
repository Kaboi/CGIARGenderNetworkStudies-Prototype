L.mapbox.accessToken = 'pk.eyJ1IjoibGVyb3lrYWJzIiwiYSI6ImUyOTBkZTI4OTUwZjRiNTFiYmUwMjZjNzZlOGY2YTZlIn0.gpoLTzM0vAplFO9tTrT5wA';
var map = L.mapbox.map('map', 'leroykabs.2f98fac4')
    .setView([31.783300, 35.216700], 2);
    
var featureLayer = L.mapbox.featureLayer()
    .loadURL('data/studies.geojson')
    //.addTo(map); 
    .on('ready', function(e) {
        // The clusterGroup gets each marker in the group added to it
        // once loaded, and then is added to the map
        var clusterGroup = new L.MarkerClusterGroup();
        e.target.eachLayer(function(layer) {
            clusterGroup.addLayer(layer);
        });
        map.addLayer(clusterGroup);
    });