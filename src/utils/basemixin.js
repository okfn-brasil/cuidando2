import translator from '../utils/translator'
import router from '../store/router'
import assets from '../assets'

var BaseMixin = {
    // init: function() {
    // },

    router: router,
    assets: assets,

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
        let offFunc = function() {riot.control.off(signal, func)}
        this.on('unmount', offFunc)
        return offFunc
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

    watch: function(names, func, always) {
        names = names.split(' ')
        for (let name of names) {
            let watcher = (val) => {
                if (this[name] != val) {
                    this[name] = val
                    if (func) func()
                    this.update()
                }
                if(always) always()
            }
            let signal = riot.SEC(name)
            // Watch var changes
            this.onControl(signal, watcher)
            // Request load
            riot.control.trigger(riot.VEL(name))
        }
    },

    // Watch vars mainDataNames, and request more data for
    // them when nameDepends change
    // E.g.: watchDepends('var1', 'var2', func1) -> will ask for more data
    // about var1 when var2 changes, and run func1 when the data is received.
    // E.g.2: watchDepends('var1 var2', 'dep', func1, func2) -> will ask for
    // more data abourt var1 and var2 when dep changes, and call func1 when
    // the data abourt var1 comes, and func2 when data about var2 comes.
    watchDepends: function(mainDataNames, nameDepends, ...onChangeFuncs) {
        let names = mainDataNames.split(' ')
        // Watch changes on main vars
        for (let i in names) {
            this.onControl(riot.SEC(names[i]), data => {
                if ((data.key == this[nameDepends])
                    && (this[names[i]] != data.value)) {
                    this[names[i]] = data.value
                    onChangeFuncs[i]()
                }
            })
        }

        // Watch changes on var which main depends on
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

    // Trigger a change in stores only if is not already doing it.
    // The "store" param is where will be saved the variable keeping track if a
    // change is in curse.
    // Accepts an extraFunc to be run when the lock is released.
    safeTriggerChange: function(name, value, store=this, autoUpdate=true, extraFunc) {
        // Name of the var (lock) that will record if is waiting or not
        let varW = name + 'Waiting'
        // If is not waiting
        if (!store[varW]) {
            let signalW = riot.SEC(varW)
            // The function that should realse the lock
            let release = data => {
                // console.log('data:', data, 'value:', value)
                // This checks if the returning signal corresponds to
                // this function call
                if (data == value) {
                    store[varW] = false
                    // Unwatch
                    riot.control.off(signalW, release)
                    if(extraFunc) extraFunc()
                    if (autoUpdate) this.update()
                }
            }
            // Define the watcher to realese the lock
            this.onControl(signalW, release)
            // Lock
            store[varW] = true
            // Request the change itself
            this.triggerChange(name, value)
        }
    },
}

riot.mixin('base', BaseMixin)
