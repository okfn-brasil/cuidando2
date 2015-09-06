import config from '../config.js'
import ajax from '../utils/ajax.js'
import stores from '../stores'

class Point {
    constructor() {
        riot.observable(this)

        this._point = {}
    }

    get() {return this._point[stores.year]}

    loadPoints() {
        let year = stores.year
        // If doesn't have current year data, load
        if (!(year in this._point)) {
            let api = config.apiurl_money,
                url = `${api}/execucao/minlist/${year}?state=1&capcor=1`
            ajax(url, 'get').then((response) => {
                this._point[year] = response
                this.triggerChanged(year)
            })
        } else {
            this.triggerChanged(year)
        }
    }

    triggerChanged(year) {
        this.trigger(riot.SE.POINTS_CHANGED, this._point[year])
    }
}


let instance = new Point()

instance.on(riot.VE.LOAD_POINTS, () => {
    instance.loadPoints()
})

riot.control.on(riot.SE.YEAR_CHANGED, (year) => {
    instance.loadPoints()
})

// register to riot control by myself
riot.control.addStore(instance)
export default instance
