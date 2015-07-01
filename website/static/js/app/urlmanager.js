define(['jquery', 'pubsub', 'urlmanagerlib'], function($, pubsub, UrlManager) {

    'use strict';

    // ****************************************************
    //          URL MANAGER INITIALIZATION
    // ****************************************************
    var urlManager = new UrlManager({
        format: '#{{year}}/{{code}}?{{params}}',
        params: {
            year: null,
            code: null,
            page: 0,
            per_page_num: 25
        },
        parsers: {
            year: parseInt,
            page: parseInt,
            per_page_num: parseInt
        },
        pubsub: pubsub
    });

    // If no year, force it to current year
    if (!urlManager.getParam('year'))
        urlManager.setParam('year', new Date().getFullYear())

    return urlManager;
});
