import json
import unittest
import webapp2

from google.appengine.ext import testbed

from model import Todo
import main

class DemoTestCase(unittest.TestCase):
    def setUp(self):
        # First, create an instance of the Testbed class.
        self.testbed = testbed.Testbed()
        # Then activate the testbed, which prepares the service stubs for use.
        self.testbed.activate()
        # Next, declare which service stubs you want to use.
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()

    def tearDown(self):

        self.testbed.deactivate()

    def testGet(self):
        todo1 = {
            'title': 'test1',
            'order': 1,
            'completed': False
        }
        key = Todo(**todo1).put()
        todo1['id'] = key.id()

        request = webapp2.Request.blank('/api/todos')
        response = request.get_response(main.app)
        self.assertEqual([todo1], json.loads(response.body))

if __name__ == '__main__':
    unittest.main()