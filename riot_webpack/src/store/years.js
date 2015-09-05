import config from '../config.js'
import ajax from '../utils/ajax.js'

const LOCALSTORAGE_KEY = 'years'

class Years {
    constructor() {
        riot.observable(this)

        let json = window.localStorage.getItem(LOCALSTORAGE_KEY)
        if (!json) {
            this.initData()
        } else {
            this._years = (json && JSON.parse(json)) || []
        }
        this._current_year = new Date().getFullYear()
    }

    initData() {
        this._years = []
        this.saveToStorage()
    }

    saveToStorage() {
        window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this._years))
    }

    // setAll(years) {
    //     this._years = years
    // }
}


let instance = new Years()

instance.on(riot.VE.LOAD_YEARS, () => {
    let url = config.apiurl_money + '/execucao/info'
    ajax(url, 'get').then((response) => {
        instance._years = response.data.years
        instance.trigger(riot.SE.YEARS_CHANGED, instance._years)
    })
})

instance.on(riot.VE.CHANGE_YEAR, (year) => {
    instance._current_year = year
})

// instance.on(riot.VE.RESET_DATA, () => {
//   instance.initData()
//   instance.trigger(riot.SE.POSTS_CHANGED, instance._posts)
// })

// instance.on(riot.VE.LIKE_POST, id => {
//   instance._posts.forEach(p => {
//     if (p.postId == id) {
//       p.likes = p.likes + 1
//     }
//   })
//   instance.saveToStorage()
//   instance.trigger(riot.SE.POSTS_CHANGED, instance._posts)
// })

// register to riot control by myself
riot.control.addStore(instance)
export default instance
