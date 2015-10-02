import config from 'config'
import ajax from '../utils/ajax.js'
import MapStore from './mapStore'
import auth from './auth'
import {registerSignals} from '../utils/helpers'

var api = config.apiurl_esic


// function commentCompare(a, b) {return a.created > b.created ? 1 : -1}

// function orderComments(comments) {
//     comments.sort(commentCompare)
//     for (let com of comments) {
//         if (com.replies) orderComments(com.replies)
//     }
//     return comments
// }


class Pedidos extends MapStore {
    constructor(signal) {
        super(signal)
        registerSignals(this,
            'sendPedido'
        )
    }

    ajaxParams(key) {
        let url = `${api}/keywords/${key}`,
            method = 'get'
        return {url, method}
    }

    processResponse(json) {
        // orderComments(response.json.comments)
        return json.pedidos
    }

    updatePedido(json) {
        let key = json.keyword
        this._map[key] = this.processResponse(json)
        this.triggerChanged(key)
    }

    // Send a new pedido
    async sendPedido(params) {
        let url = `${api}/pedidos`,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
                'orgao': params.orgao,
                'keywords': params.keywords,
            }
        this.updatePedido(await ajax({url, data, method: 'post'}))
    }
}

let pedidos = new Pedidos('pedidos')

export default pedidos
