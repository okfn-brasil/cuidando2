import config from 'config'
import ajax from '../utils/ajax.js'
import MapStore from './mapStore'
import auth from './auth'
import {registerSignals} from '../utils/helpers'

var api = config.apiurl_esic


function pedidosCompare(a, b) {
    return a.messages[0].received < b.messages[0].received ? 1 : -1
}

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
        registerSignals(this, 'sendPedido')
    }

    ajaxParams(key) {
        let url = `${api}/keywords/${key}`,
            method = 'get'
        return {url, method}
    }

    processResponse(json) {
        // Substitute strings for Dates
        console.log(json)
        for (let pedido of json.pedidos) {
            console.log(pedido)
            for (let message of pedido.messages) {
                console.log(message.received)
                message.received = new Date(message.received)
            }
        }
        return json.pedidos.sort(pedidosCompare)
    }

    // updatePedido(json) {
    //     if (json) {
    //         console.log('map', this._map, 'json', json)
    //         let key = json.keyword
    //         this._map[key] = this.processResponse(json)
    //         this.triggerChanged(key)
    //         console.log('UPDATE', key, json)
    //     }
    // }

    // Send a new pedido
    async sendPedido(params) {
        let url = `${api}/pedidos`,
            data = {
                'token': await auth.getMicroToken(),
                'text': params.text,
                'orgao': params.orgao,
                'keywords': params.keywords,
            }
        // this.updatePedido(await ajax({url, data, method: 'post'}))
        await ajax({url, data, method: 'post'})
        this.trigger(riot.SEC('pedidoSent'), {})
        this.load(params.keywords[0], true)
    }
}

let pedidos = new Pedidos('pedidos')

export default pedidos
