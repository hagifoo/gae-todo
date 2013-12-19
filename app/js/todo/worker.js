define([
    'todo/models/todo',
    'channel-handler'
],
    function(
        Todo,
        Channel
        ) {
        var Worker = Backbone.View.extend({
            initialize: function(todos) {
                Channel.open();
                this._todos = todos;
                this._changed = [];

                this.listenTo(todos, 'add', this.onAdd);
                this.listenTo(todos, 'change', this.onChange);
                this.listenTo(todos, 'remove', this.onRemove);

                this.listenTo(Channel, '/add', this.add);
                this.listenTo(Channel, '/change', this.change);
                this.listenTo(Channel, '/remove', this.remove);
            },

            onAdd: function(model) {
                Channel.sendMessage('/add', model.toJSON());
            },

            onChange: function(model) {
                var idx = this._changed.indexOf(model.id);
                if(idx >= 0) {
                    this._changed.splice(idx, 1);
                    return;
                }
                Channel.sendMessage('/change', model.toJSON());
            },

            onRemove: function(model) {
                Channel.sendMessage('/remove', model.toJSON());
            },

            add: function(data) {
                var model = new Todo(data);
                if(!this._todos.get(model.id)) {
                    this._todos.add(model);
                    model.trigger('highlight');
                }
            },

            change: function(data) {
                var todo = this._todos.get(data.id);
                this._changed.push(data.id);
                if(todo) {
                    todo.set(data);
                    todo.trigger('highlight');
                }
            },

            remove: function(data) {
                var todo = this._todos.get(data.id);
                if(todo)
                    todo.trigger('destroy');
                    this._todos.remove(todo);
            }
        });

        return Worker;
    });