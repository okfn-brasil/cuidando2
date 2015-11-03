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
            'Date': 'Data',
            'State': 'Estado',
            'source': 'fonte',
            'hide': 'esconder',
            'edit': 'editar',
            'Delete': 'Deletar',
            'Cancel': 'Cancelar',
            'Message': 'Mensagem',
            'Responsible': 'Responsável',
            'Username': 'Nome de usuário',
            ' cannot be empty...': ' não pode estar vazio...',
            'Different passwords': 'Senhas não batem',
            'Password': 'Senha',
            'or': 'ou',
            'Send': 'Enviar',
            'error_renew_token': 'Erro ao tentar renovar token',
            'Question sent': 'Pergunta enviada',
            'address_not_found': 'Endereço não encontrado...',
            'comments': 'comentários',
            'Expense': 'Despesa',
            'Wrong email.': 'E-mail errado.',
            'Invalid code': 'Código inválido',
            'Explore the data': 'Explore os dados agora',
            'Accountable body': 'Órgão responsável',
            'back to year': 'voltar para o ano',
            'Download table': 'Baixar tabela',
            'questions': 'perguntas',
            'Forgot password': 'Esqueceu senha',
            'Login Facebook': 'Entrar via Facebook',
            'Code': 'Código',
            'Current password': 'Senha atual',
            'New password': 'Nova senha',
            'Confirm new password': 'Confime a nova senha',
            'want_to_question?': 'Quer perguntar para o governo sobre essa despesa?',
            'Save': 'Salvar',
            'Description': 'Descrição',
            'Request reset code': 'Solicitar código',
            'Change password and login': 'Alterar senha e entrar',
            'Confirm Password': 'Confirmar Senha',
            'description': 'descrição',
            'Recent Activities': 'Atividades Recentes',
            'Make a question': 'Quero perguntar',
            'Search for an address': 'Procure pelo bairro ou endereço',
            'Reply Comment': 'Responder comentário',
            'Comment removed.': 'Comentário removido.',
            'Edit comment': 'Editar comentário',
            'Remaining characters': 'Caracteres restantes',
            'error_decode_token': 'Erro ao decodificar token. Por favor entre novamente.',
            'error_token_json': 'Erro na resposta com token.',
            'See the comments about this expense': 'Acompanhe os comentários sobre essa despesa',
            'No user description...': 'Essa pessoa ainda não colocou uma descrição...',
            'Your comment': 'Seu comentário',
            'private_data': 'Essas são suas informações pessoais, visíveis apenas para você',
            'Report comment as inappropriate': 'Denunciar comentário como inapropriado',
            'data updated at': 'dados atualizados em',
            'Map legend': 'Legenda do mapa',
            'Error to access URL': 'Erro ao tentar acessar URL',
            'Send comment': 'Enviar comentário',
            'error_logout_server': 'Erro ao tentar deslogar no servidor...',
            'login_form_use_reset_code': 'Por favor verifique seu e-mail, você deve ter recebido um código para ser usado no formulário abaixo. Você tem {minutes} minutos para usá-lo.',
            'local_storage_not_supported': 'Seu navegador parece não suportar localStorage. Por favor use um mais recente, ou você não conseguirá autenticar nesse site...',
            'User not found': 'Usuário não encontrado',
            'Invalid email': 'E-mail inválido',
            'Invalid username size. Must be between 5 and 20 characters.': 'Tamanho de nome inválido. Precisa estar entre 5 e 20 caracteres.',
            'Wrong password...': 'Senha errada...',
            'Invalid characters in username...': 'Caracteres inválidos no nome...',
            'Username seems not registered...': 'O nome de usuário parece não registrado...',
            'Error to create user. Maybe username is already registered...': 'Erro ao criar usuário. Talvez esse nome já esteja registrado...',
            'error_get_url_facebook': 'Erro ao tentar pegar URL para login em Facebook',
            'error_complete_login_facebook': 'Erro ao tentar completar login em Facebook',
            'error_send_question': 'Erro ao tentar enviar pergunta',
            'error_multipoint_ajax': 'Erro ao tentar pegar informações sobre vários pontos',
            'error_mapstore_ajax': 'Erro ao tentar pegar dados',
            'Comment reported': 'Comentário reportado',
            'comments_about': '{_num} comentário{s_num} sobre'
        }

        this.dicts.en = {
            '_lang': 'English',
            'login_form_use_reset_code': 'Please check your email for the reset code and use it in the form below. You have {minutes} minutes to use it.',
            'planejado': 'planned',
            'empenhado': 'committed',
            'liquidado': 'finished',
            'error_decode_token': "Error to decode stored token! Please relogin...",
            'address_not_found': 'Address not found...',
            'error_renew_token': 'Error to renew token',
            'error_token_json': 'Error in token response',
            'private_data': 'This is your private data, displayed only for you',
            'want_to_question?': 'Do you want to make a question for the government about this expense?',
            'error_get_url_facebook': 'Error to get URL for Facebook login',
            'error_complete_login_facebook': 'Error to complete Facebook login',
            'error_send_question': 'Error to send question',
            'error_multipoint_ajax': 'Error to get multiple point info',
            'error_mapstore_ajax': 'Error to get data',
            'comments_about': '{_num} comment{s_num} about'
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

    pluralization(params) {
        for (let key in params) {
            // Params that should be puralized
            if (key[0] == '_') {
                // Plural or singular
                if (params[key] > 1) params['s' + key] = 's'
                else params['s' + key] = ''
            }
        }
    }

    translate(str, params) {
        let translated = this.dicts[this._currentLang][str]
        translated = translated ? translated : str
        if (params) {
            this.pluralization(params)
            translated = strFormat(translated, params)
        }
        return translated
    }
}

let translator = new Translator()
translator.init()

export default translator
