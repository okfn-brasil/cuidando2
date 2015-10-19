import config from 'config'

import auth from './store/auth'
import comments from './store/comments'
import pedidos from './store/pedidos'
import pointinfo from './store/pointinfo'
import userinfo from './store/userinfo'
import router from './store/router'
import MapStore from './store/mapStore'

// const stores_list = { years, year, points }

// class Stores {
//     // get years () {return years.get()}
//     // get year () {return year.get()}
//     // get points () {return points.get()}
// }

// let stores = new Stores()

// Proxy version of the above code. Currently only for FF...
// let handler = {get: (target, name) => {
//     return target[name].get()
// }}
// let stores = new Proxy(stores_list, handler)


let moneyApi = config.apiurl_money
let commentsApi = config.apiurl_comments
let esicApi = config.apiurl_esic


// Store for list of points for map
class Points extends MapStore {
    ajaxParams(key) {
        let url = `${moneyApi}/execucao/minlist/${key}?state=1&capcor=1`,
            method = 'get'
        return {url, method}
    }
}
let points = new Points('points')


// Store for general data about an year
class YearInfo extends MapStore {
    ajaxParams(key) {
        let url = `${moneyApi}/execucao/info/${key}`,
            method = 'get'
        return {url, method}
    }
    processResponse(json) {
        return json.data
    }
}
let yearinfo = new YearInfo('yearinfo')


// Store for dynamic table
class TableData extends MapStore {
    ajaxParams(key) {
        let [ year, page ] = key.split('-'),
            url = `${moneyApi}/execucao/list?year=${year}&page=${page}&per_page_num=25`,
            method = 'get',
            raw = true
        return {url, method, raw}
    }
    async processResponse(response) {
        let json = await response.json()
        this.totalRows = response.headers.get('X-Total-Count')
        return json.data
    }
    getTotal() { return this.totalRows }
}
let tabledata = new TableData('tabledata')


// Store for year list
class Years extends MapStore {
    ajaxParams(key) {
        let url = `${moneyApi}/execucao/info`,
            method = 'get'
        return {url, method}
    }
    processResponse(json) {
        return json.data.years.reverse()
    }
}
let years = new Years('years')
years.forceKey = 'years'


// Store for money updates
class MoneyUpdates extends MapStore {
    ajaxParams(key) {
        let url = `${moneyApi}/execucao/updates?per_page_num=20&has_key=state`,
            method = 'get'
        return {url, method}
    }
    processResponse(json) {
        // Substitute strings for Dates
        for (let row of json.data) {
            row.date = new Date(row.date)
        }
        return json.data
    }
}
let moneyUpdates = new MoneyUpdates('moneyUpdates')
moneyUpdates.forceKey = 'moneyUpdates'


// Store for comments updates
class CommentsUpdates extends MapStore {
    ajaxParams(key) {
        let url = `${commentsApi}/comment`,
            method = 'get'
        return {url, method}
    }
    processResponse(json) {
        // Substitute strings for Dates
        for (let comment of json.comments) {
            comment.created = new Date(comment.created)
            comment.modified = new Date(comment.modified)
        }
        return json.comments
    }
}
let commentsUpdates = new CommentsUpdates('commentsUpdates')
commentsUpdates.forceKey = 'commentsUpdates'


// Store for comments updates
class PedidosUpdates extends MapStore {
    ajaxParams(key) {
        let url = `${esicApi}/messages`,
            method = 'get'
        return {url, method}
    }
    processResponse(json) {
        // Substitute strings for Dates
        for (let msg of json.messages) {
            msg.date = new Date(msg.date)
        }
        return json.messages
    }
}
let pedidosUpdates = new PedidosUpdates('pedidosUpdates')
pedidosUpdates.forceKey = 'pedidosUpdates'


// Store for comments updates
class Orgaos extends MapStore {
    ajaxParams(key) {
        let url = `${esicApi}/orgaos`,
            method = 'get'
        return {url, method}
    }
    processResponse(json) {
        return json.orgaos.map((x) => {return {key: x, value: x}})
    }
}
let orgaos = new Orgaos('orgaos')
orgaos.forceKey = 'orgaos'

export default {tabledata}
