from django.urls import path
from . import api

urlpatterns = [
    path('', api.chat_details, name='chat_details'),
    path('create/', api.chat_create, name='chat_create'),
    path('add/', api.chat_add, name='chat_add'),
    path('<uuid:message_id>/edit/', api.chat_update, name='chat_update'),
    path('<uuid:chat_id>/delete/', api.chat_delete, name='chat_delete')
]