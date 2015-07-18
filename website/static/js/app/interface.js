define(["jquery", 'pubsub', 'app/urlmanager'], function($, pubsub, urlManager) {

    'use strict';

    // Show/Hide interface elements
    function switchGeneralSpecific() {
        if (urlManager.getParam('code')) {
            console.log("Specific")
            $(".general-view").hide()
            $(".specific-view").show()
        } else {
            console.log("General")
            $(".general-view").show()
            $(".specific-view").hide()
        }
        // if (data.value == null) {
        //     $(".general-view").fadeIn()
        //     $(".specific-view").fadeOut()
        // } else {
        //     $(".general-view").fadeOut()
        //     $(".specific-view").fadeIn()
        // }
    }

    // Controls when to show/hide the elements of the interface
    var prevCodeWasNull = !urlManager.getParam('code')
    function controledSwitch() {
        var currentCodeIsNull = !urlManager.getParam('code')
        // Show/Hide only if "nulliness" changed
        if (currentCodeIsNull != prevCodeWasNull) {
            switchGeneralSpecific()
        }
        prevCodeWasNull = currentCodeIsNull
    }

    pubsub.subscribe("code.changed", function(event, data) {
        controledSwitch()
    })


    // Button to go back to general view
    $("#to-general").click(function () {
        pubsub.publish('code.changed', {value: null})
    });


    // Allows "on show" and "on hide"
    (function ($) {
        $.each(['show', 'hide'], function (i, ev) {
            var el = $.fn[ev];
            $.fn[ev] = function () {
                this.trigger(ev);
                return el.apply(this, arguments);
            };
        });
    })(jQuery);


    function init() {
        switchGeneralSpecific()
        // This allows pointInfo to load the data at startup
        pubsub.publish('code.changed', {value: urlManager.getParam('code')})
    }
    return init
});
