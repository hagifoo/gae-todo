define([
    'channel',
    'backbone'
], function(){
        var Channel = Backbone.Model.extend({
            initialize: function(){
                this._channel = null;
                this._clientId = this.createId();
            },

            createId: function() {
                var rand = Math.floor(Math.random() * 1000);
                var date = new Date();
                var time = date.getTime();
                return rand + '_' + time.toString();
            },

            open: function() {
                $.ajax({
                    type: 'GET',
                    url: '/api/channel/' + this._clientId,
                    timeout: 10000
                })
                    .done(function(data){
                        this._channel = new goog.appengine.Channel(data.token);
                        this._channel.open({
                            onopen: this.onOpen,
                            onmessage: this.onMessage.bind(this),
                            onerror: this.onError,
                            onclose: this.onClose
                        })
                    }.bind(this))
            },

            onOpen: function(){
                console.log('channel opened!');
            },

            onMessage: function(message) {
                var m = JSON.parse(message.data);
                this.trigger(m.path, m.data);
            },

            onError: function(error) {
                console.log(error.code + ':' + error.description);
            },

            onClose: function() {
                console.log('closed');
                this.open();
            },

            sendMessage: function(path, data){
                var d = {
                    path: path,
                    data: data
                };
                $.ajax({
                    type: 'POST',
                    url: '/api/channel/' + this._clientId,
                    dataType: 'json',
                    data: JSON.stringify(d)
                })
            }
        })

        ch = new Channel();
        return ch;
    }
)