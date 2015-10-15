import config from 'config'
import ajax from '../utils/ajax.js'
import MapStore from './mapStore'
import auth from './auth'
import {registerSignals} from '../utils/helpers'

var api = config.apiurl_comments


function commentCompare(a, b) {return a.created > b.created ? 1 : -1}

function orderComments(comments) {
    // Substitute strings for Dates
    for (let comment of comments) {
        comment.created = new Date(comment.created)
        comment.modified = new Date(comment.modified)
    }
    comments.sort(commentCompare)
    for (let com of comments) {
        if (com.replies) orderComments(com.replies)
    }
    return comments
}


class Comments extends MapStore {
    constructor(signal) {
        super(signal)
        registerSignals(
            this,
            'sendComment sendDelete sendReport sendReply sendEdit sendVote',
            true
        )
    }
    ajaxParams(key) {
        let url = `${api}/thread/${key}`,
            method = 'get'
        return {url, method}
    }
    processResponse(json) {
        orderComments(json.comments)
        return json
    }

    updateThread(json) {
        if (json) {
            let key = json.name
            this._map[key] = this.processResponse(json)
            this.triggerChanged(key)
        }
    }

    // Add comment to a thread
    async sendComment(params) {
        let url = `${api}/thread/${params.code}`,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
            }
        let ret = await ajax({url, data, method: 'post'})
        this.updateThread(ret)
        return ret
    }

    // Reply to a comment
    async sendReply(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
            }
        let ret = await ajax({url, data, method: 'post'})
        this.updateThread(ret)
        return ret
    }

    // Edit a comment
    async sendEdit(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
            }
        let ret = await ajax({url, data, method: 'put'})
        this.updateThread(ret)
        return ret
    }

    // Delete a comment
    async sendDelete(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
            }
        let ret = await ajax({url, data, method: 'delete'})
        this.updateThread(ret)
        return ret
    }

    // Report a comment
    async sendReport(params) {
        let url = api + params.url
            // data = {
            //     'token': await auth.getMicroToken(),
            // }
        return await ajax({url, method: 'post'})
    }

    // Upvote/downvote comment from a thread
    // vote == true: upvote; vote == false: downvote
    async sendVote(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
                'vote': params.vote
            }
        let ret = await ajax({url, data, method: 'post'})
        this.updateThread(ret)
        return ret
    }
}

let comments = new Comments('comments')

export default comments
