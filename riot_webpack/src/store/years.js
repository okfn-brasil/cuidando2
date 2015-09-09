import config from '../config.js'
import ajax from '../utils/ajax.js'

class Years {
    constructor() {
        riot.observable(this)

        this._years = null

        this.on(riot.VEL('years'), () => {
            this.load()
        })
    }

    load() {
        if (!this._years) {
            let url = config.apiurl_money + '/execucao/info'
            ajax(url, 'get').then((response) => {
                this._years = response.data.years
                this.triggerChanged()
            })
        } else {
            this.triggerChanged()
        }
    }

    triggerChanged() {
        this.trigger(riot.SEC('years'), this._years)
    }
}


let instance = new Years()


// register to riot control by myself
riot.control.addStore(instance)
export default instance
