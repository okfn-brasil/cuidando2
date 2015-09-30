import translator from '../utils/translator'
import router from '../store/router'

var BaseMixin = {
    // init: function() {
    // },

    router: router,

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

    // Run a function if enter was pressed
    ifEnter: function(func) {
        return (event) => {
				    if(event.keyCode == 13){
						    func()
				    } else {
                // If is not Enter, run default
                return true
            }
        }
    },

    watch: function(names, func) {
        names = names.split(' ')
        for (let name of names) {
            let watcher = (val) => {
                if (this[name] != val) {
                    this[name] = val
                    if (func) func()
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

    // Watch vars mainDataNames, and request more data for them when nameDepends
    // change
    watchDepends: function(mainDataNames, nameDepends, ...onChangeFuncs) {
        let names = mainDataNames.split(' ')
        // Watch changes on main vars
        for (let i in names) {
            this.onControl(riot.SEC(names[i]), data => {
                if ((data.key == this[nameDepends]) &&
                    (this[names[i]] != data.value)) {
                    this[names[i]] = data.value
                    onChangeFuncs[i]()
                }
            })
        }

        // Watch changes on var which main depends
        this.onControl(riot.SEC(nameDepends), (valueDepends) => {
            if (this[nameDepends] != valueDepends) {
                this[nameDepends] = valueDepends
                for (let i in names) {
                    riot.control.trigger(riot.VEL(names[i]), this[nameDepends])
                }
            }
        })

        // Load both vars
        // console.log('mixing: trigger var:', nameData, 'key:', this[nameDepends])
        riot.control.trigger(riot.VEL(nameDepends))
        for (let i in names) {
            riot.control.trigger(riot.VEL(names[i]), this[nameDepends])
        }
    },

    // Trigger a change in stores
    triggerChange: function(name, value) {
        riot.control.trigger(riot.VEC(name), value)
    },
}

riot.mixin('base', BaseMixin)
