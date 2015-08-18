define(["jquery", "leaflet", 'pubsub', 'app/urlmanager', 'showutils', 'app/pointinfo', "mapquest", "mapcluster"], function($, L, pubsub, urlManager, showutils) {

    'use strict';

    // var oms = new OverlappingMarkerSpiderfier(map);

    //icones
    var greenIcon = L.icon({
    	iconUrl: 'static/img/verde.png',
    	iconSize: [25, 41],
    	popupAnchor: [0, -10],
    });
    var blueIcon = L.icon({
    	iconUrl: 'static/img/azul.png',
    	iconSize: [25, 41],
    	popupAnchor: [0, -10],
    });
    var redIcon = L.icon({
    	iconUrl: 'static/img/vermelho.png',
    	iconSize: [25, 41],
    	popupAnchor: [0, -10],
    });
    var yellowIcon = L.icon({
    	iconUrl: 'static/img/amarelo.png',
    	iconSize: [25, 41],
    	popupAnchor: [0, -10],
    });

    function getcolor(state) {
    	  if(state == "orcado") return redIcon
    	  if(state == "atualizado") return yellowIcon
    	  if(state == "empenhado") return greenIcon
    	  if(state == "liquidado") return blueIcon
    }

    L.Icon.Default.imagePath = "static/img/leaflet"

    var mapId = '#map-container',
        popup = null,
        map = null,
        year = null

    // This flag is used to know if the user clicked the marker (so the map
    // already panned to it) or if the "code" was changed another way, so the
    // map still needs to pan to it.
    var justClickedMarker = false

    // Called when a marker is clicked
    function markerClicked(event) {
        var code = event.layer.feature.properties.uid
        if (urlManager.getParam('code') != code) popup.setContent("Carregando...")
        popup.setLatLng(event.latlng)
        map.openPopup(popup)
        // map.setView(event.latlng, 1, true);
        map.panTo(event.latlng)
        justClickedMarker = true
        // pubsub.publish('code.changed', {value: code})
        urlManager.route('despesa', urlManager.getParam('year'), code)
    }


    // Update map
    function updateMap(msg, content) {
        if (!map) initMap()

        var newYear = content ? content.value : urlManager.getParam('year')
        // Avoids realoading data if year didn't change
        if (newYear != year) {
            year = newYear
            // Remove possible previous markers layer
            if (map.yearMarkers) map.removeLayer(map.yearMarkers)

            // Create new cluster layer
            var markers = new L.MarkerClusterGroup({
                maxClusterRadius: 60,
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                iconCreateFunction: function (cluster) {
                    var markers = cluster.getAllChildMarkers()
                    // var html = markers.length
                    return L.divIcon({
                        html: markers.length,
                        className: 'cluster-circle',
                        iconSize: L.point(32, 32)
                    })

				            // var markers = cluster.getAllChildMarkers()
                    // window.markers = markers
				            // var n = 0;
				            // for (var i = 0; i < markers.length; i++) {
					          //     n += markers[i].number
				            // }
				            // return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(40, 40) });
			          },
            })

            // Get list of points from server
            console.log("MAP Year", year)
            // var year = urlManager.getParam('code').split('.')[0]
            $.getJSON(API_URL + '/execucao/minlist/' + year + '?state=1&capcor=1')
                .done(function(response_data) {
                    $.each(response_data.FeatureColletion, function(index, item) {
                        var marker = L.geoJson(item, {

			                      pointToLayer: function (feature, latlng) {
                                console.log("AAAAAAAA", feature)
				                        return L.marker(latlng, {icon: getcolor(feature.properties.state)})
			                      },

			                      // onEachFeature: onEachFeature
		                    })
                        console.log(item, marker)

                        marker.on('click', markerClicked);
                        markers.addLayer(marker);
                    })
                })

            map.addLayer(markers);
            map.yearMarkers = markers
        }
    }


    function initMap() {
        console.log("INIT MAP")
        popup = new L.Popup()

        map = L.map(mapId.slice(1), {
            layers: MQ.mapLayer(),
            center: [-23.58098, -46.61293],
            zoom: 12,
            // maxZoom: 20
        });

        $.getJSON('static/geojson/subprefeituras.json')
            .done(function(response_data) {
                L.geoJson(response_data).addTo(map);
            });
    }

    // Update popup with the new data
    function updatePopup(event, data) {
        console.log("MAP - pointdata changed")
        if (data && data.ds_projeto_atividade) {
            console.log(data)
            // If row has geometry (is mapped)
            if (data.geometry) {
                if (justClickedMarker) {
                    justClickedMarker = false
                } else {
                    var coords = data.geometry.coordinates
                    // Inversion of coords needed... Leaflet standard != geoJSON
                    if (data.geometry) map.panTo([coords[1], coords[0]])
                }
                popup.setContent(data.ds_projeto_atividade)
            // TODO: add something to comment and else
            // If row has no geometry, ...
            } else {
            }
        } else {
            popup.setContent("Erro: descrição não encontrada!")
        }
    }


    showutils.showSubscribe("year.changed", mapId, true, updateMap)
    showutils.showSubscribe("pointdata.changed", mapId, false, updatePopup)
    // TODO: remover isso:
    window.up = updateMap
    window.p = pubsub
});
