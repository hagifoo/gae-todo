ENTER_KEY = 13;

require.config({
    baseUrl: '/js',
    paths: {
        jquery: 'lib/jquery/jquery.min',
        underscore: 'lib/underscore/underscore-min',
        backbone: 'lib/backbone/backbone-min',
        text: 'lib/requirejs-text/text',
        common: 'lib/todomvc-common/base',
        channel: '/_ah/channel/jsapi?noext'
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
    'todo/collections/todos',
    'todo/routers/router',
    'todo/worker',
    'channel-handler',
    'jquery',
    'underscore',
    'backbone'
],
    function(
        TodoApp,
        Todos,
        TodoRouter,
        Worker
        ){
        var todo = new Todos();
        new TodoApp(todo);
        new Worker(todo);
        new TodoRouter();
	    Backbone.history.start();
    });
