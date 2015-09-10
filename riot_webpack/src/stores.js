import config from './config.js'

import years from './store/years'
// import yearinfo from './store/yearinfo'
// import pointinfo from './store/pointinfo'
// import points from './store/points'
import router from './store/router'
import mapStore from './store/mapStore'

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


// Pointinfo Store
new mapStore(
    'pointinfo',
    // Ajax Params
    (key) => {
        let api = config.apiurl_money,
            url = `${api}/execucao/list?code=${key}`,
            method = 'get'
        return {url, method}
    },
    // Process Response
    (response) => {
        return response.data[0]
    }
)

// Points Store
new mapStore(
    'points',
    // Ajax Params
    (key) => {
        let api = config.apiurl_money,
            url = `${api}/execucao/minlist/${key}?state=1&capcor=1`,
            method = 'get'
        return {url, method}
    },
    // Process Response
    (response) => {
        return response
    }
)

// Yearinfo Store
new mapStore(
    'yearinfo',
    // Ajax Params
    (key) => {
        let api = config.apiurl_money,
            url = `${api}/execucao/info/${key}`,
            method = 'get'
        return {url, method}
    },
    // Process Response
    (response) => {
        return response.data
    }
)

// export default stores
