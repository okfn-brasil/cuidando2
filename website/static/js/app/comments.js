define(["jquery", 'pubsub', 'app/urlmanager', "app/showsub", "isso/embed.dev"], function($, pubsub, urlManager, showSubscribe) {

    'use strict';

    function updateComments() {
        try {
            // Open related comments
            window.issoReload(urlManager.getParam('code'))
        } catch (ex) {
            console.log("Error to open Isso comments!")
        }
    }

    // pubsub.subscribe("code.changed", function(event, data) {
    //     updateComments()
    // })
    showSubscribe("code.changed", updateComments, "#comments-container")
});
