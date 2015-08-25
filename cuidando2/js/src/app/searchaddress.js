define(['jquery', 'pubsub', 'showutils', 'app/urlmanager', 'app/templates', 'app/map'], function($, pubsub, showutils, urlManager, templates, getMap) {

    'use strict';

    var buttonId = '#search-address-button'
    var inputId = '#search-address-input'

    console.log("AAAAAAAAAAAAAA")

    function findAddress() {
        var address = $(inputId).val()
        var link = 'http://nominatim.openstreetmap.org/search/' + address + '?format=json&limit=1&countrycodes=br&viewbox=-47.16,-23.36,-45.97,-23.98&bounded=1'

        $.getJSON(link, function(data) {
            if (data) {
                getMap().setView([data[0].lat,data[0].lon], 16)
            } else {
                alert('Geocode was not successful')
            }
        })
    }

    // Run loader on first show
    showutils.runOnFirstShow('#search-address-container', function () {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        templates.smartApply('search-address', {})
        $(buttonId).click(findAddress)
		    $(inputId).keypress(function(event){
				    if(event.keyCode == 13){
						    findAddress()
						    return false
				    }
		    })
    })
})
