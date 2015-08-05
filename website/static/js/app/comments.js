// define(["jquery", 'pubsub', 'app/urlmanager', "app/showsub", "isso/embed.dev"], function($, pubsub, urlManager, showSubscribe) {
define(["jquery", 'app/urlmanager', 'app/showsub', 'app/templates', 'app/auth'], function($, urlManager, showSubscribe, templates, auth) {

    'use strict';

    var containerId = "#comments-container",
        commentTextarea = $("#comment-textarea"),
        comListContainer = $("#comments-list-container"),
        comListTemplate = null,
        comTemplate = null


    // Init comments interface
    function initComments() {
        comListTemplate = templates.get("comments-list", true)
        comTemplate = templates.get("comments")
        $(containerId).html(comTemplate({}))

        // Send comment
        $("#comment-send-button").click(function(e) {
            // TODO: verificar se está logado
            auth.validateMicroTokenTime(sendComment)
            return false
        })
    }


    // Add comment to a thread
    function sendComment() {
        var url = COMMENTS_API_URL + "/thread/" + urlManager.getParam('code') + "/add"
        var data = {
            'token': localStorage.microToken,
            'text': commentTextarea.val(),
        }
        $.ajax({
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data       : JSON.stringify(data),
            type       : 'POST',
        })
        .done(function(data) {
            commentTextarea.val("")
            comListContainer.html(comListTemplate(data))
        })
        .fail(function(data, error, errorName) {
            console.log(data)
            alert(data.responseJSON.message)
        })
    }


    // Update comments list
    function updateComments(event, data) {
        if (!comTemplate) initComments()

        console.log("UPADETE-COMENTS", event, data, urlManager.getParam('code'))
        var code = typeof data !== 'undefined' ? data.value : urlManager.getParam('code')
        $.getJSON(
            COMMENTS_API_URL + '/thread/' + code
        )
        .done(function(data) {
            comListContainer.html(comListTemplate(data))
        })
    }

    showSubscribe("code.changed", containerId, true, updateComments)
})
