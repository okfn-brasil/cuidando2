// import './leaflet.css'

// import leaflet from 'leaflet'
import router from '../../store/router'
import assets from '../../assets'
import ajax from '../../utils/ajax.js'
import msgs from '../../store/msgs'

// var MQ = require('exports?MQ!./mapquest.es5')


// var oms = new OverlappingMarkerSpiderfier(map);


//icones
var greenIcon = leaflet.icon({
    iconUrl: assets.empenhado,
    iconSize: [25, 41],
    popupAnchor: [0, -10],
});
var blueIcon = leaflet.icon({
    iconUrl: assets.liquidado,
    iconSize: [25, 41],
    popupAnchor: [0, -10],
});
var redIcon = leaflet.icon({
    iconUrl: assets.planejado,
    iconSize: [25, 41],
    popupAnchor: [0, -10],
});
// var yellowIcon = leaflet.icon({
//     iconUrl: 'assets/img/amarelo.png',
//     iconSize: [25, 41],
//     popupAnchor: [0, -10],
// });

function getcolor(state) {
    if(state == "orcado") return redIcon
    if(state == "atualizado") return redIcon
    if(state == "empenhado") return greenIcon
    if(state == "liquidado") return blueIcon
    return null
}

// leaflet.Icon.Default.imagePath = "assets/img/leaflet"
// leaflet.Icon.Default.imagePath = assets.planejado


// This flag is used to know if the user clicked the marker (so the map
// already panned to it) or if the "code" was changed another way, so the
// map still needs to pan to it.
var justClickedMarker = false



class Map {

    initMap(domId, tag) {
        this.domId = domId
        this.tag = tag
        this.popup = new leaflet.Popup()

        // let tiles = MQ.mapLayer()

        let tiles = leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            attribution: '',
            maxZoom: 18,
            id: 'cuidando.nlj83mlb',
            accessToken: 'pk.eyJ1IjoiY3VpZGFuZG8iLCJhIjoiY2lmandrYmEzNDBqbml1bHhlZzZtbWc0MSJ9.TZYl7sV3NHwSx5fk8JHqQg'
        })

        this.map = leaflet.map(domId, {
            layers: tiles,
            center: [-23.58098, -46.61293],
            zoom: 12,
            // maxZoom: 20
        })
        this.map.keyboard.disable()

        // $.getJSON('assets/geojson/subprefeituras.json')
        //     .done(function(response_data) {
        //         leaflet.geoJson(response_data).addTo(map);
        //     });

    }

    redraw() {
        if (this.map) {
            let center = this.map.getCenter()
            this.map.invalidateSize()
            this.map.setView(center)
        }
    }

    updateMap(points) {
        if (!this.map) this.initMap(this.domId)

        // var newYear = content ? content.value : urlManager.getParam('year')

        // Avoids realoading data if year didn't change
        // if (newYear != year) {
            // year = newYear
            // Remove possible previous markers layer
        if (this.map.yearMarkers) this.map.removeLayer(this.map.yearMarkers)

        // Create new cluster layer
        var markers = new leaflet.MarkerClusterGroup({
            maxClusterRadius: 100,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            iconCreateFunction: function (cluster) {
                var markers = cluster.getAllChildMarkers()
                // var html = markers.length
                return leaflet.divIcon({
                    html: markers.length,
                    className: 'cluster-circle',
                    iconSize: leaflet.point(50, 50)
                })
            }
        })

        for (let point of points.FeatureColletion) {
            var marker = leaflet.geoJson(point, {
                pointToLayer: this.pointToLayer
            })
            marker.on('click', this.markerClicked.bind(this))
            markers.addLayer(marker)
        }
        this.map.addLayer(markers);
        this.map.yearMarkers = markers
    }

    pointToLayer (feature, latlng) {
        var marker = leaflet.marker(latlng, {icon: getcolor(feature.properties.state)})
        return marker
    }

    setCenter(latlng) {
        this.map.panTo(latlng)
    }

    // Called when a marker is clicked
    markerClicked(event) {
        let code = event.layer.feature.properties.uid
        if (router.getParam('code') != code) this.popup.setContent("Carregando...")
        this.popup.setLatLng(event.latlng)
        // this.map.openPopup(this.popup)
        this.map.panTo(event.latlng)
        justClickedMarker = true
        router.route('despesa', {code})
    }

    // // Update popup with the new data
    // updatePopup(event, data) {
    //     if (data && data.ds_projeto_atividade) {
    //         // If row has geometry (is mapped)
    //         if (data.geometry) {
    //             if (justClickedMarker) {
    //                 justClickedMarker = false
    //             } else {
    //                 var coords = data.geometry.coordinates
    //                 // Inversion of coords needed... Leaflet standard != geoJSON
    //                 if (data.geometry) this.map.panTo([coords[1], coords[0]])
    //             }
    //             this.popup.setContent(data.ds_projeto_atividade)
    //             // TODO: add something to comment and else
    //             // If row has no geometry, ...
    //         } else {
    //         }
    //     } else {
    //         this.popup.setContent("Erro: descrição não encontrada!")
    //     }
    // }

    async locateAddress(address) {
        let base = "https://nominatim.openstreetmap.org/search/",
            query = "?format=json&limit=1&countrycodes=br&viewbox=-47.16,-23.36,-45.97,-23.98&bounded=1",
            url = base + address + query,
            json = await ajax({url})

        if (json) {
            if (json.length) this.map.setView([json[0].lat,json[0].lon], 16)
            else msgs.addError('address_not_found')
        }
    }
}


let instance = new Map()

export default instance
