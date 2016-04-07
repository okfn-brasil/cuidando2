let routes = [{
    format: 'home',
}, {
    format: 'ano/{year}',
    // params: {
    //     page: 0,
    //     per_page_num: 25
    // },
}, {
    format: 'despesa/{year}/{code}',
}, {
    format: 'pessoa/{user}',
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

let defaultParams = {
    _root: 'home',
    // year: new Date().getFullYear().toString(),
    year: '2016',
    lang: 'pt-br',
    page: 0,
    per_page_num: 25
}


// window.onpopstate = function(e) {
//     console.log(e)
// }


class Router {

    constructor(routes, defaultParams, parsers) {
        riot.observable(this)

        this._currentView = {}

        this._innerRouteMark = '$'
        this._hashMark = '?/'
        this._hashParamMark = '/'
        this._queryMark = '?'
        this._queryParamMark = '&'
        this._queryAttrMark = '='

        this.params = defaultParams
        this.defaultParams = defaultParams
        this._oldParams = {}
        // console.log('params:', this.params)

        this.routes = {}
        // Hash routes by name
        for (let route of routes) {
            let name = route.format.split(this._hashParamMark)[0]
            // Add view name for route
            route.view = `${name}-view`
            route.mainParamsNames = this._getMainParamsNames(route.format)
            this.routes[name] = route
        }
        this.parsers = parsers
        this._allPossibleParamsNames = this._listAllPossibleParamsNames()
        this._allPossibleQueryParamsNames = this._listAllPossibleQueryParamsNames()
        this._registerViewEvents()

        // // Change url parser
        // riot.route.parser(this.urlAutoParser.bind(this))

        // Change route callback
        riot.route(this._urlChanged.bind(this))

        // Init params
        this._urlToParams()
        // this.urlAutoParser(location.hash.slice(1))
    }

    init() {
        this._paramsToUrl()
    }

    _urlChanged() {
        // Riot says url changed, make sure
        if (location.search.slice(this._hashMark.length) != this._currentUrl) {
            this._urlToParams()
            this._paramsToUrl()
        }
    }

    _getMainParamsNames(template) {
        let match = template.replace(/\?.*/).match(/{([^}]*)}/g);
        if (!match) match = []
        return match.map((param) => {
            return param.substring(1, param.length - 1)
        })
    }

    _applyParser(name, value) {
        let parser = this.parsers[name]
        return parser ? parser(value) : value
    }

    _registerViewEvents() {
        for (let name of this._allPossibleParamsNames) {
            // console.log('router: register for VEC:', name)

            // Accepts loads like the other stores, even if
            // params could be accessed by getParam
            this.on(riot.VEL(name), () => {
                this.trigger(riot.SEC(name), this.getParam(name))
            })

            this.on(riot.VEC(name), (value) => {
                // console.log('router:VEC name:', name, 'value:', value)
                this.params[name] = this._applyParser(name, value)
                this._paramsToUrl()
            })
        }
    }

    // Returns all the possible params names (main params or query)
    _listAllPossibleParamsNames() {
        return Object.keys(this.routes)
            .map(k => this.routes[k].mainParamsNames)
            .reduce((prev, cur) => prev.concat(cur),
                    Object.keys(this.defaultParams))
            .filter((item, pos, self) =>
                    self.indexOf(item) == pos)
    }

    // Returns all the possible query params names
    _listAllPossibleQueryParamsNames() {
        let mainParamsNames = Object.keys(this.routes)
            .reduce(
                (prev, k) => prev.concat(this.routes[k].mainParamsNames),
                ['_root']
            )
        return Object.keys(this.defaultParams)
            .filter((el) => mainParamsNames.indexOf(el) == -1)
    }

    // buildRoute() {
    //     let hash = [].slice.apply(arguments).join('/')// + query
    //     return this._hashMark + hash + this._innerRouteMark
    // }

    loadView(viewName) {
        let root = this._currentView.root
        if (root) {
            if (root.preunmount) root.preunmount()
            root.unmount(true)
        }
        this._currentView = {
            name: viewName,
            root: riot.mount('div#mainview', viewName, this.params)[0],
        }
    }

    getParam(name) {
        // console.log('getParams-name:', name, 'params:', this.params, 'this', this)
        return this.params[name]
    }

    getDefaultParam(name) {
        return this.defaultParams[name]
    }

    _urlToParams() {
        // TODO: Quando não acha a rota está indo para default,
        // será que não deveria mostrar 404?

        let hash = location.search.slice(this._hashMark.length),
            params = {_root: this.defaultParams._root}

        if (hash) {
            params = this.parseHash(hash)
        }

        let rootData = this.routes[this.params._root]

        // Get defaults + parsed
        this.params = Object.assign({}, this.defaultParams,
                                    rootData.params, params)
    }

    // Parse the params present in a hash
    parseHash(hash) {
        let raw = hash.split(this._queryMark),
            paths = raw[0].split(this._hashParamMark),
            query = raw[1],
            params = this._mainParamsToObj(paths)


        if (query) {
            for (let pair of query.split(this._queryParamMark)) {
                pair = pair.split(this._queryAttrMark)
                params[pair[0]] = pair[1]
            }
        }
        // console.log('router:parseHash - hash:', hash, 'params:', params)
        for (let name in params) {
            params[name] = this._applyParser(name, params[name])
        }

        return params
    }

    _paramsToUrl() {
        // console.log('router:paramsToUrl')
        // Loads new view if different from current
        let newViewName = this.routes[this.params._root].view
        if (newViewName != this._currentView.name)
            this.loadView(newViewName)

        this._broadcastParams()

        // Changes the url if different from current
        this._currentUrl = this._createUrl()
        if (location.search.slice(this._hashMark.length) != this._currentUrl)
            window.history.pushState(null, null, this._hashMark + this._currentUrl)
            // location.search = this._currentUrl
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
    processRouteParams(param1, params2) {
        let roots = null,
            root = null,
            params = {}

        // If the param1 is a string of route parts separed with ' '
        if (param1 && typeof param1 === 'string') {
            roots = param1.split(' ')
            params = this._mainParamsToObj(roots)
            if (params2) Object.assign(params, params2)
        } else {
            // param1 is an Obj, there is no param2
            params = param1
        }

        // Apply parsers
        for (let name in params)
            params[name] = this._applyParser(name, params[name])

        return params
    }

    route(param1, params2) {
        let params = this.processRouteParams(param1, params2)

        // Update params
        for (let name in params)
            this.params[name] = params[name]

        this._paramsToUrl()
    }

    textRoute(param1, params2) {
        let params = this.processRouteParams(param1, params2)
        return this._hashMark + this._createUrl(params)
    }

    // Start default view
    routeDefault() {
        this.route(this._defaultRoute)
    }

    _createUrl(params=this.params) {
        let rootData = this.routes[params._root],
            url = rootData.format
        // Replace main params to str
        for (let name of rootData.mainParamsNames) {
            if (!params[name]) params[name] = this.params[name]
            url = url.replace('{' + name + '}', params[name])
        }
        // Add query params if needed
        let nonDefault = []
        for (let name of this._allPossibleQueryParamsNames) {
            if (this.params[name] != this.defaultParams[name])
                nonDefault.push(name + this._queryAttrMark + this.params[name])
        }
        if (nonDefault.length) {
            url += this._queryMark + nonDefault.join(this._queryParamMark)
        }
        return url
    }

    _broadcastParams() {
        // Detect params changes
        let diff = []
        for (let name in this.params) {
            if (this._oldParams[name] != this.params[name]) {
                this._oldParams[name] = this.params[name]
                diff.push(name)
            }
        }

        // Broadcast params that changed
        for (let name of diff) {
            // console.log("router:broadcast:", name)
            this.trigger(riot.SEC(name), this.params[name])
        }
    }
}

let instance = new Router(routes, defaultParams, parsers)
riot.control.addStore(instance)
export default instance
