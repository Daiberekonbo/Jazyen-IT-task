from django.urls import path
from .views import (
    job_list_create,
    application_list_create,
    application_update_status,
    company_applications,
    conversations_list_create,
    conversation_detail,
    conversation_post_message,
)

urlpatterns = [
    path('jobs/', job_list_create, name='job-list-create'),
    path('jobs/seed-fake/', job_list_create, name='job-seed-fake'),
    path('applications/', application_list_create, name='application-list-create'),
    path('applications/company/', company_applications, name='company-applications'),
    path('applications/<str:application_id>/status/', application_update_status, name='application-update-status'),
    path('conversations/', conversations_list_create, name='conversations-list-create'),
    path('conversations/<str:conv_id>/', conversation_detail, name='conversation-detail'),
    path('conversations/<str:conv_id>/messages/', conversation_post_message, name='conversation-post-message'),
]