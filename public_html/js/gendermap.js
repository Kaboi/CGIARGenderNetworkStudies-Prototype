//TODO:Load densityData without variable see lyzidiamond example
var geojson;
var markersOn = false;

//Functions
function getColor(d) {
    return d > 15 ? '#91003f' :
           d > 10 ? '#ce1256' :
           d > 7  ? '#e7298a' :
           d > 5  ? '#df65b0' :
           d > 3  ? '#c994c7' :
           d > 0  ? '#d4b9da' :
                    '#f1eef6';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.numberOfStudies),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#5D4C59',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

//Add map
L.mapbox.accessToken = 'pk.eyJ1IjoibGVyb3lrYWJzIiwiYSI6ImUyOTBkZTI4OTUwZjRiNTFiYmUwMjZjNzZlOGY2YTZlIn0.gpoLTzM0vAplFO9tTrT5wA';

var map = L.mapbox.map('map', 'leroykabs.2f98fac4',{maxZoom:10, minZoom:2})
    .setView([31.783300, 35.216700], 2);
    
// control that shows state info on hover
var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function(props) {
    this._div.innerHTML = '<h4>Number of Gender Studies</h4>' + (props ? '<b>' + props.name + '</b><br />' + props.numberOfStudies + ' Studies' : 'Hover over a country');
};

info.addTo(map);

            
//geoJson = L.geoJson(countriesData, {style: style}).addTo(map);
geojson = L.geoJson(countriesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


//var densityFeatureLayer = L.mapbox.featureLayer()
//    .loadURL('data/countries.studies.geojson');
//    //.addTo(map);
//    


//custom legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1, 3, 5, 7, 10, 15],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
    



var featureLayer = L.mapbox.featureLayer()
    .loadURL('data/studies.geojson');
//    .addTo(map); 

var clusterGroup;

featureLayer.on('ready', function(e) {
    // The clusterGroup gets each marker in the group added to it
    // once loaded, and then is added to the map
    // 
    // only load them when markers are required
    if (markersOn === true){
//        var clusterGroup = new L.MarkerClusterGroup();
        clusterGroup = new L.MarkerClusterGroup();        
        e.target.eachLayer(function(layer) {
            clusterGroup.addLayer(layer);
        });
        map.addLayer(clusterGroup);
    }
});



// the function given to this callback will be called every time the map
// completes a zoom animation.
map.on('zoomend', function() {
    if (map.getZoom() >  4) {
        // similar methods like .setOpacity(0) and .setOpacity(1)
        if(markersOn === false ){
            markersOn = true;
            map.removeControl(legend);
            map.removeControl(info);
            map.removeLayer(geojson);
            featureLayer.loadURL('data/studies.geojson');
        }
    } else {
        if(markersOn === true){
            markersOn = false; 
            map.removeLayer(clusterGroup);
            map.removeLayer(featureLayer);            
            legend.addTo(map);
            info.addTo(map);
            geojson.addTo(map);
                    
        }
    }
});


