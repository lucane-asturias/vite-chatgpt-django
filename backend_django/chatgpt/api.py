from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, authentication_classes, permission_classes

from account.models import User

from .models import Chat, ChatMessage
from .serializers import ChatSerializer, ChatMessageSerializer

import openai

def request_openai(message):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", # Specify the OpenAI model to use
        messages=[
            {"role": "system", "content": "You are an helpful assistant."},
            {"role": "user", "content": message}, # User's message
        ]
    )

    # Extract and clean the generated response from the API
    answer = response.choices[0].message.content.strip()
    return answer


# Create your models here.


@api_view(['GET'])
def chat_details(request):
    chats = Chat.objects.filter(created_by=request.user)
    serializer = ChatSerializer(chats, many=True)

    return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
def chat_create(request):
    message = request.data.get('message')
    user = request.user

    if message:
        chat_id = request.data.get('chat_id')

        if chat_id:
            # Try to retrieve an existing chat by its id
            chat = get_object_or_404(Chat, id=chat_id, created_by=user)
        else:
            # If chat_id is not provided, create a new chat
            chat = Chat.objects.create(created_by=user)

        response = request_openai(message)

        # Create a new chat mssage
        chat_message = ChatMessage.objects.create(message=message, response=response)
        chat.messages.add(chat_message)

        serializer = ChatMessageSerializer(chat_message)

        return JsonResponse(serializer.data, safe=False)
    else:
      return JsonResponse({'error': 'Message is required'}, status=400)


@api_view(['POST'])
def chat_update(request, message_id=None):
    if message_id:
        # Try to retrieve the chat message 
        # or return a 404 error if not found
        chat_message = get_object_or_404(ChatMessage, id=message_id)

        new_message = request.data.get('message')
        if new_message:
            chat_message.message = new_message
            chat_message.response = request_openai(new_message)
            chat_message.save()

            serializer = ChatMessageSerializer(chat_message)

            return JsonResponse(serializer.data, safe=False)
        else:
            return JsonResponse({'error': 'Message is required'}, status=400)
    else:
        return JsonResponse({'error': 'ID is missing'}, status=400)


@api_view(['DELETE'])
def chat_delete(request, message_id=None):
    if message_id:
        # Try to retrieve the chat message or return a 404 error if not found
        chat_message = get_object_or_404(ChatMessage, id=message_id)
        chat_message.delete()
        return JsonResponse({'message': 'Chat message deleted successfully'}, status=204)
    else:
        return JsonResponse({'error': 'ID is missing'}, status=400)