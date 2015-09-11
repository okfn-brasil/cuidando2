import config from '../config.js'
import MapStore from './mapStore'

class Comments extends MapStore {
    ajaxParams(key) {
        let api = config.apiurl_comments,
            url = `${api}/thread/${key}`,
            method = 'get'
        return {url, method}
    }
    processResponse(response) {
        return response.comments
    }
}

let comments = new Comments('comments')

export default comments
