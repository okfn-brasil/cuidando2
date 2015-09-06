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
    console.log(prop, a, b)
    console.log(a.hasOwnProperty(prop))
    console.log(!(a.hasOwnProperty(prop) && (a[prop] == b[prop])))
    return !(a.hasOwnProperty(prop) && (a[prop] == b[prop]))
}


class Router {

    constructor(routes, parsers, globalParams) {
        this._currentView = null

        this._innerRouteMark = '$'
        this._hashMark = '#'
        this._hashParamMark = '/'
        this._queryMark = '?'
        this._queryParamMark = '&'
        this._queryAttrMark = '='

        this._query = ''
        this._oldUrl = ''
        this.params = {}

        this.routes = {}
        // Hash routes by name
        for (let route of routes) {
            let name = route.format.split(this._hashParamMark)[0]
            this.routes[name] = route
        }

        this.parsers = parsers
        this.globalParams = globalParams

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

    getParam(name) {
        return this.params[name]
    }

    goDefaultRoute() {
        // Start default view
        riot.route.exec(this.studyRoute.bind(this))
    }

    _getMainParamsNames(template) {
        let match = template.replace(/\?.*/).match(/{([^}]*)}/g);
        return match.map((param) => {
            return param.substring(1, param.length - 1)
        })
    }

    // Possibilities:
    // 'root id1 id2' {id3=id3, q1=q1}
    // {root=root, id1=id1}
    // {id2=id2}
    route(param1, params2) {
        let roots = null,
            root = null,
            params = null

        // If the param1 is a string of route parts repared with ' '
        if (param1 && typeof param1 === 'string') {
            roots = param1.split(' ')
            // TODO: take care of other roots
            root = roots[0]
            params = params2
            params._root = root
        } else {
            // param1 is an Obj, there is no param2
            params = param1
        }

        let diffs = this._updateParams(params)
        this._broadcastParams(diffs)

        window.location.hash = this._createUrl(params)
        console.log(this._createUrl(params))
    }

    _updateParams(newParams) {
        let diffs = []
        // Replace with new parameters
        for (let name in newParams) {
            // Keep track of changed params
            if (diff(name, this.params, newParams)) diffs.push(name)
            this.params[name] = newParams[name]
        }
        return diffs
    }

    _broadcastParams(names) {
        // Broadcast params that changed
        for (let name of names) {
            let signal = `change_${name}`
            riot.control.trigger(riot.VE[signal.toUpperCase()],
                                 this.params[name])
            console.log(name)
        }
    }

    _createUrl(params) {
        let rootData = this.routes[params._root],
            url = rootData.format
        // Replace main params to str
        for (let name of this._getMainParamsNames(rootData.format)) {
            url = url.replace('{' + name + '}', this.params[name])
        }
        // Add query params if needed
        let nonDefault = [],
            defaultParams = Object.assign({}, this.globalParams, rootData.params),
            queryParams = Object.assign({}, defaultParams, params)
        for (let name in defaultParams) {
            if (queryParams[name] != defaultParams[name])
                nonDefault.push(name + this._queryAttrMark + params[name])
            console.log(name, params, defaultParams)
        }
        if (nonDefault.length) {
            url += this._queryMark + nonDefault.join(this._queryParamMark)
        }
        return url
    }

}

let router = new Router(routes, parsers, globalParams)

export default router
