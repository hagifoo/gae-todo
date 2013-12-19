define([
    'todo/views/todo-view',
    'todo/collections/todos',
    'todo/models/todo-filter',
    'backbone'
],
    function(
        TodoView,
        Todos,
        TodoFilter
        ){
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function (todo) {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-todo');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
            this._todos = todo;

			this.listenTo(this._todos, 'add', this.addOne);
			this.listenTo(this._todos, 'reset', this.addAll);
			this.listenTo(this._todos, 'all', this.render);
            this.listenTo(TodoFilter, 'change:state', this.render);

			// Suppresses 'add' events with {reset: true} and prevents the app view 
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			this._todos.fetch({reset: true});
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var completed = this._todos.completed().length;
			var remaining = this._todos.remaining().length;

			if (this._todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (TodoFilter.get('state') || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (todo) {
			var view = new TodoView({ model: todo });
			$('#todo-list').append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$('#todo-list').html('');
			this._todos.each(this.addOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: this._todos.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
				return;
			}

			this._todos.create(this.newAttributes(), {wait: true});
			this.$input.val('');
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(this._todos.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			this._todos.each(function (todo) {
				todo.save({
					'completed': completed
				});
			});
		}
	});
    return AppView;
});
