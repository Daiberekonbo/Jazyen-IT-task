from django.urls import path
from .views import job_list_create, application_list_create, application_update_status
from .views import conversations_list_create, conversation_detail, conversation_post_message

urlpatterns = [
    path('jobs/', job_list_create, name='job-list-create'),
    path('applications/', application_list_create, name='application-list-create'),
    path('applications/<str:application_id>/status/', application_update_status, name='application-update-status'),
    path('conversations/', conversations_list_create, name='conversations-list-create'),
    path('conversations/<str:conv_id>/', conversation_detail, name='conversation-detail'),
    path('conversations/<str:conv_id>/messages/', conversation_post_message, name='conversation-post-message'),
]