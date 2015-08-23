define(['jquery', 'pubsub', 'app/urlmanager', 'app/interface'], function($, pubsub, urlManager) {

    'use strict'

    var lang = urlManager.getParam('lang')

    $('.lang-button').click(function(event) {
        pubsub.publish('lang.changed', {
            'value': event.currentTarget.dataset.lang,
            'sender': 'multilang',
        })
        return false
    })

    pubsub.subscribe('lang.changed', function(event, data) {
        lang = data.value
    })

})
