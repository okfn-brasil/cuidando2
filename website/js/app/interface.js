define(["jquery", 'pubsub', 'app/urlmanager'], function($, pubsub, urlManager) {

    'use strict';

    function toggleGeneralSpecific() {
        if (urlManager.getParam('code') == null) {
            $(".general-view").show()
            $(".specific-view").hide()
        } else {
            $(".general-view").hide()
            $(".specific-view").show()
        }
        // if (data.value == null) {
        //     $(".general-view").fadeIn()
        //     $(".specific-view").fadeOut()
        // } else {
        //     $(".general-view").fadeOut()
        //     $(".specific-view").fadeIn()
        // }
    }

    pubsub.subscribe("code.changed", function(event, data) {
        toggleGeneralSpecific()
    })

    // Button to go back to general view
    $("#to-general").click(function () {
        pubsub.publish('code.changed', {value: null})
    });

    toggleGeneralSpecific()
});
