let _RiotControlApi = ['on','one','off','trigger']
let RiotControl = {
    _stores: [],
    addStore(store) {
        this._stores.push(store)
    }
}
_RiotControlApi.forEach(api => {
    RiotControl[api] = function() {
        let args = [].slice.call(arguments)
        this._stores.forEach(el => el[api].apply(null, args))
    }
})

// since riot is auto loaded by ProvidePlugin, merge the control into the riot object
riot.control = RiotControl

// store event change
riot.SEC = function(name) {
    return `se_${name}_changed`
}
// Signal to var name
riot.SECtoVar = function(signal) {
    return signal.split('_')[1]
}

// view event change
riot.VEC = function(name) {
    return `ve_change_${name}`
}
// view event load
riot.VEL = function(name) {
    return `ve_load_${name}`
}
// // store events
// riot.SE = {
//     YEARS_CHANGED: 'se_years_changed',
//     POINTS_CHANGED: 'se_poins_changed',
// }
// // view events
// riot.VE = {
//     LOAD_YEARS: 've_load_years',
//     LOAD_POINTS: 've_load_points',
// }
