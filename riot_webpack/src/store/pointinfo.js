import config from '../config.js'
import ajax from '../utils/ajax.js'

class PointInfo {
    constructor() {
        riot.observable(this)

        this._pointinfo = {}

        this.on(riot.VEL('pointinfo'), (code) => {
            if (code) this.load(code)
        })
    }

    load(code) {
        // If doesn't have current code data, load
        if (!(code in this._pointinfo)) {
            let api = config.apiurl_money,
                url = `${api}/execucao/list?code=${code}`
            ajax(url, 'get').then((response) => {
                this._pointinfo[code] = response.data[0]
                this.triggerChanged(code)
            })
        } else {
            this.triggerChanged(code)
        }
    }

    triggerChanged(code) {
        this.trigger(riot.SEC('pointinfo'),
                     {code, pointinfo:this._pointinfo[code]})
    }
}


let instance = new PointInfo()

// register to riot control by myself
riot.control.addStore(instance)
export default instance
