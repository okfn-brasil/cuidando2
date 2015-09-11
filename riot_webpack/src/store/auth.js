import decodeToken from 'jwt-decode'
import ajax from '../utils/ajax2'
import config from '../config.js'

class Auth {
    constructor(signal) {
        riot.observable(this)

        console.log('register-event')
        this.on(riot.VEC('register'), params => this.register(params))
        riot.control.addStore(this)
    }

    saveTokens(data) {
        // document.cookie = "token=" + data.token
        localStorage.mainToken = data.mainToken
        this.saveMicroToken(data)
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

    register(params) {
        ajax({
            url: config.apiurl_auth + "/user/" + params.username,
            data: {password: params.password, email: params.email},
            method: 'post',
        }).then(this.saveTokens.bind(this))
    }
}

let auth = new Auth()

export default auth
