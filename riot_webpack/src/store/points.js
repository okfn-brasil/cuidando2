import config from '../config.js'
import ajax from '../utils/ajax.js'

class Points {
    constructor() {
        riot.observable(this)

        this._points = {}

        this.on(riot.VEL('points'), (year) => {
            if (year) this.load(year)
        })
    }

    load(year) {
        // If doesn't have current year data, load
        if (!(year in this._points)) {
            let api = config.apiurl_money,
                url = `${api}/execucao/minlist/${year}?state=1&capcor=1`
            ajax(url, 'get').then((response) => {
                this._points[year] = response
                this.triggerChanged(year)
            })
        } else {
            this.triggerChanged(year)
        }
    }

    triggerChanged(year) {
        this.trigger(riot.SEC('points'),
                     {year, points:this._points[year]})
    }
}


let instance = new Points()

// register to riot control by myself
riot.control.addStore(instance)
export default instance
