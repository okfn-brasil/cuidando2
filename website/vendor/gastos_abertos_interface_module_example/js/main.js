// For any third party dependencies, like jQuery, place them in the lib folder.
// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: './js/',
    paths : {
        riot : '../vendor/riotjs/js/riot'

    },
    packages: [{
        name: "example"
    }],
    shim : {
        'riot': {
            exports: 'riot'
        }
    }
});
// Start loading the main app file. Put all of
// your application logic in there.

require(['example', 'riot'], function (app, riot) {

    window.riot = riot;
    app.init();
});
