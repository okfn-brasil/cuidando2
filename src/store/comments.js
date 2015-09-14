import config from '../config.js'
import ajax from '../utils/ajax.js'
import MapStore from './mapStore'
import auth from './auth'

var api = config.apiurl_comments

class Comments extends MapStore {
    constructor(signal) {
        super(signal)
        this.on(riot.VEC('sendComment'), params => this.sendComment(params))
        this.on(riot.VEC('sendReply'), params => this.sendReply(params))
    }
    ajaxParams(key) {
        let url = `${api}/thread/${key}`,
            method = 'get'
        return {url, method}
    }
    processResponse(response) {
        return response.json.comments
    }

    updateThread(key, comments) {
        this._map[key] = comments
        this.triggerChanged(key)
    }

    // Add comment to a thread
    async sendComment(params) {
        let url = `${api}/thread/${params.code}`,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
            }
        this.updateThread(params.code, this.processResponse(
            await ajax({url, data, method: 'post'})))
            // .then(this.processResponse.bind(this))
            // .then((response) => {
            //     this._map[params.code] = response
            //     this.triggerChanged(params.code)
            // })
            // this.trigger(riot.SEC('comments'), this.username)
    }

    // Reply to a comment
    async sendReply(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
            }
        this.updateThread(params.code, this.processResponse(
            await ajax({url, data, method: 'post'})))
    }
}

let comments = new Comments('comments')

export default comments
