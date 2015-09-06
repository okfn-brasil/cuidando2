import config from '../config.js'
import ajax from '../utils/ajax.js'

class Years {
    constructor() {
        riot.observable(this)

        this._years = null
    }

    get() {return this._years}
}


let instance = new Years()

instance.on(riot.VEL('years'), () => {
    if (!instance._years) {
        let url = config.apiurl_money + '/execucao/info'
        ajax(url, 'get').then((response) => {
            instance._years = response.data.years
            console.log('SEC-years:', instance._years)
            instance.trigger(riot.SEC('years'), instance._years)
        })
    } else {
        console.log('SEC-years:', instance._years)
        instance.trigger(riot.SEC('years'), instance._years)
    }
})

// register to riot control by myself
riot.control.addStore(instance)
export default instance
