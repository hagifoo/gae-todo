import json
import logging

from google.appengine.api import channel
from google.appengine.ext import webapp

from model import Channel

### Implementation
class Handler(webapp.RequestHandler):
    def get(self, client_id):
        token = channel.create_channel(client_id)
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(json.dumps({
            'token': token
        }))

    def post(self, client_id):
        #TODO: we should use memcached for performance.
        for ch in Channel.query():
            id = ch.key.id()
            if id == client_id:
                continue
            channel.send_message(id, self.request.body)

class OnConnect(webapp.RequestHandler):
    def post(self):
        client_id = self.request.get('from')
        logging.error('connected!: {}'.format(client_id))

        Channel(id=client_id).put()

class OnDisconnect(webapp.RequestHandler):
    def post(self):
        client_id = self.request.get('from')
        logging.error('disconnected!: {}'.format(client_id))

        ch = Channel.get_by_id(client_id)
        if ch:
            ch.key.delete()
