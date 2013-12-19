define([
    'backbone'
], function(){
    var TodoFilter = Backbone.Model.extend({
        defaults: {
            state: ''
        },

        isHidden: function(completed) {
            var state = this.get('state');
            return (// hidden cases only
				(!completed && state === 'completed') ||
				(completed && state === 'active')
			);
        }
    });

    var filter = new TodoFilter();
    return filter;
})