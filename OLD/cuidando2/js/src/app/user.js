define(["jquery", 'app/urlmanager', 'showutils', 'app/templates', 'app/auth'], function($, urlManager, showutils, templates, auth) {

    'use strict';

    var containerId = "#user-container",
        userContainer = $(containerId),
        userTemplate = null,
        username = null

    function initUserInterface() {
        userTemplate = templates.get("user")
    }

    function activateButton() {
        $("#descr-form-update-button").click(function(e) {
            // TODO: verificar se está logado?
            auth.validateMicroTokenTime(sendInfo)
            return false
        })
    }

    // Update user info
    function sendInfo() {
        var url = AUTH_API_URL + '/user/' + username
        var data = {
            'token': localStorage.microToken,
            'description': $("#user-form-textarea").val(),
        }
        console.log(data)
        $.ajax({
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data       : JSON.stringify(data),
            type       : 'PUT',
        })
            .done(function(data) {
                console.log("DONE", data)
                userContainer.html(userTemplate(data))
                activateButton()
            })
            .fail(function(data, error, errorName) {
                alert(data.responseJSON.message)
            })
    }

    function updateDisplayedInfo(event, data) {
        if (!userTemplate) initUserInterface()
        console.log("!!!!!!!!!!!!!UPADETE-USER", event, data, urlManager.getParam('username'))
        username = typeof data !== 'undefined' ? data.value : urlManager.getParam('username')
        var ownProfile = username == auth.getUsername()
        console.log(ownProfile, username, auth.getUsername())

        // TODO: ver se é o próprio user para pegar o e-mail também?
        $.getJSON(
            AUTH_API_URL + '/user/' + username
        )
            .done(function(data) {
                // TODO: caso seja a página do próprio usuário, deixar alterar dados
                console.log("AJAX - USER", data)
                if (!data.description) data.description = "Sem descrição..."
                data.possibleEdit = ownProfile
                userContainer.html(userTemplate(data))
                activateButton()
            })
            .fail(function(data, error, errorName) {
                // TODO: Melhorar isso
                userContainer.html("Não encontrado...")
                // console.log(data)
                // alert(data.responseJSON.message)
            })
    }

    showutils.showSubscribe("username.changed", containerId, true, updateDisplayedInfo)
})
