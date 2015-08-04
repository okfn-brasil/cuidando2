define(['jquery', 'datatables', 'app/showsub', 'app/urlmanager'], function ($, datatables, showSubscribe, urlManager) {

  "use strict";

  // ****************************************************
  //                    DATA TABLE
  // ****************************************************
  /* Usage:

      var dataTable = new DataTable('#data-table', {
        // The API endpoint. Should return an array of objects.
        url: api_url + '/api/v1/receita/list',
        // Define the table columns.
        // Format: [ {field: 'jsonObjectField', title: "Column Title"}, ... ]
        columns: [
          { field: 'id',                title: 'ID'},
          { field: 'date',              title: 'Data'},
          { field: 'code',              title: 'Código'},
          { field: 'description',       title: 'Descrição'},
          { field: 'monthly_predicted', title: 'Previsto'},
          { field: 'monthly_outcome',   title: 'Realizado'}
        ],
        // Functions to format each field value.
        formatters: {
          date: formatDate,
          monthly_predicted: formatCurrency,
          monthly_outcome: formatCurrency
        },
        // Add all relevant params. This object will be used to subscribe for
        // changes using pubsub. Use `null` or `undefined` for optional params
        // with no initial values.
        params: {
          years: 2014,
          page: 0,
          per_page_num: 10
        },
        // DataTables options
        options: {
          searching: false,
          ordering: false
        },
        // The same `pubsub` object used by all components to be synced.
        pubsub: pubsub,
      });
      // When the user change the current page or the number of items per page
      // it will publish "page.changed" and "per_page_num.changed", respectively

  */

  var DataTable = function() { this.init && this.init.apply(this, arguments); };

  DataTable.prototype = {
    init: function(el, opts) {
      this.$el = $(el);
      if (!this.$el.is('table')) {
        this.$el = $('<table>');
        $(el).append(this.$el);
      }
      this.domID = el
      this.pubsub = opts.pubsub;
      this.url = opts.url;
      this.columns = opts.columns;
      this.dataTablesOpts = opts.options;
      this.params = $.extend({page: 0, per_page_num: 10}, opts.params);
      this.formatters = opts.formatters || {};
      this.createTableHeader().initTable().handleEvents();
      return this;
    },

    destroy: function() {
      this.table.destroy(true);
      // TODO: Unsubscribe pub/sub messages
    },

    createTableHeader: function() {
      var $tr = $('<tr>');
      $.each(this.columns, function(i, column) {
        $tr.append($('<th>').text(column.title).addClass(column.className));
      });
      this.$el.append($('<thead>').append($tr));
      return this;
    },

    initTable: function() {
      var page = this.params.page,
          that = this,
          perPageNum = this.params.per_page_num,
          opts = $.extend({}, this.dataTablesOpts, {
            serverSide: true,
            // Use our ajax request function.
            ajax: function() { that._ajaxRequest.apply(that, arguments); },
            // Extrac coluns from options.
            columns: $.map(this.columns, function(col) {
              return {data: col.field, className: col.className}
            }),
            // set the page and how many items to display.
            pageLength: perPageNum,
            displayStart: (page * perPageNum),
            pagingType: 'full_numbers',
            dom: '<"datatable-controls"lfp>rti',
            language: {
              search: '',
              paginate: {
                first: '<<',
                previous: '<',
                next: '>',
                last: '>>'
              }
            }
          });
      // Get a reference to DataTables API.
      this.table = this.$el.dataTable(opts).api();

      return this;
    },

    handleEvents: function() {
      var that = this;
      this.$el.on('draw.dt',   function () { that._resizeSearchBox(); });
      // Publish changes on `page` and `per_page_num` params.
      this.$el.on('page.dt',   function () { that._publishPageChanged(); });
      this.$el.on('length.dt', function () {
        that._publishPageChanged();
        that._publishPerPageNumChanged();
      });

      if (this.pubsub) {
        // Subscribe to params changes.
        $.each(this.params, function(name, value) {
          (function(paramName) {

            showSubscribe(paramName + ".changed", that.domID, false, function(msg, content) {
                var paramValue = typeof content !== 'undefined' ? content.value : urlManager.getParam(paramName)
                // Tries to ignore changes published by this instance
                if (!content || (content.sender != that && paramValue != that.getParam(paramName))) {
                    console.log("UPDATE", paramName, paramValue, content)
                    that.setParam(paramName, paramValue);
                }

            })

            // that.pubsub.subscribe(paramName + ".changed", function(msg, content) {
            //   // Ignore changes published by this instance
            //   if (content.sender != that && content.value != that.getParam(paramName)) {
            //     that.setParam(paramName, content.value);
            //   }
            // });

          })(name);
        });
      }
      return this;
    },

    setParam: function(name, value) {
      // `page` and `per_page_num` are special params.
      if (name == 'page') {
        this.table.page(parseInt(value)).draw(false);
      } else if (name == 'per_page_num') {
        this.table.page.len(parseInt(value)).draw(false);
      } else {
        this.params[name] = value;
        this.table.ajax.reload(null);
        this._publishPageChanged();
      }
      return this;
    },

    getParam: function(name) {
      return this.params[name];
    },

    _resizeSearchBox: function() {
      var total = this.$el.parent().find('.datatable-controls').width();
      var width = total - this.$el.parent().find('.dataTables_paginate').width() - 50;
      this.$el.parent().find('.dataTables_filter input[type=search]').width(width);
    },

    _publishPageChanged: function() {
      this.params.page = this.table.page();
      if (this.pubsub)
        this.pubsub.publish("page.changed", { value: this.table.page(), sender: this });
    },

    _publishPerPageNumChanged: function() {
      this.params.per_page_num = this.table.page.len();
      if (this.pubsub)
        this.pubsub.publish("per_page_num.changed", { value: this.table.page.len(), sender: this });
    },

    _createUrl: function(url, params) {
      params = $.extend({}, params)
      $.each(params, function(key, param) {
        if (param == null) delete params[key];  // Remove empty values
      });
      return url + '?' + $.param(params, true);
    },

    _formatData: function(data) {
      var formatters = this.formatters
          // items = data['_items'];
      $.each(data, function(i, row) {
        $.each(formatters, function(column, formatter) {
          if (row[column] !== undefined && $.isFunction(formatter)) {
            row[column] = formatter(row[column]);
          }
        });
      });
      return data;
    },

    _ajaxRequest: function(data, callback, settings) {
      var that = this,
          draw = data.draw,
          params = $.extend({}, this.params, {
            per_page_num: data.length,
            page: (data.start / data.length)
          });

      $.ajax({
        type: 'GET',
        url: this._createUrl(this.url, params),
        xhrFields: { withCredentials: false }
      })
      .done(function(data, textStatus, jqXHR) {
        var totalCount = jqXHR.getResponseHeader('X-Total-Count');
        // var totalCount = data['_meta'].total;
        callback({  // Ref: http://datatables.net/manual/server-side
          draw: draw,
          recordsTotal: totalCount,
          recordsFiltered: totalCount,
          data: that._formatData(data.data)
        });
      });
    }

  };

  return DataTable;
});
