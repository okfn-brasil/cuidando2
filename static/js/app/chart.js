define(['jquery', 'pubsub', 'app/urlmanager', "showutils", "app/templates", 'hcd', 'hce'], function($, pubsub, urlManager, showutils, templates) {

    'use strict';

    var chartsId = '#charts-container',
        chartsContainer = $(chartsId),
        chartsTemplates = null,
        year = null

    function initInterface() {
        chartsTemplates = templates.get('charts')
    }

    // Get data, update table, plot chart
    function updateInfo(event, data) {
        if (!chartsTemplates) initInterface()

        var newYear = typeof data !== 'undefined' ? data.value : urlManager.getParam('year')
        // Avoids realoading data if year didn't change
        if (newYear != year) {
            year = newYear
            $.getJSON(window.API_URL + '/execucao/info/' + year)
                .done(function(response_data) {
                    var data = response_data.data
                    // Rows table
                    data.rows["mapped-per"] = Math.round(data.rows.mapped / data.rows.total * 100),
                    data.rows["region-per"] = Math.round(data.rows.region / data.rows.total * 100),
                    // Values table
                    $.each(data.values, function(index, valueElement) {
                        valueElement.unmapped = valueElement.total - valueElement.mapped
                        valueElement.percentage = Math.round(valueElement.mapped / valueElement.total * 100)
                    })

                        chartsContainer.html(chartsTemplates(data))

                    plotChart('rows-table', "#chart-rows-container")
                    plotChartStacked('values-table', "#chart-values-container")
                })
        }
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

    showutils.showSubscribe("year.changed", chartsId, true, updateInfo)
})
