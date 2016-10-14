import os

from google.appengine.ext.webapp import template
import webapp2

class MainHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {
            'Name': 'Cristian Javier Turcios Colindres 13/09/2016',
        }
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path,template_values))

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
