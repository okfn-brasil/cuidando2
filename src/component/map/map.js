// import leaflet from 'leaflet'
import router from '../../store/router'

// var MQ = require('imports?leaflet=leaflet!exports?MQ!./mapquest.es5')
var MQ = require('exports?MQ!./mapquest.es5')


// var oms = new OverlappingMarkerSpiderfier(map);


//icones
var greenIcon = leaflet.icon({
    iconUrl: 'assets/img/verde.png',
    iconSize: [25, 41],
    popupAnchor: [0, -10],
});
var blueIcon = leaflet.icon({
    iconUrl: 'assets/img/azul.png',
    iconSize: [25, 41],
    popupAnchor: [0, -10],
});
var redIcon = leaflet.icon({
    iconUrl: 'assets/img/vermelho.png',
    iconSize: [25, 41],
    popupAnchor: [0, -10],
});
var yellowIcon = leaflet.icon({
    iconUrl: 'assets/img/amarelo.png',
    iconSize: [25, 41],
    popupAnchor: [0, -10],
});

function getcolor(state) {
    if(state == "orcado") return redIcon
    if(state == "atualizado") return yellowIcon
    if(state == "empenhado") return greenIcon
    if(state == "liquidado") return blueIcon
    return null
}

leaflet.Icon.Default.imagePath = "assets/img/leaflet"


// This flag is used to know if the user clicked the marker (so the map
// already panned to it) or if the "code" was changed another way, so the
// map still needs to pan to it.
var justClickedMarker = false



class Map {

    constructor() {
        self = this
    }

    initMap(domId, tag) {
        this.domId = domId
        this.tag = tag
        console.log("INIT MAP")
        this.popup = new leaflet.Popup()

        this.map = leaflet.map(domId, {
            layers: MQ.mapLayer(),
            center: [-23.58098, -46.61293],
            zoom: 12,
            // maxZoom: 20
        })

        // $.getJSON('assets/geojson/subprefeituras.json')
        //     .done(function(response_data) {
        //         leaflet.geoJson(response_data).addTo(map);
        //     });

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
            maxClusterRadius: 60,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            iconCreateFunction: function (cluster) {
                var markers = cluster.getAllChildMarkers()
                // var html = markers.length
                return leaflet.divIcon({
                    html: markers.length,
                    className: 'cluster-circle',
                    iconSize: leaflet.point(32, 32)
                })
            }
        })

        for (let point of points.FeatureColletion) {
            var marker = leaflet.geoJson(point, {
                pointToLayer: this.pointToLayer
            })
            marker.on('click', this.markerClicked)
            markers.addLayer(marker)
        }
        this.map.addLayer(markers);
        this.map.yearMarkers = markers
    }

    pointToLayer (feature, latlng) {
        var marker = leaflet.marker(latlng, {icon: getcolor(feature.properties.state)})
        return marker
    }

    // Called when a marker is clicked
    markerClicked(event) {
        let code = event.layer.feature.properties.uid
        if (router.getParam('code') != code) self.popup.setContent("Carregando...")
        self.popup.setLatLng(event.latlng)
        // self.map.openPopup(self.popup)
        self.map.panTo(event.latlng)
        justClickedMarker = true
        router.route('despesa', {code})
    }

    // Update popup with the new data
    updatePopup(event, data) {
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
                    if (data.geometry) self.map.panTo([coords[1], coords[0]])
                }
                self.popup.setContent(data.ds_projeto_atividade)
                // TODO: add something to comment and else
                // If row has no geometry, ...
            } else {
            }
        } else {
            self.popup.setContent("Erro: descrição não encontrada!")
        }
    }
}


let instance = new Map()

export default instance
