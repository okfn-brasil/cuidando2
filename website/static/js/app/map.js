define(["jquery", "leaflet", 'pubsub', 'app/urlmanager', 'app/pointinfo', "mapquest", "mapcluster"], function($, L, pubsub, urlManager) {

    'use strict';

    // L.Icon.Default.imagePath = "static/img"

    var map = L.map('map-container', {
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
    function markerClicked(event) {
        var code = event.target.pk
        pubsub.publish('code.changed', {value: code})

        popup.setContent("Carregando...");
        popup.setLatLng(event.target.getLatLng());
        map.openPopup(popup);
        $.getJSON(API_URL + '/data/' + code)
            .done(function(response_data) {
                popup.setContent(response_data.descr);
                pubsub.publish('pointdata.changed', response_data)
            });
    }
        // oms.addListener('click', window.abrirPopup);
        // map.addListener('click', window.abrirPopup);

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
        $.getJSON(API_URL + '/list/' + year)
            .done(function(response_data) {
                $.each(response_data["data"], function(index, item) {
                    if (item.lat != 404) {
                        // var marker = L.marker([item.lat, item.lon]).addTo(map);
                        var marker = L.marker([item.lat, item.lon]);
                        marker.pk = item.pk
                            // marker.bindPopup(item.descr);
                        marker.on('click', markerClicked);
                        markers.addLayer(marker);
                        // oms.addMarker(marker);
                    }
                });
            });

        map.addLayer(markers);
        map.yearMarkers = markers
    }


    $.getJSON('static/geojson/subprefeituras.json')
        .done(function(response_data) {
            L.geoJson(response_data).addTo(map);
        });

    // Subscribe to year change
    pubsub.subscribe("year.changed", function(event, data) {
        updateMap()
    })
    updateMap()
});
