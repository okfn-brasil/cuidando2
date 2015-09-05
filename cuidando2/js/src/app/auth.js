define(["jquery", "app/jwt", 'app/templates', 'app/interface'], function($, decodeToken, templates) {

    'use strict';

    var hasLocalStorage = true

    // Test localStorage
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
    try {
        localStorage.setItem('t', 't')
        localStorage.removeItem('t')
    } catch (e) {
        hasLocalStorage = false
        alert('Seu navegador parece não suportar localStorage. Por favor use um mais recente, ou você não conseguirá autenticar nesse site...')
    }


    // The page was reloaded and a getToken is pending.
    // Needed when browser has no support for window.history
    if (localStorage.queryForToken) {
        getTokens(localStorage.queryForToken)
        localStorage.queryForToken = ""
    }


    templates.smartApply('auth', {})

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


    updateButtons()


    function getTokens(query) {
        var url = AUTH_API_URL + "/complete/manual/facebook" + query
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
    // the callback passing args
    function validateMicroTokenTime(callback, args) {
        // TODO: verificar se está logado?
        var now = new Date()

        // Check if micro token is still valid for 30s
        if (now < localStorage.microTokenValidTime - 30000) {
            callback(args)
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
                callback(args)
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
            // link = "",
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
            // link = '#pessoa/' + username
            logoutButton.show()
            profileButton.show()
            registerButton.hide()
            loginButton.hide()
        }

        // profileButton.attr('href', link)
        templates.smartApply('user-profile-button', {'username': username})
        // profileButton.click(function () {
        //     urlManager.route("pessoa", username)
        // })
        // profileButton.html(username)
        authPanel.hide()
    }


    // Local Login
    $("#login-form-button").click(function(e) {
        var url = AUTH_API_URL + "/login/local"
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
        var url = AUTH_API_URL + "/user/" + username

        var password = $("#register-form-password").val()
        if (password != $("#register-form-password2").val()) {
            alert("Senhas não batem!")
            return false
        }

        var data = {
            'password': password,
            'email': $("#register-form-email").val()
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
            .fail(function(data, error, errorName) {
                // TODO: tentar de novo?
                console.log(data)
                alert(data.responseJSON.message)
            })
            .always(function(data) {
                localStorage.removeItem("mainToken")
                localStorage.removeItem("microToken")
                updateButtons()
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
        $.getJSON(AUTH_API_URL + '/login/external/manual/facebook')
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
})