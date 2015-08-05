define(["jquery", 'app/urlmanager', 'showutils', 'app/templates', 'app/auth'], function($, urlManager, showutils, templates, auth) {

    'use strict';

    var containerId = "#user-container",
        userContainer = $(containerId),
        userTemplate = null

    function initUserInterface() {
        userTemplate = templates.get("user")
    }

    function updateUser(event, data) {
        if (!userTemplate) initUserInterface()
        console.log("!!!!!!!!!!!!!UPADETE-USER", event, data, urlManager.getParam('username'))
        var username = typeof data !== 'undefined' ? data.value : urlManager.getParam('username')
        $.getJSON(
            AUTH_API_URL + '/users/' + username
        )
            .done(function(data) {
                // TODO: caso seja a página do próprio usuário, deixar alterar dados
                console.log("AJAX - USER", data)
                if (!data.description) data.description = "Sem descrição..."
                userContainer.html(userTemplate(data))
            })
            .fail(function(data, error, errorName) {
                // TODO: Melhorar isso
                userContainer.html("Não encontrado...")
                // console.log(data)
                // alert(data.responseJSON.message)
            })
    }

    showutils.showSubscribe("username.changed", containerId, true, updateUser)
})
