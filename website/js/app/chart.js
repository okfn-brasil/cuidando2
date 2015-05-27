define("populate-table",  ['jquery', 'hcd', 'hce'], function ($) {

    'use strict';

    $.getJSON(window.API_URL + '/info/data')
    .done(function(response_data) {
        console.log(response_data)
        var data = response_data.data
        $("#mapped-num").html(data.mapped)
        $("#total-num").html(data.total)
        // table = $("#maped-table")
        // table.empty()
        // $.each(point, function(key, value) {
        //     list.append("<dt>"+key+"</dt><dd>"+value+"</dd>")
        // })
        $('#container').highcharts({
            data: {
                table: 'mapped-table'
            },
            chart: {
                type: 'column'
            },
            title: {
                text: 'Data extracted from a HTML table in the page'
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: 'Units'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        this.point.y + ' ' + this.point.name.toLowerCase();
                }
            }
        });
    });
});

require(['jquery', 'populate-table'], function ($) {

    'use strict';

});
