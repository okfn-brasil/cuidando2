import ajax from '../utils/ajax2.js'

export default class MapStore {
    constructor(signal) {
        this.init(signal)
    }

    // These need to be defined
    // ajaxParams(key) { return params }
    // processResponse(response) { return response }

    init(signal) {
        riot.observable(this)

        this._map = {}

        this.signal = signal

        this.on(riot.VEL(this.signal), (key) => {
            if (key) this.load(key)
        })
        riot.control.addStore(this)
    }

    load(key) {
        // If doesn't have current key data, load
        if (!(key in this._map)) {
            ajax(this.ajaxParams(key))
                .then(this.processResponse)
                .then((response) => {
                this._map[key] = response
                this.triggerChanged(key)
            })
        } else {
            this.triggerChanged(key)
        }
    }

    triggerChanged(key) {
        this.trigger(riot.SEC(this.signal),
                     {key, value:this._map[key]})
    }
}
