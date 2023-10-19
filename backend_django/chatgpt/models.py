import uuid

from django.db import models
from django.utils.timesince import timesince

from account.models import User

# Create your models here.

class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def modified_at_formatted(self):
       return timesince(self.created_at)

    def __str__(self):
        return f'{self.user.username}: {self.message}'