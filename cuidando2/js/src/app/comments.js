define(["jquery", 'app/urlmanager', 'showutils', 'app/templates', 'app/auth'], function($, urlManager, showutils, templates, auth) {

    'use strict';

    var containerId = "#comments-container",
        commentsTemplate = null,
        comListTemplate = null,
        comEditTemplate = null,
        commentTextarea = null,
        comListContainer = null,
        comTemplate = null


    function get_parent_data(event, data) {
        var words = data.split('-')
        var dataShort = words[0]
        $.each(words.slice(1), function (index, word) {
            dataShort += word.charAt(0).toUpperCase() + word.slice(1)
        })
            console.log(dataShort)
        return $(event.currentTarget).closest("[data-" + data + "]")[0].dataset[dataShort]
    }


    // Init comments interface
    function initComments() {
        comListTemplate = templates.get("comments-list", true)
        comTemplate = templates.get("comment", true)
        comEditTemplate = templates.get("comment-edit")
        commentsTemplate = templates.get("comments")
        templates.apply($(containerId), commentsTemplate, {})
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
        var url = COMMENTS_API_URL + "/thread/" + urlManager.getParam('code')
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
    function editComment(args) {
        var url = COMMENTS_API_URL + get_parent_data(args.event, 'comment-url')
        var data = {
            'token': localStorage.microToken,
            'text': $('#comment-edit-textarea-' + args.commentId).val(),
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
            console.log(data, error, errorName)
            alert(data.responseJSON.message)
        })
    }


    // Delete comment from a thread
    function deleteComment(event) {
        var url = COMMENTS_API_URL + get_parent_data(event, 'comment-url')
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


    // Upvote/downvote comment from a thread
    // vote == true: upvote; vote == false: downvote
    function voteComment(args) {
        var url = COMMENTS_API_URL + get_parent_data(args.event, 'comment-vote-url')
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
    function reportComment(event) {
        var url = COMMENTS_API_URL + get_parent_data(event, 'comment-report-url')
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
        var commentId = get_parent_data(event, 'comment-id')
        var commentBody = $('#comment-body-' + commentId)
        var oldText = commentBody.html()
        templates.apply(commentBody, comEditTemplate, {
            'text': oldText,
            'id': commentId,
        })
        $('#comment-edit-send-button-' + commentId).click(function(event) {
            auth.validateMicroTokenTime(
                editComment,
                {'commentId': commentId, 'event': event,}
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
        if (!commentsTemplate) initComments()

        // console.log("UPADETE-COMENTS", event, data, urlManager.getParam('code'))
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
        templates.apply(comListContainer, comListTemplate, data)
        // Activate edit buttons
        $('.edit-comment-button').click(editButtonClicked)
        // Activate delete buttons
        $('.delete-comment-button').click(function(event) {
            auth.validateMicroTokenTime(deleteComment, event)
            return false
        })
        // Activate report buttons
        $('.report-comment-button').click(function(event) {
            reportComment(event)
            return false
        })
        // Activate upvote buttons
        $('.upvote-comment-button').click(function(event) {
            auth.validateMicroTokenTime(
                voteComment,
                {'event': event, 'vote': true}
            )
            return false
        })
        // Activate downvote buttons
        $('.downvote-comment-button').click(function(event) {
            auth.validateMicroTokenTime(
                voteComment,
                {'event': event, 'vote': false}
            )
            return false
        })
    }

    showutils.showSubscribe("code.changed", containerId, true, updateComments)
})
