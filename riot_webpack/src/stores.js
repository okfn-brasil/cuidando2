import years from './store/years'
import year from './store/year'
import points from './store/points'

const stores_list = { years, year, points }

class Stores {
    get years () {return years.get()}
    get year () {return year.get()}
    get points () {return points.get()}
}

let stores = new Stores()

// Proxy version of the above code. Currently only for FF...
// let handler = {get: (target, name) => {
//     return target[name].get()
// }}
// let stores = new Proxy(stores_list, handler)

export default stores
