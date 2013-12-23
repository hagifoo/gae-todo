#!/usr/bin/env python
import logging
from os.path import join, dirname
import sys

from django.conf import settings
import webapp2

# add local modules
sys.path.insert(0, join(dirname(__file__)))

logging.getLogger().setLevel(logging.DEBUG)

# Django Settings
settings.configure(TEMPLATE_DIRS=(join(dirname(__file__), 'html'),))

### Variables
handlers = []

### Main
app = webapp2.WSGIApplication([
    webapp2.Route(r'/api/todos/<id_:\d+>', 'todo_api.Handler'),
    webapp2.Route(r'/api/todos', 'todo_api.Handler'),
    webapp2.Route(r'/api/channel/<client_id:.*>', 'channel_api.Handler'),
    webapp2.Route(r'/api/channel', 'channel_api.Handler'),
    webapp2.Route(r'/_ah/channel/connected/', 'channel_api.OnConnect'),
    webapp2.Route(r'/_ah/channel/disconnected/', 'channel_api.OnDisconnect'),

    webapp2.Route(r'/', 'index_html.Handler')
], debug=True)