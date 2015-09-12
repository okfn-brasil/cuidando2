import ajax from '../utils/ajax.js'

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
            if (this.forceKey) key = this.forceKey
            if (key) this.load(key)
        })
        riot.control.addStore(this)
    }

    load(key) {
        // If doesn't have current key data, load
        let current = this._map[key]
        if (current === undefined) {
            this._map[key] = 'loading'
            ajax(this.ajaxParams(key))
                .then(this.processResponse.bind(this))
                .then((response) => {
                    this._map[key] = response
                    this.triggerChanged(key)
                })
                // TODO: como tratar erros?
                // .catch(error => console.log('CATEEI', error))
        } else {
            this.triggerChanged(key)
        }
    }

    triggerChanged(key) {
        let value = this._map[key]
        if (value == 'loading') value = undefined
        this.trigger(riot.SEC(this.signal), {key, value})
    }
}
