let routes = [{
    format: 'ano/{year}',
    // params: {
    //     page: 0,
    //     per_page_num: 25
    // },
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

let defaultParams = {
    _root: 'ano',
    year: new Date().getFullYear().toString(),
    lang: 'pt-br',
    page: 0,
    per_page_num: 25
}


class Router {

    constructor(routes, defaultParams, parsers) {
        riot.observable(this)

        this._currentView = {}

        this._innerRouteMark = '$'
        this._hashMark = '#'
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
        if (location.hash.slice(1) != this._currentUrl) {
            this._urlToParams()
            this._paramsToUrl()
        }
    }

    _getMainParamsNames(template) {
        let match = template.replace(/\?.*/).match(/{([^}]*)}/g);
        return match.map((param) => {
            return param.substring(1, param.length - 1)
        })
    }

    _registerViewEvents() {
        for (let name of this._allPossibleParamsNames) {
            // Accepts loads like the other stores, even if
            // params could be accessed by getParam
            this.on(riot.VEL(name), () => {
                this.trigger(riot.SEC(name), this.getParam(name))
            })

            this.on(riot.VEC(name), (value) => {
                // console.log('router:VEC name:', name, 'value:', value)
                this.params[name] = value
                this._paramsToUrl()
            })
        }
    }

    // Returns all the possible params names (main params or query)
    _listAllPossibleParamsNames() {
        return new Set(Object.keys(this.routes)
            .map(k => this.routes[k].mainParamsNames)
            .reduce((prev, cur) => prev.concat(cur),
                Object.keys(this.defaultParams)))
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

    buildRoute() {
        let hash = [].slice.apply(arguments).join('/')// + query
        return this._hashMark + hash + this._innerRouteMark
    }

    loadView(viewName) {
        if (this._currentView.root) {
            this._currentView.root.unmount(true)
        }
        this._currentView = {
            name: viewName,
            root: riot.mount('div#mainview', viewName, this.params)[0],
        }
    }

    getParam(name) {
        // console.log('getParams-name:', name, 'params:', this.params, 'this', this)
        return this.params[name]
        // let val = this.params[name]
        // if (!val) val = this.routes[this.params._root].params[name]
        // if (!val) val = this.globalParams[name]
        // return val
    }

    _urlToParams() {
        // TODO: Quando não acha a rota está indo para default,
        // será que não deveria mostrar 404?

        let hash = location.hash.slice(1),
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

        return params
    }

    _paramsToUrl() {
        // console.log('router:paramsToUrl')

        // Loads new view if different from current
        let newViewName = this.routes[this.params._root].view
        if (newViewName != this._currentView.name)
            this.loadView(newViewName)

        this._broadcastParams()

        // Changes the urlif different from current
        this._currentUrl = this._createUrl()
        if (location.hash.slice(1) != this._currentUrl)
            location.hash = this._currentUrl
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
            params = this._mainParamsToObj(roots)
            if (params2) Object.assign(params, params2)
        } else {
            // param1 is an Obj, there is no param2
            params = param1
        }

        // Update params
        for (let name in params)
            this.params[name] = params[name]

        this._paramsToUrl()
    }

    // Start default view
    routeDefault() {
        this.route(this._defaultRoute)
    }

    _createUrl() {
        let rootData = this.routes[this.params._root],
            url = rootData.format
        // Replace main params to str
        for (let name of rootData.mainParamsNames) {
            url = url.replace('{' + name + '}', this.params[name])
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
