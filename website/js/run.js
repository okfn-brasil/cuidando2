// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones,
requirejs.config({
    baseUrl: "js",
    // urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        // app: "../app",
        // "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min"
        jquery: "//code.jquery.com/jquery-2.1.4.min",
        leaflet: "//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet",
        // leaflet: "//cdn.leafletjs.com/leaflet-0.7.3/leaflet",
        mapquest: "//open.mapquestapi.com/sdk/leaflet/v1.0/mq-map.js?key=Fmjtd%7Cluur25ub25%2C8s%3Do5-9w7x50",
        highcharts: "//code.highcharts.com/highcharts",
        hcd: "//code.highcharts.com/modules/data",
        hce: "//code.highcharts.com/modules/exporting",
        mapcluster: "leaflet.markercluster",
        pubsub: '../vendor/pubsub-js/js/pubsub',
        datatables: '../vendor/datatables/js/jquery.dataTables',
        bootstrap: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min'
    },
    shim: {
        // 'leaflet': {
        //     exports: 'L'
        // },
        mapcluster: ['leaflet', 'mapquest'],
        mapquest: ['leaflet'],
        highcharts: ['jquery'],
        bootstrap: ['jquery'],
        hcd: ['highcharts'],
        hce: ['highcharts']
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);
