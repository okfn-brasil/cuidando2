define(['jquery', 'pubsub', 'urlmanagerlib'],
function ($, pubsub, UrlManager) {

    'use strict';

    // ****************************************************
    //          URL MANAGER INITIALIZATION
    // ****************************************************
    var urlmanager = new UrlManager({
      format: '#{{year}}/{{code}}?{{params}}',
      params: {
        years: 2015,
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

    return urlmanager;
});
