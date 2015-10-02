import ajax from '../utils/ajax'
import config from 'config'
import MapStore from './mapStore'
import auth from './auth'

let api = config.apiurl_auth

class UserInfo extends MapStore {
    constructor(signal) {
        super(signal)
        this.on(riot.VEC('sendEditUserinfo'), params => this.sendEdit(params))
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

    showErrorMessage(msg) {
        console.log(msg)
        this.trigger(riot.SEC('userError'), msg)
    }

    // Edit user info
    async sendEdit(params) {
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
        } catch(err) {
            this.showErrorMessage(
                JSON.parse((await err.response.json()).message))
        }
    }

    updateUser(json) {
        let key = json.username
        this._map[key] = json
        this.triggerChanged(key)
    }
}

let userinfo = new UserInfo('userinfo')

export default userinfo
