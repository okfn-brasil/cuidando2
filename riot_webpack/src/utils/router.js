class Router {

    constructor() {
        this._currentView = null
        this._prefix = '#'

        // Change route callback
        riot.route(this.studyRoute.bind(this))
    }

    buildRoute() {
        let query = this._getQuery()
        let hash = [].slice.apply(arguments).join('/') + query
        return this._prefix + hash
        // return `${this._prefix}${hash}`
    }

    _getQuery() {
        var match = window.location.href.match(/\?.+/)
        return match ? match[0].replace(/#.*/, '') : ''
    }

    loadView(viewName, id) {
        if (this._currentView) {
            this._currentView.unmount(true)
        }
        this._currentView = riot.mountTo('div#mainview', viewName, {data: id})[0]
    }

    studyRoute(view, id) {
        switch(view) {
        case 'texto':
            this.loadView('textpage-view', {name: id})
            break
        case 'ano':
            this.loadView('year-view')
            break
        case 'detail':
            this.loadView('detail-view', id)
            break
        case 'posts':
            this.loadView('posts-view')
            break
        default:
            this.loadView('year-view')
        }
    }

    goDefaultRoute() {
        // Start default view
        riot.route.exec(this.studyRoute.bind(this))
    }
}

let router = new Router()

export default router
