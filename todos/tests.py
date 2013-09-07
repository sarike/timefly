"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from django.test.client import Client
import todos

class ViewTest(TestCase):
    def setUp(self):
        self.client = Client();
class TodosTest(TestCase):
    def test_home(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        todo_list = response.context['todo_list']
        for todo in todo_list:
            self.assertIsInstance(todo, todos.models.Todo)
