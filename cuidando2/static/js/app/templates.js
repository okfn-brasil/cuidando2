define(['jquery', 'app/urlmanager', 'app/multilang', 'handlebars.runtime', 'compiled_templates/handlebars'], function($, urlManager, multilang, Handlebars) {

    'use strict'

    var i18nTemplate = getTemplate('i18n-element')

    // i18n helper
    Handlebars.registerHelper('t',
        function(str){
            return new Handlebars.SafeString(i18nTemplate({
                'str': str,
                'translated': multilang.translate(str),
            }))
        }
    )

    function getTemplate(name, partial) {
        // Register template as a partial if asked for
        if (partial) Handlebars.registerPartial(name, Handlebars.templates[name])

	      return Handlebars.templates[name];
    }

    // Use the mark in a clicked element to set route
    function routeFromElement (event) {
        // var route = event.currentTarget.dataset.route.split('/')
        console.log(event)
        var route = event.currentTarget.href.split('@')[1].split('/')
        urlManager.route.apply(urlManager, route)
        return false
    }

    // Activate links specialy marked to use routing
    function activateLinks(element) {
        // element.find('[data-route]').click(routeFromElement)
        element.find("[href^='@']").click(routeFromElement)
    }

    // Apply a template to an element passing data
    // Also activate anchors
    function applyTemplate(element, template, data) {
        element.html(template(data))
        activateLinks(element)
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
        activateLinks: activateLinks,
    }
})
