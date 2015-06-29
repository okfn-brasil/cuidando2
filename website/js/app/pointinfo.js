define(["jquery", 'pubsub', 'app/urlmanager'], function($, pubsub, urlManager) {

    'use strict';

    var names = {
        "reg": 'Região',
        "descr": 'Descrição',
        "year": "Ano"
    }

    function displayPointInfo(point) {
        var list = $("#point-info")
        list.empty()
        $.each(point, function(key, value) {
            if (names[key])
            list.append("<dt>" + names[key] + "</dt><dd>" + value + "</dd>")
        })
    }

    pubsub.subscribe("pointdata.changed", function(event, data) {
        displayPointInfo(data);
    })
});
