import json
import logging

from google.appengine.api import channel
from google.appengine.ext import webapp

from model import Todo


class Handler(webapp.RequestHandler):
    def get(self):
        todos = []
        for todo in Todo.query():
            d = todo.to_dict()
            d['id'] = todo.key.id()
            todos.append(d)
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(json.dumps(todos))

    def post(self):
        j = json.loads(self.request.body)
        key = Todo(**j).put()

        self.response.out.write(json.dumps({'id': key.id()}))

    def put(self, id_):
        todo = Todo.get_by_id(int(id_))
        j = json.loads(self.request.body)
        for k, v in j.iteritems():
            setattr(todo, k, v)

        todo.put()

    def delete(self, id_):
        todo = Todo.get_by_id(int(id_))
        if todo is None:
            return

        todo.key.delete()