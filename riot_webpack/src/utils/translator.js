import router from '../store/router'


class Translator {
    constructor() {
        this.dicts = {}

        riot.control.on(riot.SEC('lang'), (lang) => {
            this.setLang(lang)
        })
        // this._currentLang = this.getCurrentLang()
        this._currentLang = router.getParam('lang')
        console.log('translator: initial lang:', this._currentLang)
    }

    init() {
        this.dicts['pt-br'] = {
            '_lang': 'Português',
            'Share': 'Compartilhar',
            'Logout': 'Sair',
            'About': 'Sobre',
            'Another': 'Outra',
            'Login': 'Entrar',
            'Register': 'Registrar',
            'Locate': 'Localizar',
            'Year': 'Ano',
        }

        this.dicts.en = {
            '_lang': 'English',
        }
    }

    getCurrentLang() {
        return this._currentLang
    }

    getLangs() {
        return Object.keys(this.dicts).map(k => {
            return {code: k, name: this.dicts[k]._lang}
        })
    }

    setLang(lang) {
        if(this._currentLang != lang) {
            this._currentLang = lang
            riot.update()
        }
    }

    translate(str) {
        console.log(`translator:translate: ${str} using:`, this._currentLang)
        let translated = this.dicts[this._currentLang][str]
        console.log(`resulted: ${translated}`)
        return translated ? translated : str
    }
}

let translator = new Translator()
translator.init()

export default translator
