import {strFormat} from '../utils/helpers'
import router from '../store/router'


class Translator {
    constructor() {
        this.dicts = {}

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
            'reply': 'comentar',
            'login_form_use_reset_code': 'Por favor verifique seu e-mail, você deve ter recebido um código para ser usado no formulário abaixo. Você tem {minutes} minutos para usá-lo.'
        }

        this.dicts.en = {
            '_lang': 'English',
            'login_form_use_reset_code': 'Please check your email for the reset code and use it in the form below. You have {minutes} minutes to use it.'
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
        }
    }

    translate(str, params) {
        let translated = this.dicts[this._currentLang][str]
        translated = translated ? translated : str
        if (params) translated = strFormat(translated, params)
        return translated
    }
}

let translator = new Translator()
translator.init()

export default translator
