import ajax from '../utils/ajax'
import config from 'config'
import MapStore from './mapStore'

let api = config.apiurl_auth

class UserInfo extends MapStore {
    constructor(signal) {
        super(signal)
        // this.init(signal)
    }
    ajaxParams(key) {
        let url = `${api}/user/${key}`,
            method = 'get'
        return {url, method}
    }
    processResponse(response) {
        return response.json
    }
}

let userinfo = new UserInfo('userinfo')

export default userinfo
