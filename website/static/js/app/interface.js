define(["jquery", 'pubsub', 'app/urlmanager'], function($, pubsub, urlManager) {

    'use strict';

    // views = {
    //     despesa: [map, pointInfo, comments],
    //     ano: [yearSelector, map, charts, datatable],
    //     pessoa: [user],
    // }

    var visible = []

    function updateView() {
        var shouldBeVisible = $("*[data-view*='" + urlManager.getParam('root') + "']")

        console.log("root", urlManager.getParam('root'))
        console.log("vissss", visible)
        console.log("SHOULD", shouldBeVisible)

        // Remove from "visible" the elements thas should continue visible
        $.each(shouldBeVisible, function(i, element) {
            var index = $.inArray(element, visible)
            if (index != -1) {
                // Already visible
                visible.splice(index, 1)
                console.log("JAAAA", element.id)
            } else {
                // New element
                console.log("SHOW!!", element.id)
                $(element).show()
            }
        })
        // Hide the ones left in visible
        $.each(visible, function(index, element) {
            $(visible).hide()
            console.log("ESCOD", element.id)
        })
        // Replaced the now hidden ones with the real visible
        visible = shouldBeVisible
    }

    pubsub.subscribe("root.changed", function(event, data) {
        updateView()
    })


    // Button to go back to year view
    $("#to-general").click(function () {
        urlManager.route("ano", urlManager.getParam('year'))
    })

    // Button to go home
    $("#home-button").click(function () {
        urlManager.routeDefault()
        return false
    })

    // Button to share page
    $("#share-button").click(function () {
        var page = encodeURIComponent(location.href)
        var title = "Cuidando 2"
        location.href = 'http://www.facebook.com/sharer.php?u=' + page + '&t=' + title
        return false
    })


    return updateView
});
