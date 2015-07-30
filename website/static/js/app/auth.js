define(["jquery", "app/jwt"], function($, decode_token) {

    'use strict';

    // Sets username when loading page and already logged
    if (localStorage.mainToken) {
        set_username()
    }


    // The page was reloaded and a get_token is pending. Needed when browser has
    // no support for window.history
    if (localStorage.query_for_token) {
        // TODO: ver pq esse get_tokens, depois do reload quando não tem window.history, não funciona
        get_tokens(localStorage.query_for_token)
        localStorage.query_for_token = ""
    }


    // If redicected for login
    if (/^\?redirected_for_login=1&/.test(location.search)) {
        var url = location.origin + "/" + localStorage.prevhash
        var query = location.search.replace("redirected_for_login=1&", "")
        if (window.history.replaceState) {
            get_tokens(query)
            window.history.replaceState(null, null, url)
        } else {
            // Save info to get tokens after page reload
            localStorage.query_for_token = query
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
        .done(save_tokens)
    }



    function save_tokens(data) {
        // document.cookie = "token=" + data.token
        localStorage.mainToken = data.mainToken
        localStorage.microToken = data.microToken
        set_username()
    }


    function set_username() {
        var username = ""
        if (localStorage.mainToken) {
            username = decode_token(localStorage.mainToken).username
        }
        $("#user-profile-button").html(username)
    }



    // Local Login
    $("#login-form-button").click(function(e) {
        var url = AUTH_API_URL + "/login_local"
        var data = {
            'username': $("#login-form-username").val(),
            'password': $("#login-form-password").val(),
        }
        console.log(data)
        $.ajax({
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data       : JSON.stringify(data),
            type       : 'POST',
        })
        .done(save_tokens)
        .fail(function(data, error, errorName) {
            alert(data.responseJSON.message)
        })
        return false
    })


    // Local Register
    $("#register-form-button").click(function(e) {
        var username = $("#register-form-username").val()
        var url = AUTH_API_URL + "/users/" + username + "/register"

        var password = $("#register-form-password").val()
        if (password != $("#register-form-password2").val()) {
            alert("Senhas não batem!")
        }

        var data = {
            'password': password
        }

        $.ajax({
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data       : JSON.stringify(data),
            type       : 'POST',
        })
        .done(save_tokens)
        .fail(function(data, error, errorName) {
            console.log(data)
            alert(data.responseJSON.message)
        })
        return false
    })


    // Logout
    $("#logout-button").click(function(e) {
        var url = AUTH_API_URL + "/logout"

        var data = {
            'token': localStorage.mainToken
        }

        $.ajax({
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data       : JSON.stringify(data),
            type       : 'POST',
        })
        .done(function(data) {
            localStorage.mainToken = ""
            localStorage.microToken = ""
            set_username()
        })
        .fail(function(data, error, errorName) {
            console.log(data)
            alert(data.responseJSON.message)
        })
        return false
    })



    // Facebook Login
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
                var origRedirect = response_data.redirect
                var thisUrl = window.location.origin
                var parts = origRedirect.split(escape("?"))
                var newRedirect = parts[0].replace(/(redirect_uri=)[^\&]+/, '$1' + thisUrl) + escape("?redirected_for_login=1&") + parts[1]
                localStorage.prevhash = location.hash
                // redirect to site for login
                location.href = newRedirect
            })
        return false
    })
});
