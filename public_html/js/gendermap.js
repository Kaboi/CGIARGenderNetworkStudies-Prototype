var geojson;
var markersOn = false;
var countryClicked = false;

function setMarkerStyle(marker){
    switch(marker.toGeoJSON().properties.CRP)
    {
        case "A4NH":
            return{'marker-color': '#4B0082','marker-symbol':'school'};
        case "AAS":
            return{'marker-color': '#2166ac','marker-symbol':'dam'};
        case "CCAFS":
            return{'marker-color': '#006400','marker-symbol':'embassy'};
        case "DC":
            return{'marker-color': '#CD853F','marker-symbol':'wetland'};
        case "DS":
            return{'marker-color': '#CD853F','marker-symbol':'park2'};
        case "FTA":
            return{'marker-color': '#006400','marker-symbol':'park2'};
        case "GL":
            return{'marker-color': '#CC0000','marker-symbol':'wetland'};
        case "HT":
            return{'marker-color': '#CC0000','marker-symbol':'dam'};
        case "L&F":
            return{'marker-color': '#4393c3','marker-symbol':'slaughterhouse'};
        case "PIM":
            return{'marker-color': '#4B0082','marker-symbol':'commercial'};
        case "Maize":
            return{'marker-color': '#006400','marker-symbol':'wetland'};
        case "GRISP":
            return{'marker-color': '#FFA500','marker-symbol':'wetland'};
        case "RTB":
            return{'marker-color': '#4B0082','marker-symbol':'wetland'};
        case "WLE":
            return{'marker-color': '#2166ac','marker-symbol':'water'};
        case "Wheat":
            return{'marker-color': '#CD853F','marker-symbol':'wetland'};
        default:
            return{'marker-color': '#696969','marker-symbol':'circle-stroked'};
    }
}

//Add map
L.mapbox.accessToken = 'pk.eyJ1IjoibGVyb3lrYWJzIiwiYSI6ImUyOTBkZTI4OTUwZjRiNTFiYmUwMjZjNzZlOGY2YTZlIn0.gpoLTzM0vAplFO9tTrT5wA';

var map = L.mapbox.map('genderStudiesMap', 'leroykabs.nbi8hpaf',{maxZoom:9, minZoom:2})
    .setView([31.783300, 35.216700], 3);

var fillColor = '#91003f';
var featureLayer = L.mapbox.featureLayer()
    .loadURL('data/studies.geojson');
//    .addTo(map); 

var clusterGroup;
featureLayer.on('ready', function(e) {
       
    // The clusterGroup gets each marker in the group added to it
    // once loaded, and then is added to the map
    // 
    // only load them when markers are required        
//    if (markersOn === true){
        e.target.eachLayer(function(marker) {
            marker.setIcon(L.mapbox.marker.icon(setMarkerStyle(marker)));
  
            var studyName = marker.feature.properties.Name === "NULL" ? "" : marker.feature.properties.Name;
            var studyCRP = marker.feature.properties.CRP === "NULL" ? "" : marker.feature.properties.CRP;
            var studyStartDate = marker.feature.properties["Start Date"] === "NULL" ? "" : marker.feature.properties["Start Date"];
            var studyEndDate = marker.feature.properties["End Date"] === "NULL" ? "" : marker.feature.properties["End Date"];
            var studyContact = marker.feature.properties["Contact Name"] === "NULL" ? "" : marker.feature.properties["Contact Name"];
            
            var popupContent = '<p><h4>' + studyName + '</h4>' 
                               + '<strong>CRP: </strong>' + studyCRP + '<br/>'
                               + '<strong>Start Date: </strong>' + studyStartDate
                               + '<span class="tabContent"><strong>End Date: </strong></span>' + studyEndDate + '<br/>'
                               + '<strong>Contact Name: </strong>' + studyContact + '<br/>'
                               + '</p>'
//                                + '<span class="hand-cursor">more details</span>'
                                ;
            marker.bindPopup(popupContent, {
                closeButton: false
            });
        });
        
//        var clusterGroup = new L.MarkerClusterGroup();
        clusterGroup = new L.MarkerClusterGroup();        
        e.target.eachLayer(function(layer) {
            clusterGroup.addLayer(layer);
        });
        map.addLayer(clusterGroup);
//    }
});
