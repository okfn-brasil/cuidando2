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
            console.log(`starting to watch ${name} in`, this.root)
            let watcher = (val) => {
                console.log(`watched-SEC-${name}-change from:`, this[name], `to`, val, 'in', this.root)
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

    // Trigger a change in stores
    triggerChange: function(name, value) {
        // riot.control.trigger(riot.VE.CHANGE_YEAR, event.target.value)
        riot.control.trigger(riot.VEC(name), value)
    },

    // watchRouter: function(names) {
    //     names = names.split(' ')
    //     for (let name of names) {
    //         let signal = `re_${name}_changed`
    //         // console.log(signal, riot.RE[signal.toUpperCase()], riot.RE)
    //         // riot.control.on(riot.RE[signal.toUpperCase()], val => {
    //         riot.control.on(signal, val => {
    //             this.update()
    //         })
    //     }
    // },
}

riot.mixin('base', BaseMixin)
