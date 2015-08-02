define(["jquery", "leaflet", 'pubsub', 'app/urlmanager', 'app/pointinfo', "mapquest", "mapcluster"], function($, L, pubsub, urlManager) {

    'use strict';

    L.Icon.Default.imagePath = "static/img/leaflet"

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

    var popup = new L.Popup()

    // This flag is used to know if the user clicked the marker (so the map
    // already panned to it) or if the "code" was changed another way, so the
    // map still needs to pan to it.
    var justClickedMarker = false

    // Called when a marker is clicked
    function markerClicked(event) {
        var code = event.layer.feature.properties.uid
        popup.setContent("Carregando...");
        popup.setLatLng(event.latlng);
        map.openPopup(popup);
        // map.setView(event.latlng, 1, true);
        map.panTo(event.latlng);
        justClickedMarker = true
        pubsub.publish('code.changed', {value: code})
    }

    // Update popup with the new data
    pubsub.subscribe("pointdata.changed", function(event, data) {
        if (data && data.ds_projeto_atividade) {
            console.log(data)
            window.mydata = data
            window.mymap = map
            if (justClickedMarker) {
                justClickedMarker = false
            } else {
                var coords = data.geometry.coordinates
                // Inversion of coords needed... Leaflet standard != geoJSON
                if (data.geometry) map.panTo([coords[1], coords[0]])
            }
            popup.setContent(data.ds_projeto_atividade)
        } else {
            popup.setContent("Erro: descrição não encontrada!")
        }
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
                $.each(response_data.data, function(index, item) {
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

    // TODO: Só fazer isso se mapa está visível!!!
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
