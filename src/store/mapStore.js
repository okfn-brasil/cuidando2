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
            // console.log('mapstore:signal', this.signal, 'key:', key)
            if (this.forceKey) key = this.forceKey
            if (key) this.load(key)
        })
        riot.control.addStore(this)
    }

    async load(key) {
        // If doesn't have current key data, load
        let current = this._map[key]
        if (current === undefined) {
            this._map[key] = 'loading'
            this._map[key] = this.processResponse(
                await ajax(
                    await this.ajaxParams(key)))
            this.triggerChanged(key)
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
