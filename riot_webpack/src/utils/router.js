class Router {

    constructor() {
        this._currentView = null

        this._innerRouteMark = '$'
        this._hashMark = '#'
        this._hashParamMark = '/'
        this._queryMark = '?'
        this._queryParamMark = '&'
        this._queryAttrMark = '='

        this._query = ''
        this._oldUrl = ''

        var routes = [{
                format: 'ano/{{year}}',
                params: {
                    page: 0,
                    per_page_num: 25
                },
                parsers: {
                    year: parseInt,
                    page: parseInt,
                    per_page_num: parseInt
                },
            }, {
                format: 'despesa/{{year}}/{{code}}',
                parsers: {
                    year: parseInt,
                }
            }, {
                format: 'pessoa/{{username}}',
            }, {
                format: 'pedido/{{protocolo}}',
            }, {
                format: 'texto/{{text}}',
            }
        ]

        // Change url parser
        riot.route.parser(this.urlAutoParser.bind(this))
        // Change route callback
        riot.route(this.studyRoute.bind(this))
    }

    buildRoute() {
        // let query = this._getQuery()
        let hash = [].slice.apply(arguments).join('/')// + query
        return this._hashMark + hash + this._innerRouteMark
        // return `${this._hashMark}${hash}`
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

    studyRoute(parsed) {
        if (parsed === undefined) {
            this.loadView('year-view')
        }
        else if (!parsed.repeated) {
            riot.control.trigger(riot.VE.CHANGE_URL, parsed)
            switch(parsed.paths[0]) {
                case 'texto':
                    this.loadView('textpage-view', {name: parsed.paths[1]})
                    break
                case 'ano':
                    this.loadView('year-view')
                    break
                case 'detail':
                    this.loadView('detail-view')
                    break
                case 'posts':
                    this.loadView('posts-view')
                    break
                default:
                    this.loadView('year-view')
            }
        }
    }

    urlAutoParser(url) {
        let parsed = {}
        if (url != this._oldUrl) {
            parsed = this.parseUrl(url)
            if (parsed.innerRoute) {
                this._oldUrl = parsed.url
                if (history === undefined) location.hash = parsed.url
                else history.replaceState(null, null, this._hashMark + parsed.url)
            }
            parsed.repeated = false
        } else parsed.repeated = true
        return parsed
    }

    parseUrl(url) {
        // If it is a inner route (made by a 'a' tag)
        let innerRoute = false
        // if (url[0] == this._innerRouteMark) {
        if (url[url.length - 1] == this._innerRouteMark) {
            innerRoute = true
            // Remove inner route mark
            url = url.slice(0, -1)
            // url = url.slice(1)
            // Adds query if exists
            if (this._query) url += this._queryMark + this._query
        }

        let raw = url.split(this._queryMark),
            paths = raw[0].split(this._hashParamMark),
            query = raw[1],
            params = {}

        this._query = query
        if (query) {
            for (let pair in query.split(this._queryParamMark)) {
                pair = pair.split(this._queryAttrMark)
                params[pair[0]] = pair[1]
            }
        }

        return {
            url: url,
            paths: paths,
            params: params,
            innerRoute: innerRoute,
        }
    }

    goDefaultRoute() {
        // Start default view
        riot.route.exec(this.studyRoute.bind(this))
    }
}

let router = new Router()

export default router
