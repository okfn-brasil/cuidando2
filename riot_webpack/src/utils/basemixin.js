import translator from '../utils/translator'
import router from '../utils/router'
import ajax from '../utils/ajax'
import config from '../config'
import stores from '../stores'

var BaseMixin = {
    init: function() {
    },

    t: function() {
        return translator.translate(...arguments)
    },

    route: function() {
        return router.buildRoute(...arguments)
    },

    config: config,
    ajax: ajax,
    s: stores,

    watch: function(names) {
        names = names.split(' ')
        for (let name of names) {
            let signal = `${name}_changed`
            console.log(signal, riot.SE[signal.toUpperCase()], riot.SE)
            riot.control.on(riot.SE[signal.toUpperCase()], val => {
                this.update()
            })
        }
    }

}

riot.mixin('base', BaseMixin)
