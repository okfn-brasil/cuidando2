import translator from '../utils/translator.js'
import router from '../utils/router.js'
import ajax from '../utils/ajax.js'
import config from '../config.js'

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
}

riot.mixin('base', BaseMixin)
