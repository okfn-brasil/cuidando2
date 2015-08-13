define(["jquery", 'app/urlmanager', 'pubsub', 'showutils', 'app/templates'], function($, urlManager, pubsub, showutils, templates) {

    'use strict'

    var containerId = "#textpage-container"

    function updatePage(event, data) {
        console.log("!!!!!!!!!!!!!UPDATE-TEXT", event, data, urlManager.getParam('text'))
        var pageName = typeof data !== 'undefined' ? data.value : urlManager.getParam('text')

        // console.log("disact")
        // $(containerId).on("show", function() {})
        // $(containerId).on("hide", function() {})
        // console.log("disacted, hiding")
        $("[data-textpage]").hide()
        console.log("hided, showing")
        $("*[data-textpage*='" + pageName + "']").show()
        console.log("showed")
    }

    window.updatePage = updatePage
    showutils.showSubscribe("text.changed", containerId, true, updatePage)
})
