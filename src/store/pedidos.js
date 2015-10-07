import config from 'config'
import ajax from '../utils/ajax.js'
import MapStore from './mapStore'
import auth from './auth'
import {registerSignals} from '../utils/helpers'
import msgs from './msgs'

var api = config.apiurl_esic


function pedidosCompare(a, b) {
    return a.messages[0].received < b.messages[0].received ? 1 : -1
}


class Pedidos extends MapStore {
    constructor(signal) {
        super(signal)
        registerSignals(this, 'sendPedido', true)
    }

    ajaxParams(key) {
        let url = `${api}/keywords/${key}`,
            method = 'get'
        return {url, method}
    }

    processResponse(json) {
        // Substitute strings for Dates
        for (let pedido of json.pedidos) {
            for (let message of pedido.messages) {
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
        console.log('bbbbbbbbb')
        let ret = await ajax({url, data, method: 'post'})
        console.log(ret)
        if (ret) {
            // Force pedidos reload for this despesa
            this.load(params.keywords[0], true)
            msgs.addSuccess('Question sent')
        }
        return ret
    }
}

let pedidos = new Pedidos('pedidos')

export default pedidos
