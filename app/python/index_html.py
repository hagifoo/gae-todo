from google.appengine.ext import webapp
from google.appengine.ext.webapp import template


class Handler(webapp.RequestHandler):
    def get(self):
        self.response.out.write(template.render('html/index.html', {}))