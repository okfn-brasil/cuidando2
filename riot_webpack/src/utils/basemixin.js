import translator from '../utils/translator'
import router from '../store/router'
import ajax from '../utils/ajax'
import config from '../config'
import stores from '../stores'

var BaseMixin = {
    init: function() {
    },

    t: function() {
        return translator.translate(...arguments)
    },

    tRoute: function() {
        return router.buildRoute(...arguments)
    },

    fRoute: function() {
        return () => router.route(...arguments)
    },

    router: router,
    config: config,
    ajax: ajax,
    s: stores,

    watch: function(names) {
        names = names.split(' ')
        for (let name of names) {
            let watcher = (val) => {
                if (this[name] != val) {
                    this[name] = val
                    console.log('updating')
                    this.update()
                }
            }
            let signal = riot.SEC(name)
            // Watch var changes
            riot.control.on(signal, watcher)
            // Unwatch when unmount
            this.on('unmount', () => {
                riot.control.off(signal, watcher)
            })
            // Request load
            riot.control.trigger(riot.VEL(name))
        }
    },

    // Watch var nameData, and request more data for it when nameDepends change
    watchDepends: function(nameData, nameDepends, onChange) {
        riot.control.on(riot.SEC(nameData), data => {
            if (data.key == this[nameDepends]) {
                this[nameData] = data.value
                onChange()
            }
        })

        riot.control.on(riot.SEC(nameDepends), (valueDepends) => {
            if (this[nameDepends] != valueDepends) {
                this[nameDepends] = valueDepends
                riot.control.trigger(riot.VEL(nameData), this[nameDepends])
            }
        })

        riot.control.trigger(riot.VEL(nameData), this[nameDepends])
    },

    // Trigger a change in stores
    triggerChange: function(name, value) {
        riot.control.trigger(riot.VEC(name), value)
    },
}

riot.mixin('base', BaseMixin)
