define([
    'backbone'
],
function () {
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
			var TodoFilter = param || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of Todo view items
			this._todos.trigger('filter');
		}
	});

    return TodoRouter;
});
