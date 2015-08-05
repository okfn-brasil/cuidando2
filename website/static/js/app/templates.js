define(['jquery', 'handlebars.runtime', 'compiled_templates/all'], function($, Handlebars) {

    'use strict'

    function getTemplate(name, partial) {
        // // Get and compile template if not loaded
        // // http://berzniz.com/post/24743062344/handling-handlebarsjs-like-a-pro
        // console.log("BBBBBBBBBBB", Handlebars)
        // if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
		    //     $.ajax({
			  //         url : '/handlebars_templates/' + name + '.html',
			  //         async : false
		    //     })
        //     .done(function(data) {
        //         console.log("CCCCCCCCCCCC", Handlebars)
        //         if (Handlebars.templates === undefined) {
        //             Handlebars.templates = {};
        //         }
        //         Handlebars.templates[name] = Handlebars.compile(data);
        //     })
	      // }


        console.log("getting template", name, partial, Handlebars.templates[name])
        // Register template as a partial if asked for
        if (partial) Handlebars.registerPartial(name, Handlebars.templates[name])

	      return Handlebars.templates[name];
    }

    return {
        get: getTemplate
    }
})
