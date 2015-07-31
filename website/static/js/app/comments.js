// define(["jquery", 'pubsub', 'app/urlmanager', "app/showsub", "isso/embed.dev"], function($, pubsub, urlManager, showSubscribe) {
define(["jquery", 'pubsub', 'app/urlmanager', 'app/showsub', 'handlebars', 'app/auth'], function($, pubsub, urlManager, showSubscribe, Handlebars, auth) {

    'use strict';

    // function updateComments() {
    //     try {
    //         // Open related comments
    //         window.issoReload(urlManager.getParam('code'))
    //     } catch (ex) {
    //         console.log("Error to open Isso comments!")
    //     }
    // }

    var comListTemplate = Handlebars.compile($("#comments-list-template").html());
    Handlebars.registerPartial("comments-list", comListTemplate)

    var comTemplate = Handlebars.compile($("#comments-template").html());
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


    function updateComments(e, data) {
        $.getJSON(
            COMMENTS_API_URL + '/thread/' + urlManager.getParam('code')//data.value
        )
        .done(function(data) {
            comListContainer.html(comListTemplate(data))
        })
    }

    showSubscribe("code.changed", updateComments, "#comments-container")
});
