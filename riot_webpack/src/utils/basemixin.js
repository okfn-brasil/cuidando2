import translator from '../utils/translator'
import router from '../store/router'
// import config from '../config'
// import stores from '../stores'

var BaseMixin = {
    // init: function() {
    // },

    t: function() {
        return translator.translate(...arguments)
    },

    // tRoute: function() {
    //     return router.buildRoute(...arguments)
    // },

    fRoute: function() {
        return () => router.route(...arguments)
    },

    // Register a func to run on control event. Unregister at unmount.
    onControl: function(signal, func) {
        riot.control.on(signal, func)
        this.on('unmount', () => riot.control.off(signal, func))
    },

    router: router,
    // config: config,
    // s: stores,

    watch: function(names) {
        names = names.split(' ')
        for (let name of names) {
            let watcher = (val) => {
                if (this[name] != val) {
                    this[name] = val
                    // console.log('updating because of', name, 'to', val)
                    this.update()
                }
            }
            let signal = riot.SEC(name)
            // Watch var changes
            this.onControl(signal, watcher)
            // Request load
            riot.control.trigger(riot.VEL(name))
        }
    },

    // Watch var nameData, and request more data for it when nameDepends change
    watchDepends: function(nameData, nameDepends, onChange) {
        // Watch changes on main var
        this.onControl(riot.SEC(nameData), data => {
            if ((data.key == this[nameDepends]) &&
                (this[nameData] != data.value)) {
                this[nameData] = data.value
                onChange()
            }
        })

        // Watch changes on var which main depends
        this.onControl(riot.SEC(nameDepends), (valueDepends) => {
            if (this[nameDepends] != valueDepends) {
                this[nameDepends] = valueDepends
                riot.control.trigger(riot.VEL(nameData), this[nameDepends])
            }
        })

        // Load both vars
        console.log('mixing: trigger var:', nameData, 'key:', this[nameDepends])
        riot.control.trigger(riot.VEL(nameDepends))
        riot.control.trigger(riot.VEL(nameData), this[nameDepends])
    },

    // Trigger a change in stores
    triggerChange: function(name, value) {
        riot.control.trigger(riot.VEC(name), value)
    },
}

riot.mixin('base', BaseMixin)
