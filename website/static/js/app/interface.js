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
        $.each(shouldBeVisible, function(index, element) {
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

    // // Show/Hide interface elements
    // function switchGeneralSpecific() {
    //     if (urlManager.getParam('code')) {
    //         console.log("Specific")
    //         $(".general-view").hide()
    //         $(".specific-view").show()
    //     } else {
    //         console.log("General")
    //         $(".general-view").show()
    //         $(".specific-view").hide()
    //     }
    //     // if (data.value == null) {
    //     //     $(".general-view").fadeIn()
    //     //     $(".specific-view").fadeOut()
    //     // } else {
    //     //     $(".general-view").fadeOut()
    //     //     $(".specific-view").fadeIn()
    //     // }
    // }

    // // Controls when to show/hide the elements of the interface
    // var prevCodeWasNull = !urlManager.getParam('code')
    // function controledSwitch() {
    //     var currentCodeIsNull = !urlManager.getParam('code')
    //     // Show/Hide only if "nulliness" changed
    //     if (currentCodeIsNull != prevCodeWasNull) {
    //         switchGeneralSpecific()
    //     }
    //     prevCodeWasNull = currentCodeIsNull
    // }

    // pubsub.subscribe("code.changed", function(event, data) {
    //     controledSwitch()
    // })

    pubsub.subscribe("root.changed", function(event, data) {
        updateView()
    })


    // Button to go back to general view
    $("#to-general").click(function () {
        // pubsub.publish('code.changed', {value: null})
        urlManager.route("ano", urlManager.getParam('year'))
    })

    // // Button to go to own profile
    // $("#user-profile-button").click(function(e) {
    //     urlManager.route("pessoa", )
    //     return false
    // })


    function init() {
        // switchGeneralSpecific()
        updateView()
    }
    return init
});
