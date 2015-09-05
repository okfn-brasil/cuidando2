import config from '../config.js'
import ajax from '../utils/ajax.js'
import stores from '../stores'

class Points {
    constructor() {
        riot.observable(this)

        this._points = {}
    }

    get() {return this._points[stores.year]}

    loadPoints() {
        // If doesn't have current year data, load
        if (!(stores.year in instance._points)) {
            let url = `${config.apiurl_money}/execucao/minlist/${stores.year}?state=1&capcor=1`
            ajax(url, 'get').then((response) => {
                instance._points[stores.year] = response
                instance.trigger(riot.SE.POINTS_CHANGED, instance._points[stores.year])
            })
        } else {
            instance.trigger(riot.SE.POINTS_CHANGED, instance._points[stores.year])
        }
    }
}


let instance = new Points()

instance.on(riot.VE.LOAD_POINTS, () => {
    instance.loadPoints()
})

riot.control.on(riot.SE.YEAR_CHANGED, (year) => {
    instance.loadPoints()
})

// register to riot control by myself
riot.control.addStore(instance)
export default instance
