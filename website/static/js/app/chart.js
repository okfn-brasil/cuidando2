define(['jquery', 'pubsub', 'app/urlmanager', "app/showsub", 'hcd', 'hce'], function($, pubsub, urlManager, showSubscribe) {

    'use strict';

    var chartId = '#chart-container'

    // Get data, update table, plot chart
    function updateInfo() {
        var year = urlManager.getParam('year')
        $.getJSON(window.API_URL + '/execucao/info/' + year)
            .done(function(response_data) {
                // Mapped Rows
                var rows = response_data.data.rows
                $("#mapped-num").html(rows.mapped)
                $("#mapped-per").html(Math.round(rows.mapped / rows.total * 100))
                $("#region-num").html(rows.region)
                $("#region-per").html(Math.round(rows.region / rows.total * 100))
                $("#total-num").html(rows.total)
                plotChart('mapped-table', chartId)

                // Values Table
                var values = response_data.data.values
                var domValues = $("#values-table>tbody")
                domValues.empty()
                $.each(values, function(key, value) {
                    var unmapped = value.total - value.mapped
                    var per = value.mapped / value.total * 100
                    domValues.append(
                        "<tr><th>"+value.name+
                        "</th><td>"+value.mapped+
                        "</td><td>"+unmapped+
                        "</td><td>"+value.total+
                        "</td><td>"+Math.round(per)+
                        // "</td><td>"+per.toFixed(0)+
                        "</td></tr>")
                })
                plotChartStacked('values-table', "#chart-values-container")
            });
    }

    // Plot table 'table' in container 'chartContainer'
    function plotChart(table, chartContainer) {
        $(chartContainer).highcharts({
            data: {
                table: table,
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
                formatter: function() {
                    return '<b>' + this.series.name + '</b><br/>' +
                        this.point.y + ' ' + this.point.name.toLowerCase();
                }
            }
        });
    }

    // Plot table 'table' in container 'chartContainer'
    function plotChartStacked(table, chartContainer) {
        $(chartContainer).highcharts({
            data: {
                table: table,
                endColumn: 2
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
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.series.name + '</b><br/>' +
                        this.point.y + ' ' + this.point.name.toLowerCase();
                }
            }
        });
    }


    showSubscribe("year.changed", chartId, true, updateInfo)


    // // Starts to update automaticaly while visible
    // $(chartId).on("show", function() {
    //     // Subscribe to year change
    //     pubsub.subscribe("year.changed", function(event, data) {
    //         updateInfo()
    //     })
    //     updateInfo()
    // })

    // // Stops to update automaticaly while hidden
    // $(chartId).on("hide", function() {
    //     // Unsubscribe to year change
    //     pubsub.unsubscribe(updateInfo)
    // })
});
