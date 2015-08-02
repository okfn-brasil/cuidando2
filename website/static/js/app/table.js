define(['jquery', 'pubsub', 'app/urlmanager', 'datatable', 'superselect'], function($, pubsub, urlManager, DataTable, SuperSelect) {

    'use strict';


    // TODO: a tabela parece estar pedindo dados mesmo quando não visível...


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


    // This pubsub object should be used by all objects that will be synced.
    // window.pubsub = pubsub;


    // populateYearSelector(urlManager.getParam('year'), SuperSelect);
    // createBarChart();
    // populateBarChart(urlManager.getParam('years'), urlManager.getParam('code'));

    // ****************************************************
    //          DATA TABLE INITIALIZATION
    // ****************************************************
    try {
        var dataTable = new DataTable('#data-table', {
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
                // TODO: Eve começa o contar páginas de 1, DataTable de 0
                // TODO: Eve usa "max_results", DataTable "per_page_num"
                // where: 'year==' + urlManager.getParam('year'),
                year: urlManager.getParam('year'),
                code: urlManager.getParam('code'),
                page: urlManager.getParam('page'),
                per_page_num: urlManager.getParam('per_page_num'),
                // max_results: urlManager.getParam('max_results'),
                // TODO: pegar do URL e usar esse parametro
                // only_mapped: '&where={"lat":404}'
            },
            // DataTables options.
            // Disable searching and ordering.
            options: {
                searching: false,
                ordering: false
            },
            pubsub: pubsub,
        });

        $("#data-table_wrapper").addClass("general-view")

    } catch (e) {
        console && console.error('Could not create DataTable:', e)
    }

    // //TODO: esse subscribe é necessário porque o DataTable assume que os
    // //parâmetros do website são iguais aos da API, mas isso não é verdade para o
    // //"year" e "where=year==<ano>", logo é preciso forçar a atualização do
    // //'where' quando o 'year' mudar. É possível que a API mude e isso se arrume
    // //sozinho. Se não arrumar sozinho, talvez seja bom dar uma rafatorada aqui.
    // pubsub.subscribe("year.changed", function(event, data) {
    //     pubsub.publish('where.changed', {
    //         value: 'year==' + data.value
    //     });
    // })
});
