import config from './config.js'

// import years from './store/years'
import comments from './store/comments'
import auth from './store/auth'
import userinfo from './store/userinfo'
// import yearinfo from './store/yearinfo'
// import pointinfo from './store/pointinfo'
// import points from './store/points'
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


class PointInfo extends MapStore {
    ajaxParams(key) {
        let api = config.apiurl_money,
            url = `${api}/execucao/list?code=${key}`,
            method = 'get'
        return {url, method}
    }
    processResponse(response) {
        return response.json.data[0]
    }
}
let pointinfo = new PointInfo('pointinfo')


class Points extends MapStore {
    ajaxParams(key) {
        let api = config.apiurl_money,
            url = `${api}/execucao/minlist/${key}?state=1&capcor=1`,
            method = 'get'
        return {url, method}
    }
    processResponse(response) {
        return response.json
    }
}
let points = new Points('points')


class YearInfo extends MapStore {
    ajaxParams(key) {
        let api = config.apiurl_money,
            url = `${api}/execucao/info/${key}`,
            method = 'get'
        return {url, method}
    }
    processResponse(response) {
        return response.json.data
    }
}
let yearinfo = new YearInfo('yearinfo')


class TableData extends MapStore {
    ajaxParams(key) {
        let [ year, page ] = key.split('-'),
            api = config.apiurl_money,
            url = `${api}/execucao/list?year=${year}&page=${page}&per_page_num=25`,
            method = 'get'
        return {url, method}
    }
    processResponse(response) {
        this.totalRows = response.meta.headers.get('X-Total-Count')
        return response.json.data
    }
    getTotal() { return this.totalRows }
}
let tabledata = new TableData('tabledata')


class Years extends MapStore {
    ajaxParams(key) {
        let api = config.apiurl_money,
            url = `${api}/execucao/info`,
            method = 'get'
        return {url, method}
    }
    processResponse(response) {
        return response.json.data.years
    }
}
let years = new Years('years')
years.forceKey = 'years'

export default {tabledata}
