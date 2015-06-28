define(['jquery', 'app/urlmanager', 'hcd', 'hce'], function ($, urlManager) {

    'use strict';

    function plotChart() {
        $('#container').highcharts({
            data: {
                table: 'mapped-table',
                endRow: 1
            },
            // series: [{type: 'column'},
            //          {type:'spline'}],
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
    }

    var year = urlManager.getParam('year')
    $.getJSON(window.API_URL + '/info/' + year)
    .done(function(response_data) {
        var data = response_data.data
        $("#mapped-num").html(data.mapped)
        $("#mapped-per").html(Math.round(data.mapped/data.total*100))
        $("#region-num").html(data.region)
        $("#region-per").html(Math.round(data.region/data.total*100))
        $("#total-num").html(data.total)
        plotChart()
        // table = $("#maped-table")
        // table.empty()
        // $.each(point, function(key, value) {
        //     list.append("<dt>"+key+"</dt><dd>"+value+"</dd>")
        // })
    });

});
