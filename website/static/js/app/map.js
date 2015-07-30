define(["jquery", "leaflet", 'pubsub', 'app/urlmanager', 'app/pointinfo', "mapquest", "mapcluster"], function($, L, pubsub, urlManager) {

    'use strict';

    // L.Icon.Default.imagePath = "static/img"

    var mapId = 'map-container'

    var map = L.map(mapId, {
        layers: MQ.mapLayer(),
        center: [-23.58098, -46.61293],
        zoom: 12,
        // maxZoom: 20
    });

    // var oms = new OverlappingMarkerSpiderfier(map);

    // //icones
    // var greenIcon = L.icon({
    // 	iconUrl: 'img/verde.png',
    // 	iconSize: [25, 41],
    // 	popupAnchor: [0, -10],
    // });
    // var blueIcon = L.icon({
    // 	iconUrl: 'img/azul.png',
    // 	iconSize: [25, 41],
    // 	popupAnchor: [0, -10],
    // });
    // var redIcon = L.icon({
    // 	iconUrl: 'img/vermelho.png',
    // 	iconSize: [25, 41],
    // 	popupAnchor: [0, -10],
    // });
    // var yellowIcon = L.icon({
    // 	iconUrl: 'img/amarelo.png',
    // 	iconSize: [25, 41],
    // 	popupAnchor: [0, -10],
    // });

    // function getcolor(entry) {
    //   a = entry
    // 	if(entry.atualizado == "0,00" && entry.empenhado == "0,00" && entry.liquidado == "0,00") {
    // 		return redIcon;
    // 	} else if(entry.empenhado == "0,00" && entry.liquidado == "0,00") {
    // 		return yellowIcon;
    // 	} else if(entry.liquidado == "0,00") {
    // 		return greenIcon;
    // 	} else {
    // 		return blueIcon;
    // 	}
    // }

    var popup = new L.Popup();

    // Get more data about current code and publish it
    pubsub.subscribe("code.changed", function(event, data) {
        $.getJSON(API_URL + '/execucao/list?code=' + data.value)
            .done(function(response_data) {
                var pointInfo = response_data.data[0]
                pubsub.publish('pointdata.changed', pointInfo)
        });
    })

    // Called when a marker is clicked
    function markerClicked(event) {
        var code = event.layer.feature.properties.uid
        popup.setContent("Carregando...");
        popup.setLatLng(event.latlng);
        map.openPopup(popup);
        pubsub.publish('code.changed', {value: code})
    }

    // Update popup with the new data
    pubsub.subscribe("pointdata.changed", function(event, data) {
        popup.setContent(data.ds_projeto_atividade);
    })

    // Update map
    function updateMap() {
        // Remove possible previous markers layer
        if (map.yearMarkers) map.removeLayer(map.yearMarkers)

        // Create new cluster layer
        var markers = new L.MarkerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true
        });

        // Get list of points from server
        var year = urlManager.getParam('year')
        $.getJSON(API_URL + '/execucao/minlist/' + year)
            .done(function(response_data) {
                $.each(response_data["data"], function(index, item) {
                    // L.geoJson(item).addTo(map);
                    // L.geoJson(item, {
                    //     pointToLayer: function (feature, latlng) {
                    //         return L.marker(latlng);
                    //         // return L.marker(latlng, geojsonMarkerOptions);
                    //     }
                    // })
                    var marker = L.geoJson(item)
                    marker.on('click', markerClicked);
                    markers.addLayer(marker);


                    // if (item[1]) {
                    //     // var marker = L.marker([item.lat, item.lon]).addTo(map);
                    //     var marker = L.marker([item[1], item[2]]);
                    //     marker.pk = item[0]
                    //         // marker.bindPopup(item.descr);
                    //     marker.on('click', markerClicked);
                    // markers.addLayer(marker);
                    //     // oms.addMarker(marker);
                    // }
                });
            });

        map.addLayer(markers);
        map.yearMarkers = markers
    }


    $.getJSON('static/geojson/subprefeituras.json')
        .done(function(response_data) {
            L.geoJson(response_data).addTo(map);
        });


    pubsub.subscribe("year.changed", function(event, data) {
        updateMap()
    })
    updateMap()

    // // Starts to update automaticaly while visible
    // $(mapId).on("show", function() {
    //     // Subscribe to year change
    //     pubsub.subscribe("year.changed", function(event, data) {
    //         updateMap()
    //     })
    //     updateMap()
    // })

    // // Stops to update automaticaly while hidden
    // $(mapId).on("hide", function() {
    //     // Unsubscribe to year change
    //     pubsub.unsubscribe(updateMap)
    // })
});
