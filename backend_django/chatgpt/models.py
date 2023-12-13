import uuid

from django.db import models
from django.utils.timesince import timesince

from account.models import User

# Create your models here.

class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    messages = models.ManyToManyField('ChatMessage', related_name='chats')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('created_at',)

    def modified_at_formatted(self):
        return timesince(self.created_at)


class ChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('created_at',)

    def modified_at_formatted(self):
        return timesince(self.created_at)
