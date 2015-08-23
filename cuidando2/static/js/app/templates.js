define(['jquery', 'app/urlmanager', 'handlebars.runtime', 'compiled_templates/handlebars'], function($, urlManager, Handlebars) {

    'use strict'

    Handlebars.registerHelper('t',
        function(str){
            return (I18n != undefined ? I18n.t(str) : str);
        }
    )

    function getTemplate(name, partial) {
        // Register template as a partial if asked for
        if (partial) Handlebars.registerPartial(name, Handlebars.templates[name])

	      return Handlebars.templates[name];
    }

    function routeFromElement (event) {
        // var route = event.currentTarget.dataset.route.split('/')
        console.log(event)
        var route = event.currentTarget.href.split('@')[1].split('/')
        urlManager.route.apply(urlManager, route)
        return false
    }

    // Apply a template to an element passing data
    // Also activate anchors
    function applyTemplate(element, template, data) {
        element.html(template(data))
        // element.find('[data-route]').click(routeFromElement)
        element.find("[href^='@']").click(routeFromElement)
    }

    // Helper to apply a template based on its name
    function smartApply(name, data) {
        applyTemplate(
            $('#' + name + '-container'),
            getTemplate(name),
            data
        )
    }

    return {
        get: getTemplate,
        apply: applyTemplate,
        smartApply: smartApply,
    }
})
