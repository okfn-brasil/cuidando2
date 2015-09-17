import config from 'config'
import ajax from '../utils/ajax.js'
import MapStore from './mapStore'
import auth from './auth'

var api = config.apiurl_comments

class Comments extends MapStore {
    constructor(signal) {
        super(signal)
        // Register signals
        for (let endname of ['Comment', 'Delete', 'Report',
                             'Reply', 'Edit', 'Vote']) {
            let name = `send${endname}`
            this.on(riot.VEC(name), params => this[name](params))
        }
        // this.on(riot.VEC('sendComment'), params => this.sendComment(params))
        // this.on(riot.VEC('sendDelete'), params => this.sendDelete(params))
        // this.on(riot.VEC('sendReport'), params => this.sendReport(params))
        // this.on(riot.VEC('sendReply'), params => this.sendReply(params))
        // this.on(riot.VEC('sendEdit'), params => this.sendEdit(params))
        // this.on(riot.VEC('sendVote'), params => this.sendVote(params))
    }
    ajaxParams(key) {
        let url = `${api}/thread/${key}`,
            method = 'get'
        return {url, method}
    }
    processResponse(response) {
        return response.json.comments
    }

    updateThread(response) {
        let key = response.json.name
        this._map[key] = response.json.comments
        this.triggerChanged(key)
    }

    // Add comment to a thread
    async sendComment(params) {
        let url = `${api}/thread/${params.code}`,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
            }
        this.updateThread(await ajax({url, data, method: 'post'}))
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
        this.updateThread(await ajax({url, data, method: 'post'}))
    }

    // Edit a comment
    async sendEdit(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
            }
        this.updateThread(await ajax({url, data, method: 'put'}))
    }

    // Delete a comment
    async sendDelete(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
            }
        this.updateThread(await ajax({url, data, method: 'delete'}))
    }

    // Report a comment
    async sendReport(params) {
        let url = api + params.url
            // data = {
            //     'token': await auth.getMicroToken(),
            // }
        this.updateThread(await ajax({url, method: 'post'}))
    }

    // Upvote/downvote comment from a thread
    // vote == true: upvote; vote == false: downvote
    async sendVote(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
                'vote': params.vote
            }
        this.updateThread(await ajax({url, data, method: 'post'}))
    }
}

let comments = new Comments('comments')

export default comments
