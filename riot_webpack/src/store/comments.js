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
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaa commets chegaram!", response)
        return response.data[0]
    }
}

let comments = new Comments('comments')

export default comments
