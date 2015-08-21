define(["jquery", 'app/urlmanager', 'showutils', 'app/templates', 'app/auth'], function($, urlManager, showutils, templates, auth) {

    'use strict';

    var containerId = "#comments-container",
        comTemplate = null,
        comListTemplate = null,
        commentTextarea = null,
        comListContainer = null


    // Init comments interface
    function initComments() {
        comListTemplate = templates.get("comments-list", true)
        comTemplate = templates.get("comments")
        $(containerId).html(comTemplate({}))
        commentTextarea = $("#comment-textarea"),
        comListContainer = $("#comments-list-container"),

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
            drawComments(data)
        })
        .fail(function(data, error, errorName) {
            console.log(data)
            alert(data.message)
        })
    }


    // Delete comment from a thread
    function deleteComment(commentId) {
        var url = COMMENTS_API_URL + "/thread/" +
            urlManager.getParam('code') + "/" +
            commentId + "/delete"
        var data = {
            'token': localStorage.microToken,
        }
        $.ajax({
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data       : JSON.stringify(data),
            type       : 'DELETE',
        })
            .done(function(data) {
                drawComments(data)
            })
            .fail(function(data, error, errorName) {
                console.log(data, error, errorName)
                alert(data.responseJSON.message)
            })
    }

    function deleteButtonClicked(element) {
        // TODO: verificar se está logado
        auth.validateMicroTokenTime(
            deleteComment,
            element.currentTarget.dataset.commentId
        )
        return false
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
            drawComments(data)
        })
    }


    // Draw comments
    function drawComments(data) {
        var current_user = auth.getUsername()
        $.each(data.comments, function(index, comment) {
            if (comment.author == current_user) comment.userIsAuthor = true
            console.log(comment)
        })
        comListContainer.html(comListTemplate(data))
        $('.delete-comment-button').click(deleteButtonClicked)
    }

    showutils.showSubscribe("code.changed", containerId, true, updateComments)
})
