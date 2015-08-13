define(['jquery', 'pubsub', 'urlmanagerlib', "app/auth"], function($, pubsub, UrlManager) {

    'use strict'


    var routes = [{
            format: 'ano/{{year}}',
            params: {
                page: 0,
                per_page_num: 25
            },
            parsers: {
                year: parseInt,
                page: parseInt,
                per_page_num: parseInt
            },
        }, {
            format: 'despesa/{{year}}/{{code}}',
            parsers: {
                year: parseInt,
            }
        }, {
            format: 'pessoa/{{username}}',
        }, {
            format: 'texto/{{text}}',
        }
    ]

    // ****************************************************
    //          URL MANAGER INITIALIZATION
    // ****************************************************
    var urlManager = new UrlManager({
        routes: routes,
        defaultRoute : "ano/" + new Date().getFullYear(),
        // format: '#{{section}}/{{year}}/{{code}}?{{params}}',
        // params: {
        //     section: null,
        //     year: null,
        //     code: null,
        //     page: 0,
        //     per_page_num: 25
        // },
        // parsers: {
        //     year: parseInt,
        //     page: parseInt,
        //     per_page_num: parseInt
        // },
        pubsub: pubsub
    })

    // // If no section, force it to data
    // if (!urlManager.getParam('section'))
    //     urlManager.setParam('section', 'data')
    // // If no year, force it to current year
    // if (!urlManager.getParam('year'))
    //     urlManager.setParam('year', new Date().getFullYear())

    window.u = urlManager
    return urlManager
});
