let routes = [{
    format: 'ano/{year}',
    params: {
        page: 0,
        per_page_num: 25
    },
}, {
    format: 'despesa/{year}/{code}',
}, {
    format: 'pessoa/{username}',
}, {
    format: 'pedido/{protocolo}',
}, {
    format: 'texto/{text}',
}]

let parsers = {
    year: parseInt,
    page: parseInt,
    per_page_num: parseInt
}

let globalParams = {
    lang: 'pt-br',
}

// Checks if a property of two objs is equals
function diff(prop, a, b) {
    return !(a.hasOwnProperty(prop) && (a[prop] == b[prop]))
}


class Router {

    constructor(routes, defaultRoute, defaultParams, parsers, globalParams) {
        riot.observable(this)

        this._currentView = null

        this._innerRouteMark = '$'
        this._hashMark = '#'
        this._hashParamMark = '/'
        this._queryMark = '?'
        this._queryParamMark = '&'
        this._queryAttrMark = '='

        this._query = ''
        this._oldUrl = ''
        this.params = defaultParams
        console.log('params:', this.params)

        this.routes = {}
        // Hash routes by name
        for (let route of routes) {
            let name = route.format.split(this._hashParamMark)[0]
            // Add view name for route
            route.view = `${name}-view`
            route.mainParamsNames = this._getMainParamsNames(route.format)
            this.routes[name] = route
        }
        this._defaultRoute = defaultRoute
        this.parsers = parsers
        this.globalParams = globalParams
        this._allPossibleParamsNames = this._listAllPossibleParamsNames()
        this._registerLoadEvents()

        // Change url parser
        riot.route.parser(this.urlAutoParser.bind(this))
        // Change route callback
        riot.route(this.studyRoute.bind(this))
    }

    init() {
        if(location.hash) {
            this.studyRoute(this.urlAutoParser(location.hash.slice(1)))
        } else {
            this.routeDefault()
        }

    }

    _registerLoadEvents() {
        for (let name of this._allPossibleParamsNames) {
            this.on(riot.VEL(name), () => {
                this.trigger(riot.SEC(name), this.params[name])
            })

            this.on(riot.VEC(name), (value) => {
                this.params[name] = value
                window.location.hash = this._createUrl(this.params)
                console.log('---------', location.hash, '----------')
            })
        }
    }

    // Returns all the possible params names (main params or query)
    _listAllPossibleParamsNames() {
        return new Set(Object.keys(this.routes)
            .map(k => this.routes[k].mainParamsNames)
            .reduce((prev, cur) => prev.concat(cur),
                Object.keys(this.globalParams)))
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

    loadView(viewName) {
        if (this._currentView) {
            this._currentView.unmount(true)
        }
        this._currentView = riot.mount('div#mainview', viewName)[0]
                                       // {aaaaa: "raaaaaa"})[0]
                                       // {data: this.params})[0]
    }

    studyRoute(parsed) {
        if (parsed === undefined) {
            this.loadView(this._defaultRoute)
        }
        else if (!parsed.repeated) {
            // riot.control.trigger(riot.VE.CHANGE_URL, parsed)
            let routeData = this.routes[parsed.params._root]
            console.log(routeData)
            if (routeData) this.loadView(routeData.view)
            else this.loadView(this._defaultRoute)
        }
    }

    urlAutoParser(url) {
        let parsed = {}
        if (url != this._oldUrl) {
            parsed = this.parseUrl(url)
            if (parsed.innerRoute) {
                this._oldUrl = parsed.url
                if (location.hash != parsed.url) {
                    if (history === undefined) location.hash = parsed.url
                    else history.replaceState(null, null, this._hashMark + parsed.url)
                    console.log('---------', location.hash, '----------')
                }
            }
            parsed.repeated = false

            this._updateParams(parsed.params)
            console.log('after-update-params:', this.params)

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
            params = this._mainParamsToObj(paths)

        this._query = query
        if (query) {
            for (let pair in query.split(this._queryParamMark)) {
                pair = pair.split(this._queryAttrMark)
                params[pair[0]] = pair[1]
            }
        }

        return {
            url: this._createUrl(params),
            params: params,
            innerRoute: innerRoute,
        }
    }

    getParam(name) {
        console.log('getParams-name:', name, 'params:', this.params)
        let val = this.params[name]
        if (val) return val
        // val = this.
        // if () return this.param
        return 'TODO: aaaaaaaaaaaaaaa'
    }

    // Start default view
    routeDefault() {
        this.route(this._defaultRoute)
    }

    _getMainParamsNames(template) {
        let match = template.replace(/\?.*/).match(/{([^}]*)}/g);
        return match.map((param) => {
            return param.substring(1, param.length - 1)
        })
    }

    _mainParamsToObj(mainParamsValues) {
        let _root = mainParamsValues.shift(),
            names = this.routes[_root].mainParamsNames,
            obj = {_root}
        for (let i in mainParamsValues) {
            obj[names[i]] = mainParamsValues[i]
        }
        return obj
    }

    // Possibilities:
    // 'root id1 id2' {id3=id3, q1=q1}
    // {root=root, id1=id1}
    // {id2=id2}
    route(param1, params2) {
        let roots = null,
            root = null,
            params = {}

        // If the param1 is a string of route parts repared with ' '
        if (param1 && typeof param1 === 'string') {
            roots = param1.split(' ')
            // TODO: take care of other roots
            params = this._mainParamsToObj(roots)
            if (params2) Object.assign(params, params2)
        } else {
            // param1 is an Obj, there is no param2
            params = param1
        }

        window.location.hash = this._createUrl(params)
        console.log('---------', location.hash, '----------')
    }

    _updateParams(newParams) {
        let diffs = []
        // Replace with new parameters
        for (let name in newParams) {
            // Keep track of changed params
            if (diff(name, this.params, newParams)) diffs.push(name)
            this.params[name] = newParams[name]
        }
        this._broadcastParams(diffs)
        return diffs
    }

    _broadcastParams(names) {
        // Broadcast params that changed
        for (let name of names) {
            riot.control.trigger(riot.SEC(name),
                                 this.params[name])
            console.log("router-broadcast", name)
        }
    }

    _createUrl(params) {
        let rootData = this.routes[params._root],
            url = rootData.format
        // Replace main params to str
        let mainParams = Object.assign({}, this.params, params)
        for (let name of rootData.mainParamsNames) {
            url = url.replace('{' + name + '}', mainParams[name])
        }
        // Add query params if needed
        let nonDefault = [],
            defaultParams = Object.assign({}, this.globalParams, rootData.params),
            queryParams = Object.assign({}, defaultParams, params)
        for (let name in defaultParams) {
            if (queryParams[name] != defaultParams[name])
                nonDefault.push(name + this._queryAttrMark + params[name])
        }
        if (nonDefault.length) {
            url += this._queryMark + nonDefault.join(this._queryParamMark)
        }
        return url
    }
}

let instance = new Router(routes, 'ano',
                          {year: new Date().getFullYear().toString()},
                          parsers, globalParams)
riot.control.addStore(instance)
export default instance
