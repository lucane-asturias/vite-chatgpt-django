from rest_framework import serializers

from account.serializers import UserSerializer

from .models import Chat, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ('id', 'message', 'response', 'modified_at_formatted',)


class ChatSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    messages = ChatMessageSerializer(read_only=True, many=True)

    class Meta:
        model = Chat
        fields = ('id', 'messages', 'created_by', 'modified_at_formatted',)