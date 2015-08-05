define(['jquery', 'pubsub', 'showutils', 'app/urlmanager', 'superselect'], function($, pubsub, showutils, urlManager, SuperSelect) {

    'use strict';

    var loaded = false,
        elementId = "#year-selector",
        yearSelector = $(elementId)

    function initYearSelector() {
        // Populate selector and prepare its publisher
        $.getJSON(window.API_URL + '/execucao/info')
            .done(function(response_data) {
                var existingYears = response_data.data.years
                for (var i = 0; i < existingYears.length; ++i) {
                    var year = existingYears[i];
                    var item = '<option value="' + year + '">' + year + '</option>';
                    yearSelector.append(item)
                }

                // // -----------SUPER STYLED SELECT------------------------------------------
                // // Iterate over each select element
                // $('#year-selector').each(function() {
                //     var yearSelector = new SuperSelect($(this));

                //     // // Subscribe to year change
                //     // pubsub.subscribe("year.changed", function(event, data) {
                //     //     yearSelector.setValue(data.value);
                //     // });

                //     yearSelector.on('change', function(e, value) {
                //         pubsub.publish('year.changed', {
                //             value: [value]
                //         });
                //         /* alert($this.val()); Uncomment this for demonstration! */
                //     });

                // });
                // // ------------------------------------------------------------------------


                // Subscribe to year change
                pubsub.subscribe("year.changed", function(event, data) {
                    yearSelector.val(data.value)
                })

                // Set current year
                var currentYear = urlManager.getParam('year')
                // if (!currentYear) currentYear = new Date().getFullYear()
                yearSelector.val(currentYear)
            });

        // Publish year change
        yearSelector.change(function(e) {
            pubsub.publish('year.changed', {value: e.target.value})
        })
    }

    // Run loader on first show
    showutils.runOnFirstShow(elementId, function () {
        if (!loaded) {
            loaded = true
            initYearSelector()
        }
    })
})
