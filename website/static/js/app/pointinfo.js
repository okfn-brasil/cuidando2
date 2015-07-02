define(["jquery", 'pubsub', 'app/urlmanager', "app/showsub"], function($, pubsub, urlManager, showSubscribe) {

    'use strict';

    var infoId = "#point-info"

    var names = {
        "reg": 'Região',
        "descr": 'Descrição',
        "year": "Ano"
    }

    function displayPointInfo(event, point) {
        var list = $(infoId)
        list.empty()
        if (point) {
            $.each(point, function(key, value) {
                if (names[key])
                    list.append("<dt>" + names[key] + "</dt><dd>" + value + "</dd>")
            })
        }
    }

    // pubsub.subscribe("pointdata.changed", function(event, data) {
    //     displayPointInfo(data);
    // })

    showSubscribe("pointdata.changed", displayPointInfo, infoId)
});
