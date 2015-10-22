import config from 'config'
import ajax from '../utils/ajax.js'
import MapStore from './mapStore'
import auth from './auth'
import msgs from '../store/msgs'
import {registerSignals} from '../utils/helpers'

var api = config.apiurl_comments


function commentCompare(a, b) {return a.created < b.created ? 1 : -1}

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

    async updateThread(params, errorMsg) {
        let json = null
        try {
            json = await ajax(params)
            if (json) {
                let key = json.name
                this._map[key] = this.processResponse(json)
                this.triggerChanged(key)
            }
        } catch(err) {
            msgs.addError(errorMsg)
        }
        return json
    }

    // Add comment to a thread
    async sendComment(params) {
        let url = `${api}/thread/${params.code}`,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
            }
        return await this.updateThread({url, data, method: 'post'},
            'Error to add comment')
    }

    // Reply to a comment
    async sendReply(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
            }
        return await this.updateThread({url, data, method: 'post'},
            'Error to add reply')
    }

    // Edit a comment
    async sendEdit(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
            }
        return await this.updateThread({url, data, method: 'put'},
            'Error to edit comment')
    }

    // Delete a comment
    async sendDelete(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
            }
        return await this.updateThread({url, data, method: 'delete'},
                                       'Error to delete comment')
    }

    // Report a comment
    async sendReport(params) {
        let url = api + params.url
            // data = {
            //     'token': await auth.getMicroToken(),
            // }
        try {
            let ret = await ajax({url, method: 'post'})
            if (ret) msgs.addSuccess('Comment reported')
            return ret
        } catch(err) {
            msgs.addError('Error to report comment')
        }
    }

    // Upvote/downvote comment from a thread
    // vote == true: upvote; vote == false: downvote
    async sendVote(params) {
        let url = api + params.url,
            data = {
                'token': await auth.getMicroToken(),
                'vote': params.vote
            }

        return await this.updateThread({url, data, method: 'post'},
                                       'Error to vote for comment')
    }
}

let comments = new Comments('comments')

export default comments
