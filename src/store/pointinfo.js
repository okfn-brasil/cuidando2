import ajax from '../utils/ajax'
import config from 'config'
import MapStore from './mapStore'
import {registerSignals} from '../utils/helpers'

let api = config.apiurl_money


// Store for details about a point
class PointInfo extends MapStore {
    constructor(signal) {
        super(signal)
        registerSignals(this, 'multiPontinfo')
    }

    ajaxParams(key) {
        let url = `${api}/execucao/list?code=${key}`,
            method = 'get'
        return {url, method}
    }

    processResponse(json) {
        return json.data[0]
    }

    async multiPontinfo(params) {
        // let data = []
        //     toLoad = []

        let toLoad = params.codes.filter(x => !this._map[x])

        console.log('params', params, 'toLoad', toLoad)
        // for (let code of params.codes) {
        //     if (this._map[code]) {
        //         data.push({key: code, value: this._map[code]})
        //     } else {
        //         toLoad.push(code)
        //     }
        // }

        // If there are codes not yet loaded in this store, load
        if (toLoad.length) {
            // Request data
            let url = `${api}/execucao/list`,
                data = {codes: toLoad},
                json = await ajax({url, data, method: 'post'})
            // Update with new data
            if (json && json.data) {
                for (let info of json.data) {
                    this._map[info.code] = info
                }
            }
        }

        // Pack all data requested
        let data = params.codes.reduce((data, curr) => {
            data[curr] = this._map[curr]
            return data
        }, {})
        this.trigger(riot.SEC('multiPontinfo'), {key: params.key, value: data})
    }

    updateMulti(json) {
        if (json) {
            for (let point of json.data) {
            }
        }
    }
}

let pointinfo = new PointInfo('pointinfo')
export default pointinfo
