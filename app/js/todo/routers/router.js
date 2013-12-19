define([
    'todo/models/todo-filter',
    'backbone'
],
function (TodoFilter) {
	'use strict';

	// Todo Router
	// ----------
	var TodoRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

        initialize: function(todos) {
            this._todos = todos;
        },

		setFilter: function (param) {
			// Set the current filter to be used
			TodoFilter.set({state: param || ''});
		}
	});

    return TodoRouter;
});
