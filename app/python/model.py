from google.appengine.ext import ndb


class Todo(ndb.Model):
    title = ndb.StringProperty()
    completed = ndb.BooleanProperty()
    order = ndb.IntegerProperty()