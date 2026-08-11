from django.urls import path
from .views import job_list_create, application_list_create, application_update_status

urlpatterns = [
    path('jobs/', job_list_create, name='job-list-create'),
    path('applications/', application_list_create, name='application-list-create'),
    path('applications/<str:application_id>/status/', application_update_status, name='application-update-status'),
]