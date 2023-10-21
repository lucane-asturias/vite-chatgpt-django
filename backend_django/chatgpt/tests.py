from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from account.models import User
from .models import Chat, ChatMessage

class ChatAPITests(TestCase):
    def setUp(cls):
        cls.client = APIClient()

        cls.user1 = User.objects.create_user(
            name='beterraba', email='beterraba@gmail.com', password='titanic12345')

        beterraba_token_response = cls.client.post(reverse('token_obtain'), {
            'email': 'beterraba@gmail.com', 
            'password': 'titanic12345'
        })

        cls.access = beterraba_token_response.json()['access']


    def test_chat_create(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'

        # Send a POST request to create a chat
        url = reverse('chat_create')
        response = self.client.post(url, {'message': 'Test message'})

        # Assert the response for creating a chat
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(response_data['message'], 'Test message')
        self.assertIsInstance(response_data['response'], str)

        # Send a GET request to retrieve chat details
        response = self.client.get(reverse('chat_details'))
        chat_details = response.json()

        # Assert the chat details
        self.assertEqual(len(chat_details), 1) # Check if one chat is present
        chat = chat_details[0]
        self.assertEqual(chat['created_by']['name'], 'beterraba')

        # Check the messages in the chat
        messages = chat['messages']
        self.assertEqual(len(messages), 1) # Check if there is one message
        message = messages[0]
        self.assertEqual(message['message'], 'Test message')
        self.assertIsInstance(message['response'], str)
        self.assertEqual(message['id'], response_data['id'])

        # Test with an existing id
        self.client.post(url, {'message': 'Say thanks in German', 'chat_id': chat['id']})
        response = self.client.get(reverse('chat_details'))
        chat_messages = response.json()[0]['messages']

        self.assertEqual(len(chat_messages), 2) # Check if there are two messages
        for message in messages:
            self.assertIsInstance(message['message'], str)
            self.assertIn(message['message'], ['Test message', 'Say thanks in German'])


    def test_chat_update(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'
        chat_message = ChatMessage.objects.create(
            message='Original message', response='Original response'
        )

        url = reverse('chat_update', args=[chat_message.id])
        updated_message = 'Updated message'
        response = self.client.post(url, {'message': updated_message})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ChatMessage.objects.get(id=chat_message.id).message, updated_message)


    def test_chat_update_missing_message(self):
        chat_message = ChatMessage.objects.create(message='Original message', response='Original response')
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'
        url = reverse('chat_update', args=[chat_message.id])
        response = self.client.post(url, {})
        print('update', response.json())
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    
    def test_chat_delete(self):
        chat_message = ChatMessage.objects.create(
            message='Test message', response='Test response'
        )
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'
        url = reverse('chat_delete', args=[chat_message.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)