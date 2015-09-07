import config from '../config.js'
import ajax from '../utils/ajax.js'
import stores from '../stores'

class Points {
    constructor() {
        riot.observable(this)

        this._points = {}

        this.on(riot.VEL('points'), (year, tag) => {
            console.log('LOADDDDDD POINTS', year, 'from:', tag)
            if (year) this.loadPoints(year)
        })
    }

    get() {return this._points[stores.year]}

    loadPoints(year) {
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

// riot.control.on(riot.SE.YEAR_CHANGED, (year) => {
//     instance.loadPoints()
// })

// register to riot control by myself
riot.control.addStore(instance)
export default instance
