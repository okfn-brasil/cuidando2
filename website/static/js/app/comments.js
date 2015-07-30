// define(["jquery", 'pubsub', 'app/urlmanager', "app/showsub", "isso/embed.dev"], function($, pubsub, urlManager, showSubscribe) {
    define(["jquery", 'pubsub', 'app/urlmanager', 'app/showsub'], function($, pubsub, urlManager, showSubscribe) {

    'use strict';

    // function updateComments() {
    //     try {
    //         // Open related comments
    //         window.issoReload(urlManager.getParam('code'))
    //     } catch (ex) {
    //         console.log("Error to open Isso comments!")
    //     }
    // }

    function updateComments(e, data) {
        $.getJSON(
            COMMENTS_API_URL + '/thread/' + data.value
        )
        .done(function(data) {
            console.log("COMENTS", data)
        })
    }

    showSubscribe("code.changed", updateComments, "#comments-container")
});
