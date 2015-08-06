define(["jquery", "app/jwt"], function($, decodeToken) {

    'use strict';


    // The page was reloaded and a getToken is pending. Needed when browser has
    // no support for window.history
    if (localStorage.queryForToken) {
        // TODO: ver pq esse getTokens, depois do reload quando não tem window.history, não funciona
        getTokens(localStorage.queryForToken)
        localStorage.queryForToken = ""
    }


    // ------------- Auth panel -------------------
    var registerPanel = $('#register-panel'),
        loginPanel = $('#login-panel'),
        closePanel = $('#close-panel-button'),
        authPanel = $('#auth-panel')
    // Open login panel
    $("#login-button").click(function(e) {
        registerPanel.hide()
        loginPanel.show()
        authPanel.show()
        return false
    })
    // Open register panel
    $("#register-button").click(function(e) {
        loginPanel.hide()
        registerPanel.show()
        authPanel.show()
        return false
    })
    // Close panel
    $("#close-panel-button").click(function(e) {
        authPanel.hide()
        return false
    })
    // -------------------------------------------


    // If redicected for login (from Facebook)
    if (/^\?redirect_state=/.test(location.search)) {
        var url = location.origin + "/" + localStorage.prevhash
        // var query = location.search.replace("redirected_for_login=1&", "")
        if (window.history.replaceState) {
            getTokens(location.search)
            window.history.replaceState(null, null, url)
        } else {
            // Save info to get tokens after page reload
            localStorage.queryForToken = location.search
            // Fallback method that doesn't requires "window.history" but
            // reloads the page.
            location.href = url
        }
    } else {
        updateButtons()
    }


    function getTokens(query) {
        var url = AUTH_API_URL + "/complete/facebook/" + query
        console.log("QUERY", url)
        $.ajax({
            url        : url,
            dataType   : 'json',
            type       : 'POST',
        })
        .done(saveTokens)
    }



    function saveTokens(data) {
        // document.cookie = "token=" + data.token
        localStorage.mainToken = data.mainToken
        saveMicroToken(data)

        updateButtons()
    }

    function saveMicroToken(data) {
        console.log("SAVE", data)
        localStorage.microToken = data.microToken

        var now = new Date()
        // Convert valid period from minutes to miliseconds, add it to now and
        // save for future checks, to see if it's still valid. We use this value
        // for checks instead of the exp field in the tokens because server and
        // clients may differ time settings.
        localStorage.microTokenValidTime = now.getTime() + data.microTokenValidPeriod * 60000
    }


    // Asks for a new micro token is the current one is too old, and calls
    // the callback
    function validateMicroTokenTime(callback) {
        var now = new Date()

        // Check if micro token is still valid for 30s
        if (now < localStorage.microTokenValidTime - 30000) {
            callback()
        // Get new micro token
        } else {
            var url = AUTH_API_URL + "/renew_micro_token"
            var data = {
                'token': localStorage.mainToken
            }
            console.log(data)
            $.ajax({
                url        : url,
                dataType   : 'json',
                contentType: 'application/json; charset=UTF-8',
                data       : JSON.stringify(data),
                type       : 'POST',
            })
            .done(function(data) {
                saveMicroToken(data)
                callback()
            })
            .fail(function(data, error, errorName) {
                // TODO: tratar se main token é inválido
                alert(data.responseJSON.message)
            })
        }
    }


    // Get current username
    function getUsername() {
        if (localStorage.mainToken) {
            try {
                return decodeToken(localStorage.mainToken).username
            }
            catch(err) {
                localStorage.removeItem("mainToken")
                localStorage.removeItem("microToken")
                alert("Error to decode stored token! Please relogin...")
            }
        }
        return null
    }


    // Update register/login/profile/logout buttons
    function updateButtons() {
        console.log("updateButtons")
        var username = getUsername(),
            link = "",
            profileButton = $('#user-profile-button'),
            registerButton = $('#register-button'),
            logoutButton = $('#logout-button'),
            loginButton = $('#login-button')

        if (!username) {
            logoutButton.hide()
            profileButton.hide()
            registerButton.show()
            loginButton.show()
        } else {
            link = '#pessoa/' + username
            logoutButton.show()
            profileButton.show()
            registerButton.hide()
            loginButton.hide()
        }

        profileButton.attr('href', link)
        profileButton.html(username)
        authPanel.hide()
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
        .done(saveTokens)
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
        .done(saveTokens)
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
            localStorage.removeItem("mainToken")
            localStorage.removeItem("microToken")
            updateButtons()
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
        $.getJSON(AUTH_API_URL + '/login/facebook/')
            .done(function(responseData) {
                var origRedirect = responseData.redirect
                var thisUrl = window.location.origin
                var parts = origRedirect.split(escape("?"))
                var newRedirect = parts[0].replace(/(redirect_uri=)[^\&]+/, '$1' + thisUrl) + escape("?") + parts[1]
                localStorage.prevhash = location.hash
                // redirect to site for login
                console.log("NEW-REDIRECT:", newRedirect)
                location.href = newRedirect
            })
        return false
    })

    return {
        validateMicroTokenTime: validateMicroTokenTime,
        getUsername: getUsername
    }
});
