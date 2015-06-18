define(["jquery", "leaflet", "mapquest", "mapcluster"], function($, L) {

    // 'use strict';

    function displayPointInfo(point) {
        list = $("#point-info")
        list.empty()
        $.each(point, function(key, value) {
            list.append("<dt>"+key+"</dt><dd>"+value+"</dd>")
        })
    }

    // window.onload = function() {
        // API_URL = "http://127.0.0.1:5000"

        map = L.map('map-wrapper', {
            layers: MQ.mapLayer(),
            center: [ -23.58098, -46.61293 ],
            zoom: 12
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

        popup = new L.Popup();
        window.abrirPopup = function (event) {
            try {
                // Open related comments
                // TODO: fazer via pubsub para mostras mais infos do ponto tb
                window.issoReload(event.target.pk)
            } catch (ex) {
                console.log("Error to open Isso comments!")
            }
            popup.setContent("Carregando...");
            popup.setLatLng(event.target.getLatLng());
            map.openPopup(popup);
            $.getJSON(API_URL + '/data/' + event.target.pk)
            .done(function(response_data) {
                popup.setContent(response_data.descr);
                displayPointInfo(response_data);
            });
        }
        // oms.addListener('click', window.abrirPopup);
        // map.addListener('click', window.abrirPopup);

        var markers = new L.MarkerClusterGroup({ spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true });

        $.getJSON(API_URL + '/list/data')
        .done(function(response_data) {
            $.each(response_data["data"], function(index, item) {
                if (item.lat != 404) {
                    // var marker = L.marker([item.lat, item.lon]).addTo(map);
                    var marker = L.marker([item.lat, item.lon]);
                    marker.pk = item.pk
                    // marker.bindPopup(item.descr);
                    marker.on('click', window.abrirPopup);
                    markers.addLayer(marker);
                    // oms.addMarker(marker);
                }
            });
        });

        map.addLayer(markers);

    // }

});
