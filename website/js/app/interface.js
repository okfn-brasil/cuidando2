define(["jquery", 'pubsub', 'app/urlmanager'], function($, pubsub, urlManager) {

    'use strict';

    pubsub.subscribe("code.changed", function(event, data) {
        if (data.value == null) {
            $(".general-view").show()
            $(".specific-view").hide()
        } else {
            $(".general-view").hide()
            $(".specific-view").show()
        }
    })

    // Button to go back to general view
    $("#to-general").click(function () {
        pubsub.publish('code.changed', {value: null})
    });
});
