import {strFormat} from '../utils/helpers'
import router from '../store/router'


class Translator {
    constructor() {
        this.dicts = {}

        // this._currentLang = this.getCurrentLang()
        this._currentLang = router.getParam('lang')
        // console.log('translator: initial lang:', this._currentLang)
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
            'Not mapped': 'Não mapeadas',
            'Mapped': 'Mapeadas',
            'Comment': 'Comentário',
            'Report': 'Denunciar',
            'Question': 'Pergunta',
            'body': 'órgão',
            'first': 'primeira',
            'last': 'última',
            'No user description...': 'Sem descrição de usuário...',
            'Username': 'Nome de usuária',
            ' cannot be empty...': ' não pode estar vazio...',
            'Different passwords': 'Senhas não batem',
            'Password': 'Senha',
            'or': 'ou',
            'comments': 'comentários',
            'Expense': 'Despesa',
            'Explore the data': 'Explore os dados agora',
            'Accountable body': 'Órgão responsável',
            'back to year': 'voltar para o ano',
            'Download table': 'Baixar tabela',
            'questions': 'perguntas',
            'Forgot password': 'Esqueceu senha',
            'Login Facebook': 'Entrar via Facebook',
            'Code': 'Código',
            'Request reset code': 'Solicitar código',
            'Change password and login': 'Alterar senha e entrar',
            'Confirm Password': 'Confirmar Senha',
            'description': 'descrição',
            'Make a question': 'Quero perguntar',
            'Search for an address': 'Procure pelo bairro ou endereço',
            'Reply Comment': 'Responder comentário',
            'Comment removed.': 'Comentário removido.',
            'Edit comment': 'Editar comentário',
            'error_decode_token': 'Erro ao decodificar token. Por favor entre novamente.',
            'See the comments about this expense': 'Acompanhe os comentários sobre essa despesa',
            'Your comment': 'Seu comentário',
            'data updated at': 'dados atualizados em',
            'Map legend': 'Legenda do mapa',
            'Send comment': 'Enviar comentário',
            'login_form_use_reset_code': 'Por favor verifique seu e-mail, você deve ter recebido um código para ser usado no formulário abaixo. Você tem {minutes} minutos para usá-lo.',
            'local_storage_not_supported': 'Seu navegador parece não suportar localStorage. Por favor use um mais recente, ou você não conseguirá autenticar nesse site...',
            'User not found': 'Usuária não encontrada',
            'Invalid email': 'E-mail inválido',
            'Invalid username. Needs at least 5 characters.': 'Nome inválido. Precisa de pelo menos 5 caracteres.',
            'Wrong password...': 'Senha errada...',
            'Invalid characters in username...': 'Caracteres inválidos no nome...',
            'Username seems not registered...': 'O nome de usuária parece não registrado...',
        }

        this.dicts.en = {
            '_lang': 'English',
            'login_form_use_reset_code': 'Please check your email for the reset code and use it in the form below. You have {minutes} minutes to use it.',
            'planejado': 'planned',
            'empenhado': 'committed',
            'liquidado': 'finished',
            'error_decode_token': "Error to decode stored token! Please relogin...",
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
