import ajax from '../utils/ajax.js'

class Year {
    constructor() {
        riot.observable(this)

        this._year = new Date().getFullYear().toString()
    }

    get() {return this._year}
}


let instance = new Year()

instance.on(riot.VE.CHANGE_YEAR, (year) => {
    instance._year = year
    instance.trigger(riot.SE.YEAR_CHANGED, instance._year)
})

// register to riot control by myself
riot.control.addStore(instance)
export default instance
