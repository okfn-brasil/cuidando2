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
// store events
riot.SE = {
    YEARS_CHANGED: 'se_years_changed',
    YEAR_CHANGED: 'se_year_changed',
    POINTS_CHANGED: 'se_poins_changed',
}
// view events
riot.VE = {
    LOAD_YEARS: 've_load_years',
    CHANGE_YEAR: 've_change_year',
    LOAD_POINTS: 've_load_points',
}
