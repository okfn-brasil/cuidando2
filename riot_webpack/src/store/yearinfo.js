import config from '../config.js'
import ajax from '../utils/ajax.js'

class YearInfo {
    constructor() {
        riot.observable(this)

        this._yearinfo = {}

        this.on(riot.VEL('yearinfo'), (year) => {
            if (year) this.load(year)
        })
    }

    load(year) {
        // If doesn't have current year data, load
        if (!(year in this._yearinfo)) {
            let api = config.apiurl_money,
                url = `${api}/execucao/info/${year}`
            ajax(url, 'get').then((response) => {
                this._yearinfo[year] = response.data
                this.triggerChanged(year)
            })
        } else {
            this.triggerChanged(year)
        }
    }

    triggerChanged(year) {
        this.trigger(riot.SEC('yearinfo'),
                     {year, yearinfo:this._yearinfo[year]})
    }
}


let instance = new YearInfo()

// register to riot control by myself
riot.control.addStore(instance)
export default instance
