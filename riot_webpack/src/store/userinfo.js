import ajax from '../utils/ajax2'
import config from '../config.js'
import MapStore from './mapStore'

class UserInfo extends MapStore{
    constructor(signal) {
        super(signal)
        // this.init(signal)
    }
    ajaxParams(key) {
        let api = config.apiurl_auth,
            url = `${api}/user/${key}`,
            method = 'get'
        return {url, method}
    }
    processResponse(response) {
        return response
    }
}

let userinfo = new UserInfo('userinfo')

export default userinfo
