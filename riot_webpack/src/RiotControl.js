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
}
// view events
riot.VE = {
    // RESET_DATA: 've_reset_data',
    // LIKE_POST: 've_like_post',
    LOAD_YEARS: 've_load_years',
    CHANGE_YEAR: 've_change_year',
}
