define(["jquery"], function($) {

    'use strict';

    $("#login-facebook").click(function(e) {
        // $.ajax({
        //     url: AUTH_URL + '/login/facebook/',
        //     dataType: "json",
        //     // crossDomain: true,
        //     // xhrFields : {
        //     //     withCredentials : true
        //     // }
        // })
        console.log(AUTH_API_URL)
        $.getJSON(
            AUTH_API_URL + '/login/facebook/'
        )
        .done(function(response_data) {
            console.log("oooooooooooooooooooooooooooooooooooooooooooo")
            console.log("resp", response_data)
            var origRedirect = response_data.redirect
            console.log(origRedirect)
            var thisUrl = window.location.origin
            var parts = origRedirect.split(escape("?"))
            var newRedirect = parts[0].replace(/(redirect_uri=)[^\&]+/, '$1' + thisUrl) + escape("?redirected_for_login=1&") + parts[1]
            console.log("------------->>>>>>>", newRedirect)
            localStorage.prevhash = location.hash
            window.location.replace(newRedirect)
        })
        return false
    })

    // TODO: Fazer com que auth.js seja o primeiro a rodar
    // Ver se é um login e trocar search pelo do BD
    // Pedir tokens


    // If redicected for login
    if (/^\?redirected_for_login=1&/.test(location.search)) {
        var url = location.origin + "/" + localStorage.prevhash
        var query = location.search.replace("redirected_for_login=1&", "")
        if (window.history.replaceState) {
            get_tokens(query)
            window.history.replaceState(null, null, url)
        } else {
            // Fallback method that doesn't requires "window.history" but
            // reloads the page.
            location.href = url
        }
    }

    function get_tokens(query) {
        var url = AUTH_API_URL + "/complete/facebook/" + query
        console.log("QUERY", url)
        $.ajax({
            url        : url,
            dataType   : 'json',
            type       : 'POST',
        })
        .done(function(data) {
            // document.cookie = "token=" + data.token
            console.log("TOKENS>>>>>>", data)
            localStorage.token = data.token
        })
    }
});
