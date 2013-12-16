require.config({
    baseUrl: '/js',
    paths: {
        jquery: 'lib/jquery/jquery.min',
        underscore: 'lib/underscore/underscore-min',
        backbone: 'lib/backbone/backbone-min',
        text: 'lib/requirejs-text/text',
        common: 'lib/todomvc-common/base'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require([
    'todo/views/app-view',
    'todo/routers/router',
    'jquery',
    'underscore',
    'backbone'
],
    function(
        TodoApp,
        TodoRouter
        ){
        new TodoApp();
        new TodoRouter();
	    Backbone.history.start();
    });
