define(["jquery", 'pubsub', 'app/urlmanager', "app/showsub"], function($, pubsub, urlManager, showSubscribe) {

    'use strict';

    var infoId = "#point-info"

    var names = {
        "reg": 'Região',
        "descr": 'Descrição',
        "year": "Ano"
    }


    function getPointInfo(event, data) {
        var code = typeof data !== 'undefined' ? data.value : urlManager.getParam('code')
        // Sometimes "code" changed to "null", for year pages
        if (code) {
            // Get data about current code and publish it
            $.getJSON(API_URL + '/execucao/list?code=' + code)
            .done(function(response_data) {
                var pointInfo = response_data.data[0]
                pubsub.publish('pointdata.changed', pointInfo)
                displayPointInfo(pointInfo)
            });
        }
    }


    function displayPointInfo(point) {
        var domList = $(infoId)
        domList.empty()

        if (point) {
            $.each(point, function(key, value) {
                // if (names[key])
                //     domList.append("<dt>" + names[key] + "</dt><dd>" + value + "</dd>")
                domList.append("<dt>" + key + "</dt><dd>" + value + "</dd>")
            })
        }
    }

    showSubscribe("code.changed", infoId, true, getPointInfo)
});
