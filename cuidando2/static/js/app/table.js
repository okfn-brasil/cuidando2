define(['jquery', 'pubsub', 'showutils', 'app/urlmanager', 'datatable'], function($, pubsub, showutils, urlManager, DataTable) {

    'use strict';

    var loaded = false,
        datatableId = '#data-table',
        containerId = '#datatable-container'

    // ****************************************************
    //               DATA TABLE FORMATTERS
    // ****************************************************

    function formatDate(value) {
        // Format Dates as "dd/mm/yy".
        var date = new Date(value);
        // Add 1 to month value since Javascript numbers months as 0-11.
        return date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
    }

    function formatCurrency(value, symbol) {
        if (symbol === null) {
            symbol = "";
        } else {
            symbol += "&nbsp;"
        }
        // Format currency values as "R$ 123.456,78".
        var number = new Number(value).toFixed(2) // Force the length of decimal
            .replace('.', ',') // Use comma as decimal mark
            .replace(/\d(?=(\d{3})+\,)/g, '$&.'); // Add points as thousands separator
        return symbol + number;
    }


    // Datatable initialization
    function initTable() {
        console.log("INIT TABLE!!!!!!!!!!!!!!!!!!!!!")
        try {
            var dataTable = new DataTable(datatableId, {
                url: window.API_URL + '/execucao/list',
                // url: "http://demo.gastosabertos.org/api/v1/receita/list",
                columns: [{
                        field: 'ds_projeto_atividade',
                        title: 'Descrição'
                    }, {
                        field: 'code',
                        title: 'PK'
                    }
                    // { field: 'id',                title: 'ID'},
                    // { field: 'date',              title: 'Data'},
                    // { field: 'code',              title: 'Código'},
                    // { field: 'description',       title: 'Descrição'},
                    // { field: 'monthly_predicted', title: 'Previsto (R$)', className: 'col-predicted'},
                    // { field: 'monthly_outcome',   title: 'Realizado (R$)', className: 'col-outcome'}
                ],

                // formatters: {
                //   date: formatDate,
                //   monthly_predicted: formatCurrency,
                //   monthly_outcome: formatCurrency
                // },
                params: {
                    year: urlManager.getParam('year'),
                    code: urlManager.getParam('code'),
                    page: urlManager.getParam('page'),
                    per_page_num: urlManager.getParam('per_page_num'),
                },
                // DataTables options.
                // Disable searching and ordering.
                options: {
                    searching: false,
                    ordering: false
                },
                pubsub: pubsub,
                containerId: containerId
            });

            // Change URL to code on click
            $(datatableId + ' tbody').on('click', 'tr', function () {
                urlManager.route('despesa', urlManager.getParam('year'), dataTable.table.row(this).data().code)
            })

            // $("#data-table_wrapper").addClass("general-view")

        } catch (e) {
            console && console.error('Could not create DataTable:', e)
        }
    }

    // Run loader on first show
    showutils.runOnFirstShow(containerId, function () {
        if (!loaded) {
            loaded = true
            initTable()
        }
    })
})
