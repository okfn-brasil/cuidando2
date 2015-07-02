define(['jquery', 'pubsub'], function($, pubsub) {

    'use strict';

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


    function showSubscribe(event, func, selector) {
        console.log(selector)
        // Starts to update automaticaly while visible
        $(selector).on("show", function() {
            pubsub.subscribe(event, function(eventNow, dataNow) {
                func(eventNow, dataNow)
            })
            func()
        })

        // Stops to update automaticaly while hidden
        $(selector).on("hide", function() {
            pubsub.unsubscribe(func)
        })
    }

    return showSubscribe
});
