import ajax from '../utils/ajax'
import config from 'config'
import MapStore from './mapStore'
import auth from './auth'

let api = config.apiurl_auth

class UserInfo extends MapStore {
    constructor(signal) {
        super(signal)
        // this.init(signal)
        this.on(riot.VEC('sendEditUserinfo'), params => this.sendEdit(params))
    }
    async ajaxParams(key) {
        let url = `${api}/user/${key}`,
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
    processResponse(response) {
        return response.json
    }

    // Edit user info
    async sendEdit(params) {
        let url = `${api}/user/${params.username}`,
            data = {
                'token': await auth.getMicroToken(),
                'description': params.description,
                'email': params.email,
            }
        this.updateUser(await ajax({url, data, method: 'put'}))
    }

    updateUser(response) {
        let key = response.json.username
        this._map[key] = this.processResponse(response)
        this.triggerChanged(key)
    }
}

let userinfo = new UserInfo('userinfo')

export default userinfo
