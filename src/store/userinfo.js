import ajax from '../utils/ajax'
import config from 'config'
import MapStore from './mapStore'
import auth from './auth'
import {registerSignals} from '../utils/helpers'

let api = config.apiurl_auth

class UserInfo extends MapStore {
    constructor(signal) {
        super(signal)
        registerSignals(
            this,
            'sendEditUserinfo',
            true)
    }
    async ajaxParams(key) {
        let url = `${api}/users/${key}`,
            method = 'get',
            params = {url, method}

        // If trying to get data about the current user,
        // send a PUT to get extra info.
        if (auth.getUsername() == key) {
            params.method = 'put'
            params.data = {
                'token': await auth.getMicroToken()
            }
        }
        return params
    }

    async showErrorMessage(error) {
        let msg = JSON.parse((await error.response.json()).message)
        this.trigger(riot.SEC('userError'), msg)
    }

    // Edit user info
    async sendEditUserinfo(params) {
        let url = `${api}/users/${params.username}`,
            data = {
                'token': await auth.getMicroToken(),
                'description': params.description,
                'email': params.email,
                'password': params.password,
                'new_password': params['new_password'],
            }
        try {
            this.updateUser(await ajax({url, data, method: 'put'}))
        } catch(error) {
            await this.showErrorMessage(error)
        }
    }

    updateUser(json) {
        if (json) {
            let key = json.username
            this._map[key] = json
            this.triggerChanged(key)
        }
    }

    // Forget info about an user. Usefull when user logout,
    // so no sensible data remains in this store.
    forgetUser(username) {
        if (username) this._map[username] = undefined
    }
}

let userinfo = new UserInfo('userinfo')

export default userinfo
