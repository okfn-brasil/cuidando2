define(['jquery', 'pubsub'], function($, pubsub) {

    'use strict';

    // // Allows "on show" and "on hide"
    // $.each(['show', 'hide'], function (i, ev) {
    //     var el = $.fn[ev];
    //     console.log(i, ev, el)
    //     $.fn[ev] = function () {
    //         console.log("RODOU", i, ev, el)
    //         this.trigger(ev);
    //         return el.apply(this, arguments);
    //     };
    // });


    // Prepares a function (func) to be executed when an "event" is published,
    // but this should only happens while an element (selector) is visible.
    // "runOnShow" is used to force the function to be executed also when the
    // element becomes visible, not only when "event" is published.
    function showSubscribe(event, func, selector, runOnShow) {
        console.log(selector, "showSubscribed")

        // var subscribed_func = function(eventNow, dataNow) {
        //     console.log("eventoNow", eventNow)
        //     func(eventNow, dataNow)
        // }

        // Starts to update automaticaly while visible
        $(selector).on("show", function() {
            console.log(selector, "Subshow")
            // pubsub.unsubscribe(subscribed_func)
            pubsub.subscribe(event, func)
            if (runOnShow) func()
        })

        // Stops to update automaticaly while hidden
        $(selector).on("hide", function() {
            console.log(selector, "Subhide")
            pubsub.unsubscribe(func)
        })
    }

    return showSubscribe
});
