define(["jquery", 'app/urlmanager', 'showutils', 'app/templates', 'app/auth'], function($, urlManager, showutils, templates, auth) {

    'use strict';

    var containerId = "#comments-container",
        commentsTemplate = null,
        comListTemplate = null,
        comEditTemplate = null,
        comReplyTemplate = null,
        commentTextarea = null,
        comListContainer = null,
        comTemplate = null


    // Get data from the dataset of the closest parent element to the
    // currentTarget of the event
    function get_parent_data(event, data) {
        var words = data.split('-')
        var dataShort = words[0]
        $.each(words.slice(1), function (index, word) {
            dataShort += word.charAt(0).toUpperCase() + word.slice(1)
        })
            console.log(dataShort)
        return $(event.currentTarget).closest("[data-" + data + "]")[0].dataset[dataShort]
    }


    function smartAjax(url, data, verb, done) {
        var params = {
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            type       : verb,
        }
        if (data) params['data'] = JSON.stringify(data)
        $.ajax(params)
            .done(done)
            .fail(function(data, error, errorName) {
                console.log(data)
                alert(data.responseJSON.message)
            })
    }


    // Init comments interface
    function initComments() {
        comListTemplate = templates.get("comments-list", true)
        comTemplate = templates.get("comment", true)
        comEditTemplate = templates.get("comment-edit")
        comReplyTemplate = templates.get("comment-reply")
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
        smartAjax(url, data, 'POST', function(data) {
            commentTextarea.val("")
            drawComments(data)
        })
    }


    // Reply to a comment
    function replyComment(args) {
        var url = COMMENTS_API_URL + get_parent_data(args.event, 'comment-url')
        var replyTextarea = $('#comment-reply-textarea-' + args.commentId)
        var data = {
            'token': localStorage.microToken,
            'text': replyTextarea.val(),
        }
        smartAjax(url, data, 'POST', function(data) {
            // replyTextarea.val("")
            drawComments(data)
        })
    }


    // Edit comment from a thread
    function editComment(args) {
        var url = COMMENTS_API_URL + get_parent_data(args.event, 'comment-url')
        var data = {
            'token': localStorage.microToken,
            'text': $('#comment-edit-textarea-' + args.commentId).val(),
        }
        smartAjax(url, data, 'PUT', function(data) {
            commentTextarea.val("")
            drawComments(data)
        })
    }


    // Delete comment from a thread
    function deleteComment(event) {
        var url = COMMENTS_API_URL + get_parent_data(event, 'comment-url')
        var data = {
            'token': localStorage.microToken,
        }
        smartAjax(url, data, 'DELETE', function(data) {
            drawComments(data)
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
        smartAjax(url, data, 'POST', function(data) {
            drawComments(data)
        })
    }


    // Delete comment from a thread
    function reportComment(event) {
        var url = COMMENTS_API_URL + get_parent_data(event, 'comment-report-url')
        // var data = {
        //     'token': localStorage.microToken,
        // }
        smartAjax(url, null, 'POST', function(data) {
            alert('Reportado!')
        })
    }

    // Creates textarea for edition
    function replyButtonClicked(event) {
        var commentId = get_parent_data(event, 'comment-id')
        var commentReplyContainer = $('#comment-reply-container-' + commentId)
        templates.apply(commentReplyContainer, comReplyTemplate, {
            'id': commentId,
        })
        $('#comment-reply-send-button-' + commentId).click(function(event) {
            auth.validateMicroTokenTime(
                replyComment,
                {'commentId': commentId, 'event': event}
            )
            return false
        })
        var replyButton = $('#comment-reply-button-' + commentId)
        var cancelButton = $('#comment-reply-cancel-button-' + commentId)
        // Cancel button function: go back text and switch buttons
        cancelButton.click(function(event) {
            commentReplyContainer.html('')
            cancelButton.hide()
            replyButton.show()
        })
        replyButton.hide()
        cancelButton.show()
        return false
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
                {'commentId': commentId, 'event': event}
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
        // Activate reply buttons
        $('.comment-reply-button').click(replyButtonClicked)
        // Activate edit buttons
        $('.comment-edit-button').click(editButtonClicked)
        // Activate delete buttons
        $('.comment-delete-button').click(function(event) {
            auth.validateMicroTokenTime(deleteComment, event)
            return false
        })
        // Activate report buttons
        $('.comment-report-button').click(function(event) {
            reportComment(event)
            return false
        })
        // Activate upvote buttons
        $('.comment-upvote-button').click(function(event) {
            auth.validateMicroTokenTime(
                voteComment,
                {'event': event, 'vote': true}
            )
            return false
        })
        // Activate downvote buttons
        $('.comment-downvote-button').click(function(event) {
            auth.validateMicroTokenTime(
                voteComment,
                {'event': event, 'vote': false}
            )
            return false
        })
    }

    showutils.showSubscribe("code.changed", containerId, true, updateComments)
})
