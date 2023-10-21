import json
from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

from .models import User

# Create your tests here.

class AccountApiTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        # Setup users and login
        cls.user1 = User.objects.create_user(
          name='beterraba', email='beterraba@gmail.com', password='titanic12345')
        cls.user2 = User.objects.create_user(
          name='melao', email='melao@gmail.com', password='shark12345')

        beterraba_token_response = cls.client.post(reverse('token_obtain'), {
          'email': 'beterraba@gmail.com', 
          'password': 'titanic12345'
        })

        cls.access = beterraba_token_response.json()['access']


    def test_signup_and_login_response(self):
        # Perform a POST request to the 'signup' view with missing fields
        response = self.client.post(reverse('signup'), {})
        self.assertEqual(response.status_code, 200)

        expected_errors = {
            'email': [{'message': 'This field is required.', 'code': 'required'}],
            'password1': [{'message': 'This field is required.', 'code': 'required'}],
            'password2': [{'message': 'This field is required.', 'code': 'required'}]
        }
        self.assertDictEqual(json.loads(response.json()['message']), expected_errors)

        payload = { 
            'name': 'morango', 
            'email': 'morango@gmail.com', 
            'password1': 'qualia12345', 
            'password2': 'qualia12345' 
        }
        response = self.client.post(reverse('signup'), payload)
        self.assertEqual(response.json()['message'], 'success')
        self.assertEqual(response.status_code, 200)

        response = self.client.get(reverse('me'))
        self.assertEqual(
            response.json()['detail'], 
            'Authentication credentials were not provided.'
        )
        self.assertEqual(response.status_code, 401)

        response = self.client.post(reverse('token_obtain'), {
            'email': 'morango@gmail.com', 
            'password': 'qualia12345'
        })

        response = self.client.get(
            reverse('me'), 
            headers={'Authorization': f"Bearer {response.json()['access']}"}
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['name'], 'morango')
        self.assertEqual(response.json()['email'], 'morango@gmail.com')