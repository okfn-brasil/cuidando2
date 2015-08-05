define(["jquery", 'app/urlmanager', 'pubsub', 'app/showsub', 'app/templates'], function($, urlManager, pubsub, showSubscribe, templates) {

    'use strict';

    // var userTemplate = templates.get("user")
    // var userContainer = $("#user-container")
    var containerId = "#textpage-container"

    function updatePage(event, data) {
        console.log("!!!!!!!!!!!!!UPDATE-TEXT", event, data, urlManager.getParam('text'))
        var pageName = typeof data !== 'undefined' ? data.value : urlManager.getParam('text')

        // pubsub.unsubscribe(updatePage)
        $("[data-textpage]").hide()
        $("*[data-textpage*='" + pageName + "']").show()
        // showSubscribe("text.changed", containerId, true, updatePage)
    }

    // TODO: fazer com que rode onShow sem cair em recursão infinita...
    showSubscribe("text.changed", containerId, false, updatePage)
})
