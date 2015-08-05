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


    // Allows "on show" and "on hide"
    (function ($) {
        $.each(['show', 'hide'], function (i, ev) {
            var el = $.fn[ev];
            $.fn[ev] = function () {
                console.log(ev, arguments)
                var r = el.apply(this)
                // Trigger "on show/hide" after showing/hiding to avoid problems
                // initializing elements still not visible
                if (arguments[0] && arguments[0].propagate) {
                    console.log("propagando", arguments)
                    this.trigger(ev, arguments)
                } else {
                    console.log("nao propagando", arguments)
                }
                return r
            };
        });
    })(jQuery);


    // Prepares a function (func) to be executed when an "event" is published,
    // but this should only happens while an element (selector) is visible.
    // "runOnFirstShow" is used to force the function to be executed also when the
    // element first becomes visible, not only when "event" is published.
    function showSubscribe(event, selector, runOnFirstShow, func) {
        console.log("showSubscribed", event, selector, runOnFirstShow, func)
        var element = $(selector)

        // Starts to update automaticaly while visible
        element.on("show", function(ev) {
            console.log("subshow", event, selector, func)
            pubsub.subscribe(event, func)
            // if (runOnShow) func()
            if (runOnFirstShow && !func.notFirstShow) {
                func()
            }
            func.notFirstShow = true
        })

        // Stops to update automaticaly while hidden
        element.on("hide", function(ev) {
            console.log("subhide", event, selector, func)
            pubsub.unsubscribe(func)
        })

        // Element is already visible, so force run
        if (element.css('display') != 'none'){
            console.log("already shown, force func")
            func()
        }
    }

    // Run 'func' the first time 'selector' is shown
    function runOnFirstShow(selector, func) {
        var element = $(selector)
        element.on("show", function(ev) {
            func()
            element.on("show", null)
        })
    }

    return {
        showSubscribe: showSubscribe,
        runOnFirstShow: runOnFirstShow
    }
})
