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

instance.one(riot.VE.LOAD_YEARS, () => {
    let url = config.apiurl_money + '/execucao/info'
    if (!instance._years) ajax(url, 'get').then((response) => {
        instance._years = response.data.years
        instance.trigger(riot.SE.YEARS_CHANGED, instance._years)
    })
})

// register to riot control by myself
riot.control.addStore(instance)
export default instance
