define(["jquery", 'pubsub', 'app/urlmanager', "isso/embed.dev"], function($, pubsub, urlManager) {

    'use strict';

    function updateComments() {
        try {
            // Open related comments
            window.issoReload(urlManager.getParam('code'))
        } catch (ex) {
            console.log("Error to open Isso comments!")
        }
    }

    pubsub.subscribe("code.changed", function(event, data) {
        console.log(event, data)
        updateComments()
    })
});
