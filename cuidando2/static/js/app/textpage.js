define(["jquery", 'app/urlmanager', 'pubsub', 'showutils', 'app/templates'], function($, urlManager, pubsub, showutils, templates) {

    'use strict'

    var containerId = "#textpage-container"

    function updatePage(event, data) {
        console.log("!!!!!!!!!!!!!UPDATE-TEXT", event, data, urlManager.getParam('text'))
        var pageName = (typeof data !== 'undefined' && event == 'text.changed')
            ? data.value : urlManager.getParam('text')

        // $("[data-textpage]").hide()
        // console.log("hided, showing")
        // $("*[data-textpage*='" + pageName + "']").show()
        // console.log("showed")

        var url = 'static/textpages/' + urlManager.getParam('lang') +
            '/' + pageName + '.html'

        // Cached version
        // $(containerId).load(url)

        // TODO: Maybe use a timed cache?
        // https://stackoverflow.com/questions/10585578/changing-the-cache-time-in-jquery

        // Non-cached version
        $.ajax({
            url        : url,
            cache: false,
            dataType   : 'html',
            // contentType: 'application/json; charset=UTF-8',
            // data       : JSON.stringify(data),
            // type       : 'POST',
        })
            .done(function(data) {
                $(containerId).html(data)
            })
            .fail(function(data, error, errorName) {
                console.log(data, error, errorName)
                alert('Page not found...')
            })
    }

    showutils.showSubscribe("text.changed", containerId, true, updatePage)
    showutils.showSubscribe("lang.changed", containerId, false, updatePage)
})
