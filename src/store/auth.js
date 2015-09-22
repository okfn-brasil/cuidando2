import decodeToken from 'jwt-decode'
import ajax from '../utils/ajax'
import config from 'config'

let api = config.apiurl_auth

let hasLocalStorage = true

// Test localStorage
// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
try {
    localStorage.setItem('t', 't')
    localStorage.removeItem('t')
} catch (e) {
    hasLocalStorage = false
    alert('Seu navegador parece não suportar localStorage. Por favor use um mais recente, ou você não conseguirá autenticar nesse site...')
}

// This code is needed to restore the hash after a redirect for login
// through a third-party.
// If redicected for login (from Facebook)
if (/^\?redirect_state=/.test(location.search)) {
    var url = location.origin + "/" + localStorage.prevhash
    // Save info to get tokens after page load/reload
    // If History is supported, tokens should be loaded after page load.
    // If History isn't supported, tokens should be loaded after page reload.
    localStorage.queryForToken = location.search
    if (window.history.replaceState) {
        window.history.replaceState(null, null, url)
    } else {
        // Fallback method that doesn't requires "window.history" but
        // reloads the page.
        location.href = url
    }
}

class Auth {
    constructor(signal) {
        riot.observable(this)

        // The page was reloaded and a getToken is pending.
        // Needed when browser has no support for window.history
        if (localStorage.queryForToken) {
            this.completeFacebook(localStorage.queryForToken)
            localStorage.queryForToken = ""
        }

        console.log('register-event')
        this.on(riot.VEC('register'), params => this.register(params))
        this.on(riot.VEC('login'), params => this.login(params))
        this.on(riot.VEC('loginFacebook'), () => this.loginFacebook())
        this.on(riot.VEC('logout'), () => this.logout())
        // View requesting current username
        this.on(riot.VEL('username'), () => {
            this.trigger(riot.SEC('username'), this.getUsername())
        })
        riot.control.addStore(this)
    }

    saveTokens(response) {
        // document.cookie = "token=" + data.token
        localStorage.mainToken = response.json.mainToken
        this.saveMicroToken(response.json)
        this.username = this.getUsername()
        this.trigger(riot.SEC('username'), this.username)
    }

    saveMicroToken(data) {
        console.log("SAVE", data)
        localStorage.microToken = data.microToken

        var now = new Date()
        // Convert valid period from minutes to miliseconds, add it to now and
        // save for future checks, to see if it's still valid. We use this value
        // for checks instead of the exp field in the tokens because server and
        // clients may differ time settings.
        localStorage.microTokenValidTime = now.getTime() + data.microTokenValidPeriod * 60000
    }

    async getMicroToken() {
        var now = new Date()

        // Check if micro token is still valid for 30s
        if (now < localStorage.microTokenValidTime - 30000) {
            console.log('auth:getMicroToken: no need to renew token')
        } else {
            let url = api + "/renew_micro_token",
                data = {
                    'token': localStorage.mainToken
                }
            console.log('auth:getMicroToken: renewing token with:', data)
            data = await ajax({url, data, method: 'post'})
            this.saveMicroToken(data.json)
        }
        return localStorage.microToken
    }

    getUsername() {
        if (localStorage.mainToken) {
            try {
                return decodeToken(localStorage.mainToken).username
            } catch(err) {
                localStorage.removeItem("mainToken")
                localStorage.removeItem("microToken")
                alert("Error to decode stored token! Please relogin...")
            }
        }
        return null
    }

    showErrorMessage(msg) {
        this.trigger(riot.SEC('authError'), msg)
    }

    async register(params) {
        try {
            this.saveTokens(await ajax({
                url: api + "/user/" + params.username,
                data: {password: params.password, email: params.email},
                method: 'post',
            }))
        } catch(err) {
            this.showErrorMessage(
                JSON.parse((await err.response.json()).message))
        }
    }

    async login(params) {
        try {
            this.saveTokens(await ajax({
                url: api + "/login/local",
                data: {username: params.username, password: params.password},
                method: 'post',
            }))
        } catch(err) {
            this.showErrorMessage(
                JSON.parse((await err.response.json()).message))
        }
    }

    loginFacebook() {
        ajax({
            url: api + '/login/external/manual/facebook',
            method: 'get',
        }).then(response => {
            let origRedirect = response.redirect,
                thisUrl = window.location.origin,
                parts = origRedirect.split(escape("?")),
                newRedirect = parts[0]
                    .replace(/(redirect_uri=)[^\&]+/, '$1' + thisUrl) +
                    escape("?") + parts[1]
            localStorage.prevhash = location.hash
            // redirect to site for login
            console.log("NEW-REDIRECT:", newRedirect)
            location.href = newRedirect
        })
    }

    // Complete Facebook login after redirect
    completeFacebook(query) {
        ajax({
            url: api + "/complete/manual/facebook" + query,
            method: 'post',
        }).then(this.saveTokens.bind(this))
    }

    logout() {
        ajax({
            url: api + "/logout",
            data: {'token': localStorage.mainToken},
            method: 'post',
        })
        localStorage.removeItem("mainToken")
        localStorage.removeItem("microToken")
        // TODO: Make userinfo store forget extra data about this user
        this.trigger(riot.SEC('username'), null)
    }
}

let auth = new Auth()

export default auth
