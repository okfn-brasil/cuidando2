require(['jquery', 'pubsub', 'urlmanager', 'datatable', 'superselect'],
function ($, pubsub, UrlManager, DataTable, SuperSelect) {

  'use strict';

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
    if (symbol == null) {
      symbol = "";
    } else {
      symbol += "&nbsp;"
    }
    // Format currency values as "R$ 123.456,78".
    var number = new Number(value).toFixed(2)         // Force the length of decimal
                .replace('.', ',')                    // Use comma as decimal mark
                .replace(/\d(?=(\d{3})+\,)/g, '$&.'); // Add points as thousands separator
    return symbol + number;
  }


  $(function main() {
    // This pubsub object should be used by all objects that will be synced.
    window.pubsub = pubsub;

    // ****************************************************
    //          URL MANAGER INITIALIZATION
    // ****************************************************
    var urlManager = window.urlManager = new UrlManager({
      format: '#{{years}}/{{code}}?{{params}}',
      params: {
        years: [2014],
        code: null,
        page: 0,
        per_page_num: 25
      },
      parsers: {
        years: function(value) {
          return $.map(value.split('-'), function(value) {
            return parseInt(value);
          });
        },
        page: parseInt,
        per_page_num: parseInt
      },
      pubsub: pubsub
    });

    // populateYearSelector(urlManager.getParam('years'), SuperSelect);
    // createBarChart();
    // populateBarChart(urlManager.getParam('years'), urlManager.getParam('code'));

    // ****************************************************
    //          DATA TABLE INITIALIZATION
    // ****************************************************
    try {
      var dataTable = new DataTable('#data-table', {
        url: window.API_URL + '/data',
        columns: [
          { field: 'descr',       title: 'Descrição'},
          { field: 'pk',       title: 'PK'}
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
          years: urlManager.getParam('years'),
          code: urlManager.getParam('code'),
          page: urlManager.getParam('page'),
          per_page_num: urlManager.getParam('per_page_num'),
          // TODO: pegar do URL e usar esse parametro
          only_mapped: '&where={"lat":404}'
        },
        // DataTables options.
        // Disable searching and ordering.
        options: {
          searching: false,
          ordering: false
        },
        pubsub: pubsub,
      });

    } catch(e) {
      console && console.error('Could not create DataTable:', e)
    }
  });



    // Populate selector and prepare its publisher
    function populateYearSelector(years, SuperSelect) {
        'use strict';
        $.getJSON(window.API_URL + '/info')
        .done(function(response_data) {
            var yearSelector = $("#year-selector")
            for (var i = 0; i < response_data.length; ++i) {
                var year = response_data[i].year;
                var item = '<option value="' + year + '">' + year + '</option>';
                yearSelector.append(item)
            }
            // Set current year
            // TODO: getting only first year... how to use more?
            if (years) yearSelector.val(years[0])

            // -----------SUPER STYLED SELECT------------------------------------------
            // Iterate over each select element
            $('#year-selector').each(function () {
            var yearSelector = new SuperSelect($(this));

            // Subscribe to year change
            pubsub.subscribe("years.changed", function (event, data) {
                yearSelector.setValue(data.value);
            });

            yearSelector.on('change', function(e, value) {
                pubsub.publish('years.changed', {value: [value]});
                /* alert($this.val()); Uncomment this for demonstration! */
            });

            });
            // ------------------------------------------------------------------------


            // Subscribe to year change
            pubsub.subscribe("years.changed", function (event, data) {
                $("#year-selector").val(data.value)
            })
        });
        $("#year-selector").change(function (e) {
            // Publish year change
            pubsub.publish('years.changed', {value: [e.target.value]})
        })
    }

});
