define(["jquery", 'app/urlmanager', 'showutils', 'app/templates', 'app/auth'], function($, urlManager, showutils, templates, auth) {

    'use strict';

    var containerId = "#comments-container",
        comTemplate = null,
        comListTemplate = null,
        comEditTemplate = null,
        commentTextarea = null,
        comListContainer = null


    // Init comments interface
    function initComments() {
        comListTemplate = templates.get("comments-list", true)
        comEditTemplate = templates.get("comment-edit")
        comTemplate = templates.get("comments")
        $(containerId).html(comTemplate({}))
        commentTextarea = $("#comment-textarea"),
        comListContainer = $("#comments-list-container"),

        // Send comment
        $("#comment-send-button").click(function(e) {
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
                alert(data.responseJSON.message)
            })
    }


    // Edit comment from a thread
    function editComment(commentId) {
        var url = COMMENTS_API_URL + "/thread/" +
            urlManager.getParam('code') + "/" +
            commentId + "/edit"
        var data = {
            'token': localStorage.microToken,
            'text': $('#comment-edit-textarea-' + commentId).val(),
        }
        $.ajax({
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data       : JSON.stringify(data),
            type       : 'PUT',
        })
        .done(function(data) {
            commentTextarea.val("")
            drawComments(data)
        })
        .fail(function(data, error, errorName) {
            console.log(data)
            alert(data.responseJSON.message)
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


    // Like/dislike comment from a thread
    // vote == true: like; vote == false: dislike
    function voteComment(args) {
        var commentId = args.commentId
        var url = COMMENTS_API_URL + "/thread/" +
            urlManager.getParam('code') + "/" +
            commentId + "/vote"
        var data = {
            'token': localStorage.microToken,
            'vote': args.vote,
        }
        $.ajax({
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data       : JSON.stringify(data),
            type       : 'POST',
        })
            .done(function(data) {
                drawComments(data)
            })
            .fail(function(data, error, errorName) {
                console.log(data, error, errorName)
                alert(data.responseJSON.message)
            })
    }


    // Delete comment from a thread
    function reportComment(commentId) {
        var url = COMMENTS_API_URL + "/thread/" +
            urlManager.getParam('code') + "/" +
            commentId + "/report"
        // var data = {
        //     'token': localStorage.microToken,
        // }
        $.ajax({
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            // data       : JSON.stringify(data),
            type       : 'POST',
        })
            .done(function(data) {
                alert('Reportado!')
            })
            .fail(function(data, error, errorName) {
                console.log(data, error, errorName)
                alert(data.responseJSON.message)
            })
    }

    // Creates textarea for edition
    function editButtonClicked(event) {
        console.log(event)
        var commentId = event.currentTarget.dataset.commentId
        var commentBody = $('#comment-body-' + commentId)
        var oldText = commentBody.html()
        commentBody.html(
            comEditTemplate({
                'text': oldText,
                'id': commentId
            })
        )
        $('#comment-edit-send-button-' + commentId).click(function(event) {
            auth.validateMicroTokenTime(
                editComment,
                event.currentTarget.dataset.commentId
            )
            return false
        })
        var editButton = $('#comment-edit-button-' + commentId)
        var cancelButton = $('#comment-edit-cancel-button-' + commentId)
        // Cancel button function: go back text and switch buttons
        cancelButton.click(function(event) {
            commentBody.html(oldText)
            cancelButton.hide()
            editButton.show()
        })
        editButton.hide()
        cancelButton.show()
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
        // Sort comments by creation time
        data.comments = data.comments.sort(function(a, b){
            console.log(a.created > b.created)
            return a.created > b.created ? 1 : -1
        })
        // Mark comments by this user or not
        $.each(data.comments, function(index, comment) {
            if (comment.author == current_user) {
                comment.userIsAuthor = true
            } else {
                comment.userNotAuthor = true
            }
        })
        // Add HTML to page
        comListContainer.html(comListTemplate(data))
        // Activate edit buttons
        $('.edit-comment-button').click(editButtonClicked)
        // Activate delete buttons
        $('.delete-comment-button').click(function(event) {
            auth.validateMicroTokenTime(
                deleteComment,
                event.currentTarget.dataset.commentId
            )
            return false
        })
        // Activate report buttons
        $('.report-comment-button').click(function(event) {
            reportComment(event.currentTarget.dataset.commentId)
            return false
        })
        // Activate like buttons
        $('.like-comment-button').click(function(event) {
            auth.validateMicroTokenTime(
                voteComment,
                {
                    'commentId': event.currentTarget.dataset.commentId,
                    'vote': true
                }
            )
            return false
        })
        // Activate dislike buttons
        $('.dislike-comment-button').click(function(event) {
            auth.validateMicroTokenTime(
                voteComment,
                {
                    'commentId': event.currentTarget.dataset.commentId,
                    'vote': false
                }
            )
            return false
        })
    }

    showutils.showSubscribe("code.changed", containerId, true, updateComments)
})
