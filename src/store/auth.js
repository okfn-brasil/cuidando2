import decodeToken from 'jwt-decode'
import ajax from '../utils/ajax'
import config from 'config'
import {registerSignals} from '../utils/helpers'
import msgs from './msgs'
import userinfo from './userinfo'

let api = config.apiurl_auth


if (!window.hasLocalStorage) {
    showError('local_storage_not_supported')
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

        // this.on(riot.VEC('register'), params => this.register(params))
        // this.on(riot.VEC('login'), params => this.login(params))
        // this.on(riot.VEC('loginFacebook'), () => this.loginFacebook())
        // this.on(riot.VEC('logout'), () => this.logout())
        registerSignals(this,
            'register login loginFacebook logout forgotPassword resetPassword'
        )

        // View requesting current username
        this.on(riot.VEL('username'), () => {
            this.trigger(riot.SEC('username'), this.getUsername())
        })
        riot.control.addStore(this)
    }

    saveTokens(json) {
        if (json && json.mainToken) {
            localStorage.mainToken = json.mainToken
            this.saveMicroToken(json)
            this.username = this.getUsername()
            this.trigger(riot.SEC('username'), this.username)
        }
        else { console.log('saveTokens: invalid response:', json)}
    }

    saveMicroToken(data) {
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
            // console.log('auth:getMicroToken: no need to renew token')
        } else {
            let url = api + "/renew_micro_token",
                data = {
                    'token': localStorage.mainToken
                }
            // console.log('auth:getMicroToken: renewing token with:', data)
            let json = await ajax({url, data, method: 'post'})
            if (json) {
                this.saveMicroToken(json)
            } else {
                return null
            }
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
                msgs.addError('error_decode_token')
            }
        }
        return null
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
            if (json) this.trigger(riot.SEC('passwordResetSent'), json.exp)
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
    }

    // Complete Facebook login after redirect
    completeFacebook(query) {
        ajax({
            url: api + "/complete/manual/facebook" + query,
            method: 'post',
        }).then(this.saveTokens.bind(this))
    }

    async logout() {
        let token = localStorage.mainToken
        userinfo.forgetUser(this.getUsername())
        localStorage.removeItem("mainToken")
        localStorage.removeItem("microToken")
        try {
            await ajax({
                url: api + "/logout",
                data: {token},
                method: 'post',
            })
        } catch(err) {
            msgs.addError('error_logout_server')
        }
        this.trigger(riot.SEC('username'), null)
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
