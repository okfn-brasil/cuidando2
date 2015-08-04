// define(["jquery", 'pubsub', 'app/urlmanager', "app/showsub", "isso/embed.dev"], function($, pubsub, urlManager, showSubscribe) {
define(["jquery", 'app/urlmanager', 'app/showsub', 'app/templates', 'app/auth'], function($, urlManager, showSubscribe, templates, auth) {

    'use strict';

    var comListTemplate = templates.get("comments-list", true)
    var comTemplate = templates.get("comments")

    $("#comments-container").html(comTemplate({}))

    var commentTextarea = $("#comment-textarea")
    var comListContainer = $("#comments-list-container")

    // Send comment
    $("#comment-send-button").click(function(e) {
        // TODO: verificar se está logado
        auth.validateMicroTokenTime(sendComment)
        return false
    })

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


    function updateComments(event, data) {
        console.log("UPADETE-COMENTS", event, data, urlManager.getParam('code'))
        var code = typeof data !== 'undefined' ? data.value : urlManager.getParam('code')
        $.getJSON(
            COMMENTS_API_URL + '/thread/' + code
        )
        .done(function(data) {
            comListContainer.html(comListTemplate(data))
        })
    }

    showSubscribe("code.changed", "#comments-container", true, updateComments)
})
