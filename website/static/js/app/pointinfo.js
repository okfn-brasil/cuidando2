define(["jquery", 'pubsub', 'app/urlmanager', "app/showsub"], function($, pubsub, urlManager, showSubscribe) {

    'use strict';

    var infoId = "#point-info"

    var names = {
        "reg": 'Região',
        "descr": 'Descrição',
        "year": "Ano"
    }

    function displayPointInfo(event, point) {
        var dom_list = $(infoId)
        dom_list.empty()
        console.log(point)

        if (point) {
            $.each(point, function(key, value) {
                // if (names[key])
                //     dom_list.append("<dt>" + names[key] + "</dt><dd>" + value + "</dd>")
                dom_list.append("<dt>" + key + "</dt><dd>" + value + "</dd>")
            })
        }
    }

    showSubscribe("pointdata.changed", displayPointInfo, infoId, false)
});
