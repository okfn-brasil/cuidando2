import config from '../config.js'
import ajax from '../utils/ajax.js'
import stores from '../stores'

console.log('NNNNNNNNNNOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO')

class Points {
    constructor() {
        riot.observable(this)

        this._codes = {}
    }

    get() {return this._points[stores.year]}

    load(params) {
        // If doesn't have current year data, load
        if (!(year in this._points)) {
            let api = config.apiurl_money,
                url = `${api}/execucao/list?${query}`
            ajax(url, 'get').then((response) => {
                this._points[year] = response
                this.triggerChanged(year)
            })
        } else {
            this.triggerChanged(year)
        }
    }

    triggerChanged(year) {
        this.trigger(riot.SEC('points'), this._points[year])
    }
}


let instance = new Points()

instance.on(riot.VEL('points'), () => {
    instance.loadPoints()
})

// riot.control.on(riot.SEC.YEAR_CHANGED, (year) => {
//     instance.loadPoints()
// })

// register to riot control by myself
riot.control.addStore(instance)
export default instance
