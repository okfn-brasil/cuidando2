define(['jquery', 'pubsub', 'app/urlmanager'], function($, pubsub, urlManager) {

    'use strict'

    var lang = urlManager.getParam('lang')

    var dicts = {}

    dicts['pt-br'] = {
        'Share': 'Compartilhar',
        'Logout': 'Sair',
        'About': 'Sobre',
        'Another': 'Outra',
        'Login': 'Entrar',
        'Register': 'Registrar',
    }

    dicts['en'] = {
    }

    function translate(str) {
        var translated = dicts[lang][str]
        return translated ? translated : str
    }

    function init() {
        $('.lang-button').click(function(event) {
            pubsub.publish('lang.changed', {
                'value': event.currentTarget.dataset.lang,
                'sender': 'multilang',
            })
            return false
        })

        pubsub.subscribe('lang.changed', function(event, data) {
            lang = data.value
            $('[data-i18n]').each(function (index, element) {
                element.innerHTML = translate(element.dataset.i18n)
            })
            $('html').attr('lang', lang)
        })
    }

    return {
        'init': init,
        'translate': translate,
    }
})
