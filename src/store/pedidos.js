import config from 'config'
import ajax from '../utils/ajax.js'
import MapStore from './mapStore'
import auth from './auth'
import {registerSignals} from '../utils/helpers'
import msgs from './msgs'

var api = config.apiurl_esic


function pedidosCompare(a, b) {
    return a.history[0].date < b.history[0].date ? 1 : -1
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
            pedido.request_date = new Date(pedido.request_date)
            for (let message of pedido.history) {
                message.date = new Date(message.date)
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
            },
            ret = null
        // this.updatePedido(await ajax({url, data, method: 'post'}))
        try {
            ret = await ajax({url, data, method: 'post'})
            if (ret) {
                // Force pedidos reload for this despesa
                this.load(params.keywords[0], true)
                msgs.addSuccess('Question sent')
            }
        } catch(err) {
            msgs.addError('error_send_question')
        }
        return ret
    }
}

let pedidos = new Pedidos('pedidos')

export default pedidos
