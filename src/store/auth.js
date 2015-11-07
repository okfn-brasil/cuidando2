import decodeToken from 'jwt-decode'
import ajax from '../utils/ajax'
import config from 'config'
import {registerSignals} from '../utils/helpers'
import msgs from './msgs'
import userinfo from './userinfo'

let api = config.apiurl_auth


if (!window.hasLocalStorage) {
    msgs.addError('local_storage_not_supported')
}

class Auth {
    constructor(signal) {
        riot.observable(this)

        this.loadUsername()

        // The page was reloaded and a getToken is pending.
        // Needed when browser has no support for window.history
        if (localStorage.queryForToken) {
            this.completeFacebook(localStorage.queryForToken)
            localStorage.queryForToken = ""
        }

        // this.on(riot.VEC('register'), params => this.register(params))
        // this.on(riot.VEC('login'), params => this.login(params))
        // this.on(riot.VEC('loginFacebook'), () => this.loginFacebook())
        // this.on(riot.VEC('logout'), () => this.logout())
        registerSignals(
            this,
            'register login loginFacebook logout forgotPassword resetPassword',
            true)

        // View requesting current username
        this.on(riot.VEL('username'), () => {
            this.trigger(riot.SEC('username'), this.getUsername())
        })
        riot.control.addStore(this)
    }

    clearUserData() {
        if (this._currUsername) userinfo.forgetUser(this._currUsername)
        localStorage.removeItem("mainToken")
        localStorage.removeItem("microToken")
        this._currUsername = null
        this.trigger(riot.SEC('username'), null)
    }

    loadUsername() {
        if (localStorage.mainToken) {
            var now = new Date()
            // Check if main token is still valid for 30s
            if (now < localStorage.mainTokenValidTime - 30000) {
                try {
                    this._currUsername = decodeToken(localStorage.mainToken).username
                } catch(err) {
                    this.clearUserData()
                    msgs.addError('error_decode_token')
                    return null
                }
            } else {
                // Clear tokens if main token is too old
                this.clearUserData()
            }
        }
        return true
    }

    // Return the real exp time for a token, based on its validPeriod and
    // current time
    realExp(validPeriod) {
        let now = new Date()
        // Convert valid period from minutes to miliseconds, add it to now and
        // return for future checks, to see if it's still valid. We use this value
        // for checks instead of the exp field in the tokens because server and
        // clients may differ time settings.
        return now.getTime() + validPeriod * 60000
    }

    saveTokens(json) {
        if (json && json.mainToken) {
            localStorage.mainToken = json.mainToken
            localStorage.mainTokenValidTime = this.realExp(json.mainTokenValidPeriod)
            this.saveMicroToken(json)
            if (this.loadUsername())
                this.trigger(riot.SEC('username'), this._currUsername)
        }
        else { msgs.addError('error_token_json')}
    }

    saveMicroToken(data) {
        localStorage.microToken = data.microToken
        localStorage.microTokenValidTime = this.realExp(data.microTokenValidPeriod)
    }

    async getMicroToken() {
        var now = new Date()

        // Check if micro token is still valid for 30s
        if (now < localStorage.microTokenValidTime - 30000) {
            // console.log('auth:getMicroToken: no need to renew token')
        } else {
            let url = api + "/renew_micro_token",
                data = {
                    'token': localStorage.mainToken
                }
            // console.log('auth:getMicroToken: renewing token with:', data)
            try {
                let json = await ajax({url, data, method: 'post'})
                if (json) this.saveMicroToken(json)
                else return null
            } catch(err) {
                this.clearUserData()
                msgs.addError('error_renew_token')
            }
        }
        return localStorage.microToken
    }

    getUsername() {
        return this._currUsername
    }

    async showErrorMessage(err) {
        let msg = JSON.parse((await err.response.json()).message)
        this.trigger(riot.SEC('authError'), msg)
    }

    async register(params) {
        try {
            this.saveTokens(await ajax({
                url: api + "/users",
                data: {username: params.username,
                       password: params.password,
                       email: params.email},
                method: 'post',
            }))
        } catch(err) {
            await this.showErrorMessage(err)
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
            await this.showErrorMessage(err)
        }
    }

    async forgotPassword(params) {
        try {
            let json = await ajax({
                url: api + "/reset_password",
                data: {username: params.username, email: params.email},
                method: 'post',
            })
            // if (json) this.trigger(riot.SEC('passwordResetSent'), json.exp)
            if (json) return json.exp
            else return false
        } catch(err) {
            await this.showErrorMessage(err)
        }
    }

    async resetPassword(params) {
        try {
            this.saveTokens(await ajax({
                url: api + "/reset_password",
                data: {
                    username: params.username,
                    password: params.password,
                    email: params.email,
                    code: params.code
                },
                method: 'put',
            }))
        } catch(err) {
            await this.showErrorMessage(err)
        }
    }

    async loginFacebook() {
        try {
            let json = await ajax({
                url: api + '/login/external/manual/facebook',
                method: 'get',
            })
            if (json) {
                let origRedirect = json.redirect,
                    thisUrl = window.location.origin,
                    parts = origRedirect.split(escape("?")),
                    newRedirect = parts[0]
                        .replace(/(redirect_uri=)[^\&]+/, '$1' + thisUrl) +
                        escape("?") + parts[1]
                localStorage.prevhash = location.hash
                // redirect to site for login
                location.href = newRedirect
            }
        } catch(err) {
            msgs.addError('error_get_url_facebook')
        }
    }

    // Complete Facebook login after redirect
    async completeFacebook(query) {
        try {
            this.saveTokens(await ajax({
                url: api + "/complete/manual/facebook" + query,
                method: 'post',
            }))
        } catch(err) {
            msgs.addError('error_complete_login_facebook')
        }
    }

    async logout() {
        let token = localStorage.mainToken
        this.clearUserData()
        try {
            await ajax({
                url: api + "/logout",
                data: {token},
                method: 'post',
            })
        } catch(err) {
            msgs.addError('error_logout_server')
        }
    }
}

let auth = new Auth()
export default auth


// Helper function to check if is logged and open the login modal if not.
// Requires an event that will be passed to the modal
export function checkIsLogged(event) {
    if (auth.getUsername()) {
        return true
    } else {
        let modal = document.getElementById('modal-login')._tag
        modal.openModal(event)
        modal.update()
        return false
    }
}
